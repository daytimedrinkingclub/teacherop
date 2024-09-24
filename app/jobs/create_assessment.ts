import { BaseJob } from 'adonis-resque'
import Anthropic from '@anthropic-ai/sdk'
import app from '@adonisjs/core/services/app'

import Submodule from '#models/submodule'
import env from '#start/env'
import { createAssessmentTool } from '#tools'

interface Args {
  submoduleId: string
}

export default class CreateAssessmentJob extends BaseJob {
  async perform({ submoduleId }: Args) {
    const submodule = await Submodule.find(submoduleId)
    if (!submodule) return
    const metadata = await submodule.getMeta()

    const messages: Anthropic.Messages.MessageParam[] = [
      {
        role: 'user',
        content:
          "Create assessment to evaluate a user's understanding of a topic based on topic details.",
      },
      {
        role: 'assistant',
        content: 'Sure, I will create that for you. Please share the details of the topic.',
      },
      {
        role: 'user',
        content: JSON.stringify(metadata),
      },
    ]

    const ai = await app.container.make('ai')

    const response = await ai.ask({
      model: env.get('LLM_MODEL', 'claude-3-5-sonnet-20240620'),
      messages,
      max_tokens: 2000,
      temperature: 0,
      tools: createAssessmentTool,
      tool_choice: { name: 'generate_assessment', type: 'tool' },
    })

    console.log('<!--------->')
    console.log('ai response ---> create assessment -->', JSON.stringify(response, null, 2))
    console.log('<!--------->')

    if (response.stop_reason === 'tool_use') {
      const tool = response.content[response.content.length - 1]
      if (tool.type === 'tool_use') {
        const {
          question_one: questionOne,
          question_one_answer: questionOneAnswer,
          question_two: questionTwo,
          question_two_answer: questionTwoAnswer,
          question_three: questionThree,
          question_three_answer: questionThreeAnswer,
        } = tool.input as {
          question_one: string
          question_one_answer: string
          question_two: string
          question_two_answer: string
          question_three?: string
          question_three_answer?: string
        }

        const assessments = [
          {
            question: questionOne,
            aiAnswer: questionOneAnswer,
            userId: submodule.userId,
            aiResponse: response,
          },
          {
            question: questionTwo,
            aiAnswer: questionTwoAnswer,
            userId: submodule.userId,
            aiResponse: response,
          },
        ]
        if (questionThree && questionThreeAnswer) {
          assessments.push({
            question: questionThree,
            aiAnswer: questionThreeAnswer,
            userId: submodule.userId,
            aiResponse: response,
          })
        }

        await submodule.related('assessment').createMany(assessments)
      }
    }
  }
}
