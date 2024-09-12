import app from '@adonisjs/core/services/app'
import transmit from '@adonisjs/transmit/services/main'
import Anthropic from '@anthropic-ai/sdk'
import { BaseJob } from 'adonis-resque'

import { QuestionTypeEnum } from '#enums/question'
import Course from '#models/course'
import env from '#start/env'

import CheckPointJob from '#jobs/check_point'
import { onboardingPlanSummaryTools } from '#tools'

interface OnboardCourseJobProps {
  id: string
}

export default class OnboardCourseJob extends BaseJob {
  public async perform({ id }: OnboardCourseJobProps) {
    const course = await Course.find(id)
    if (!course) {
      console.log('Course not found, id:', id)
      return
    }

    const ai = await app.container.make('ai')
    const messages = [
      {
        role: 'user',
        content:
          'Hi, I want to learn something, but I am not able to figure out where to begin, or even what to actually learn, can you help me figure out what I should learn?',
      },
      {
        role: 'assistant',
        content:
          'Sure, I will assist you. Please tell me what you want to learn, and I will ask you some follow-up questions to help you figure this out.',
      },
      { role: 'user', content: course.query },
    ] as Anthropic.Messages.MessageParam[]

    // all questions of the course
    const oldQuestions = await course.related('questions').query()
    const oldQuestionsSerialized = oldQuestions.map((question) => question.serialize())

    for (let question of oldQuestionsSerialized) {
      const toolUse = question.aiResponse?.content[question.aiResponse?.content.length - 1]
      messages.push({ role: 'assistant', content: question.aiResponse?.content })
      messages.push({
        role: 'user',
        content: [
          {
            type: 'tool_result',
            tool_use_id: toolUse.id,
            content: question.answer ? question.answer : question.content,
          },
        ],
      })
    }

    const response = await ai.ask({
      model: env.get('LLM_MODEL', 'claude-3-5-sonnet-20240620'),
      messages,
      tools: onboardingPlanSummaryTools,
      max_tokens: 1000,
      temperature: 0,
    })

    console.log('<!--------->')
    console.log('AI Response in onboarding course', JSON.stringify(response, null, 2))
    console.log('<!--------->')

    if (response.stop_reason === 'tool_use') {
      const toolUse = response.content[response.content.length - 1]
      if (toolUse.type === 'tool_use') {
        const toolName = toolUse.name
        const toolInput = toolUse.input

        if (toolName === 'get_onboarding_course_questions') {
          const {
            question_format: questionType,
            question_text: questionText,
            question_meta: rawMeta,
          } = toolInput as unknown as {
            question_format: QuestionTypeEnum
            question_text: string
            question_meta: Record<string, any> | string
          }

          const meta = typeof rawMeta === 'string' ? JSON.parse(rawMeta) : rawMeta

          console.log('<!--------->')
          console.log('courseId', course.id)
          console.log('questionText', questionText)
          console.log('questionType', questionType)
          console.log('meta', JSON.stringify(meta, null, 2))

          const question = await course.related('questions').create({
            content: questionText,
            type: questionType,
            meta,
            userId: course.userId,
            aiResponse: response,
          })

          transmit.broadcast('onboard_course', {
            question: question.serialize(),
          })

          // transmit the question to the user
        } else if (toolName === 'generate_plan_summary') {
          const {
            plan_overview: planOverview,
            learning_goal: learningGoal,
            module_names: moduleNames,
            submodule_name: submoduleNames,
          } = toolInput as unknown as {
            plan_overview: string
            learning_goal: string
            module_names: string[]
            submodule_name: string[]
          }

          console.log('modules', moduleNames)
          console.log('submodules', submoduleNames)

          const planSummary = await course.related('planSummaries').create({
            planOverview,
            learningGoal,
            modules: JSON.stringify(moduleNames),
            subModules: JSON.stringify(submoduleNames),
            aiResponse: response,
            userId: course.userId,
            courseId: course.id,
          })

          transmit.broadcast('onboard_course', {
            planSummary: planSummary.serialize(),
          })

          // make the onboarding complete
          course.isOnboardingComplete = true
          await course.save()

          // create title and description
          const nextResponse = await ai.ask({
            model: env.get('LLM_MODEL', 'claude-3-5-sonnet-20240620'),
            messages: [
              {
                role: 'user',
                content: `Create a title and description for this course: ${JSON.stringify(course.serialize())}`,
              },
            ],
            max_tokens: 1000,
            temperature: 0,
            tools: [
              {
                name: 'generate_course_title_and_description',
                description:
                  "Create a title and description for the course. Please respect the user's input language and always use the language the user uses it can be English, Hindi, Spanish etc. or a mix of languages link Hinglish which is a mix of Hindi and English.",
                input_schema: {
                  type: 'object',
                  properties: {
                    title: { type: 'string', description: 'The title of the course' },
                    description: { type: 'string', description: 'The description of the course' },
                  },
                  required: ['title', 'description'],
                },
              },
            ],
          })

          if (nextResponse.stop_reason === 'tool_use') {
            const toolUse = nextResponse.content[nextResponse.content.length - 1]
            if (toolUse.type === 'tool_use') {
              const toolName = toolUse.name
              const toolInput = toolUse.input
              if (toolName === 'generate_course_title_and_description') {
                const { title, description } = toolInput as unknown as {
                  title: string
                  description: string
                }

                console.log('<!--------->')
                console.log('courseId', course.id)
                console.log('Created course with \ntitle:', title, '\ndescription:', description)
                console.log('<!--------->')

                course.title = title
                course.description = description
                await course.save()
              }
            }
          }

          await CheckPointJob.enqueue({
            planSummaryId: planSummary.id,
          })
        }
      }
    } else if (response.stop_reason === 'end_turn') {
      if (response.content[0].type === 'text') {
        course.content = response.content[0].text
      }

      await course.save()
      if (!oldQuestions.length) {
        transmit.broadcast('onboard_course', {
          error: response.content[0].type === 'text' ? response.content[0].text : 'Unknown error',
        })
      } else {
        transmit.broadcast('onboard_course', {
          course: course.serialize(),
        })
      }
    }
  }
}
