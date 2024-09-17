import app from '@adonisjs/core/services/app'
import Anthropic from '@anthropic-ai/sdk'
import { BaseJob } from 'adonis-resque'

import { QuestionTypeEnum } from '#enums/question'
import Course from '#models/course'
import env from '#start/env'

import CreateModulesJob from '#jobs/create_modules'
import { onboardingPlanSummaryTools } from '#tools'

interface OnboardCourseJobProps {
  id: string
}

export default class OnboardCourseJob extends BaseJob {
  async perform({ id }: OnboardCourseJobProps) {
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
      max_tokens: 2000,
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

          await course.related('questions').create({
            content: questionText,
            type: questionType,
            meta,
            userId: course.userId,
            aiResponse: response,
          })
        } else if (toolName === 'generate_plan_summary') {
          const {
            plan_overview: planOverview,
            learning_goal: learningGoal,
            module_names: moduleNames,
            course_title: courseTitle,
            course_description: courseDescription,
          } = toolInput as unknown as {
            plan_overview: string
            learning_goal: string
            module_names: string[]
            course_title: string
            course_description: string
          }

          console.log('modules', moduleNames)

          const planSummary = await course.related('planSummary').create({
            planOverview,
            learningGoal,
            modules: JSON.stringify(moduleNames),
            aiResponse: response,
            userId: course.userId,
            courseId: course.id,
          })

          // make the onboarding complete
          course.isOnboardingComplete = true
          course.title = courseTitle
          course.description = courseDescription
          await course.save()

          await CreateModulesJob.enqueue({
            planSummaryId: planSummary.id,
          })
        }
      }
    } else if (response.stop_reason === 'end_turn') {
      if (response.content[0].type === 'text') {
      }

      await course.save()
    }
  }
}
