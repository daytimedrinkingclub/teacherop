import app from '@adonisjs/core/services/app'
import Anthropic from '@anthropic-ai/sdk'
import { BaseJob } from 'adonis-resque'
import Course from '#models/course'
import Module from '#models/module'
import PlanSummary from '#models/plan_summary'
import env from '#start/env'
import { createModuleTool } from '#tools'
import CreateSubmodulesJob from '#jobs/create_submodules'

interface CreateModulesJobArgs {
  planSummaryId: string
}

export default class CreateModulesJob extends BaseJob {
  async perform({ planSummaryId }: CreateModulesJobArgs) {
    await this.createModules(planSummaryId)
  }

  private async createModules(planSummaryId: string) {
    const planSummary = await PlanSummary.find(planSummaryId)

    if (!planSummary) return

    const modules = planSummary.modules

    const { aiResponse: planSummaryAiResponse, ...planSummaryWithoutAiResponse } =
      planSummary.serialize()

    const course = await Course.find(planSummary.courseId)

    if (!course) return

    for (const moduleTitle of modules.split(',')) {
      console.log('creating module: ', moduleTitle)
      const messages = [
        {
          role: 'user',
          content: `Hey I want to learn something and got a plan and a course summary, can you help me create a module named '${moduleTitle}' for the course?`,
        },
        {
          role: 'assistant',
          content: `Sure, I will assist you. Share the plan and the course summary with me and I will create the module '${moduleTitle}' for you.`,
        },
        {
          role: 'user',
          content: `course summary: ${JSON.stringify(course.serialize())}, plan summary: ${JSON.stringify(planSummaryWithoutAiResponse)}`,
        },
      ] as Anthropic.Messages.MessageParam[]

      // const oldModules = await Module.query().where('course_id', course.id)
      // const oldCheckpointsSerialized = oldModules.map((module) => module.serialize())
      //
      // for (let checkpoint of oldCheckpointsSerialized) {
      //   const toolUse = checkpoint.aiResponse?.content[checkpoint.aiResponse?.content.length - 1]
      //
      //   const { id, type, title, description, content } = checkpoint
      //
      //   messages.push({ role: 'assistant', content: checkpoint.aiResponse?.content })
      //   messages.push({
      //     role: 'user',
      //     content: [
      //       {
      //         type: 'tool_result',
      //         tool_use_id: toolUse.id,
      //         content: JSON.stringify({ id, type, title, description, content }),
      //       },
      //     ],
      //   })
      // }

      const ai = await app.container.make('ai')

      const response = await ai.ask({
        model: env.get('LLM_MODEL', 'claude-3-5-sonnet-20240620'),
        messages,
        max_tokens: 2000,
        temperature: 0,
        tools: createModuleTool,
      })

      console.log('<!--------->')
      console.log('AI Response in create Module', JSON.stringify(response, null, 2))
      console.log('<!--------->')

      if (response.stop_reason === 'tool_use') {
        const toolsToUse = response.content.filter((tool) => tool.type === 'tool_use')
        const toolsText = response.content.filter((tool) => tool.type === 'text')

        for (let tool of toolsToUse) {
          const toolName = tool.name
          const toolInput = tool.input as {
            title: string
            description: string
            content: string
            order: number
            sub_modules: string[]
          }
          const aiResponse = { ...response, content: [...toolsText, tool] }
          if (toolName === 'generate_course_module') {
            const module = await Module.create({
              title: toolInput.title,
              description: toolInput.description,
              order: toolInput.order,
              aiResponse,
              submodules: JSON.stringify(toolInput.sub_modules),
              courseId: planSummary.courseId,
            })

            await module.save()
            await CreateSubmodulesJob.enqueue({ moduleId: module.id })
          }
        }
      } else if (response.stop_reason === 'end_turn') {
      }
    }
    course.isModulesCreated = true
    await course.save()
  }
}
