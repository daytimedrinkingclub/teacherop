import app from '@adonisjs/core/services/app'
import Anthropic from '@anthropic-ai/sdk'
import { BaseJob } from 'adonis-resque'

import UserDto from '#dtos/user_dto'
import Module from '#models/module'
import PlanSummary from '#models/plan_summary'
import Submodule from '#models/submodule'
import env from '#start/env'
import { createSubmoduleTool } from '#tools'
import CreateContentJob from '#jobs/create_content'

interface CreateSubmodulesJobArgs {
  moduleId: string
}

export default class CreateSubmodulesJob extends BaseJob {
  async perform({ moduleId }: CreateSubmodulesJobArgs) {
    await this.createSubmodules(moduleId)
  }

  private async createSubmodules(moduleId: string) {
    const module = await Module.find(moduleId)
    if (!module) return

    const planSummary = await PlanSummary.findBy('course_id', module.courseId)
    if (!planSummary) return

    const course = await module.related('course').query().first()
    if (!course) return

    const { aiResponse: planSummaryAiResponse, ...planSummaryWithoutAiResponse } =
      planSummary.serialize()

    const { aiResponse: moduleAiResponse, ...moduleWithoutAiResponse } = module.serialize()
    const submodules = JSON.parse(module.submodules) as string[]

    const user = await module.related('user').query().first()

    for (const submoduleTitle of submodules) {
      console.log('creating submodule: ', submoduleTitle)
      const messages: Anthropic.Messages.MessageParam[] = [
        {
          role: 'user',
          content: `Hey I want to learn something and got a plan, a course summary and module summary, help me create a submodule named '${submoduleTitle}' for the course? About myself ${JSON.stringify(new UserDto(user!).toJSON())}`,
        },
        {
          role: 'assistant',
          content: `Sure, I will assist you. Share the plan, the course summary and module summary with me and I will create the submodule '${submoduleTitle}' for you.`,
        },
        {
          role: 'user',
          content: `course summary: ${JSON.stringify(course.serialize())}, plan summary: ${JSON.stringify(planSummaryWithoutAiResponse)}, module summary: ${JSON.stringify(moduleWithoutAiResponse)}`,
        },
      ]

      const ai = await app.container.make('ai')

      const response = await ai.ask({
        model: env.get('LLM_MODEL', 'claude-3-5-sonnet-20240620'),
        messages,
        max_tokens: 2000,
        temperature: 0,
        tools: createSubmoduleTool,
        tool_choice: { name: 'generate_course_submodule', type: 'tool' },
      })

      if (response.stop_reason === 'tool_use') {
        const tool = response.content[response.content.length - 1]
        if (tool.type === 'tool_use') {
          const { title, description, order } = tool.input as {
            title: string
            description: string
            order: number
          }

          const submodule = await Submodule.create({
            title,
            description,
            order,
            userId: module.userId,
            aiResponse: response,
            moduleId: module.id,
          })

          console.log('submodule created :', submodule.title)
          // todo)) only create next 2 content of submodule of current
          if (module.order === 1 && submodule.order <= 2) {
            await CreateContentJob.enqueue({ submoduleId: submodule.id })
          }
        }
      }
    }

    module.submodulesCreated = true
    await module.save()
  }
}
