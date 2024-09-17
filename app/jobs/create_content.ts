import { BaseJob } from 'adonis-resque'
import Submodule from '#models/submodule'
import Anthropic from '@anthropic-ai/sdk'
import env from '#start/env'
import app from '@adonisjs/core/services/app'
import { createContentTool } from '#tools'
import Content from '#models/content'

interface CreateContentJobArgs {
  submoduleId: string
}

export default class CreateContentJob extends BaseJob {
  async perform({ submoduleId }: CreateContentJobArgs) {
    const submodule = await Submodule.find(submoduleId)
    if (!submodule) return

    const messages: Anthropic.Messages.MessageParam[] = [
      {
        role: 'user',
        content: `Hey I want to learn something and got a plan, a course summary , module summary and submodule summary, help me create detailed content in MD format for the submodule named ${submodule.title}.`,
      },
      {
        role: 'assistant',
        content: `Sure, I will assist you. Share the details of the submodule and I will create the content of '${submodule.title}' submodule for you.`,
      },
      {
        role: 'user',
        content: JSON.stringify(submodule.serialize()),
      },
    ]

    const ai = await app.container.make('ai')

    const response = await ai.ask({
      model: env.get('LLM_MODEL', 'claude-3-5-sonnet-20240620'),
      messages,
      max_tokens: 2000,
      temperature: 0,
      tools: createContentTool,
      tool_choice: { name: 'generate_content', type: 'tool' },
    })
    console.log('<!--------->')
    console.log(JSON.stringify(response, null, 2))
    console.log('<!--------->')

    if (response.stop_reason === 'tool_use') {
      const tool = response.content[response.content.length - 1]
      if (tool.type === 'tool_use') {
        const { value, estimated_duration: estimatedDuration } = tool.input as {
          value: string
          estimated_duration: BigInt
        }

        await Content.create({
          value,
          estimatedDuration,
          submoduleId: submodule.id,
        })
        submodule.contentCreated = true
        await submodule.save()
        console.log('content created for submodule: ', submodule.title)
      }
    }
  }
}
