import app from '@adonisjs/core/services/app'
import Anthropic from '@anthropic-ai/sdk'
import { BaseJob } from 'adonis-resque'

import { CheckpointTypeEnum } from '#enums/checkpoint'
import Checkpoint from '#models/checkpoint'
import Course from '#models/course'
import PlanSummary from '#models/plan_summary'
import env from '#start/env'
import { createModuleTool } from '#tools'

interface CreateModulesJobArgs {
  planSummaryId: string
}

export default class CreateModulesJob extends BaseJob {
  public async perform({ planSummaryId }: CreateModulesJobArgs) {
    await this.createModules(planSummaryId)
  }

  private async createModules(planSummaryId: string) {
    const planSummary = await PlanSummary.find(planSummaryId)

    if (!planSummary) return

    const modules = planSummary.modules

    const { aiResponse, ...planSummaryWithoutAiResponse } = planSummary.serialize()

    const course = await Course.find(planSummary.courseId)

    if (!course) return

    for (const module of modules.split(',')) {
      console.log('creating module: ', module)
      const messages = [
        {
          role: 'user',
          content: `Hey I want to learn something and got a plan and a course summary, can you help me create a checkpoint/module for the course?`,
        },
        {
          role: 'assistant',
          content: `Sure, I will assist you. Share the plan and the course summary with me and I will create a checkpoint for you.`,
        },
        {
          role: 'user',
          content: `create all checkpoint/module for the course with the following course summary: ${JSON.stringify(course.serialize())}, plan summary: ${JSON.stringify(planSummaryWithoutAiResponse)}`,
        },
      ] as Anthropic.Messages.MessageParam[]

      const oldCheckpoints = await Checkpoint.query()
        .where('course_id', course.id)
        .andWhere('type', CheckpointTypeEnum['MODULE'])
      const oldCheckpointsSerialized = oldCheckpoints.map((checkpoint) => checkpoint.serialize())

      for (let checkpoint of oldCheckpointsSerialized) {
        const toolUse = checkpoint.aiResponse?.content[checkpoint.aiResponse?.content.length - 1]
        console.log('toolUse', toolUse)

        const { id, type, title, description, content } = checkpoint

        messages.push({ role: 'assistant', content: checkpoint.aiResponse?.content })
        messages.push({
          role: 'user',
          content: [
            {
              type: 'tool_result',
              tool_use_id: toolUse.id,
              content: JSON.stringify({ id, type, title, description, content }),
            },
          ],
        })
      }

      console.log('messages,', JSON.stringify(messages, null, 2))

      const ai = await app.container.make('ai')

      const response = await ai.ask({
        model: env.get('LLM_MODEL', 'claude-3-5-sonnet-20240620'),
        messages,
        max_tokens: 4000,
        temperature: 0,
        tools: createModuleTool,
      })

      console.log('<!--------->')
      console.log('AI Response in create Module', JSON.stringify(response, null, 2))
      console.log('<!--------->')

      if (response.stop_reason === 'tool_use') {
        const toolsToUse = response.content.filter((tool) => tool.type === 'tool_use')
        const toolsText = response.content.filter((tool) => tool.type === 'text')

        console.log('toolsToUse: ', JSON.stringify(toolsToUse, null, 2))

        for (let tool of toolsToUse) {
          const toolName = tool.name
          const toolInput = tool.input as {
            title: string
            description: string
            content: string
            order: number
          }
          const aiResponse = { ...response, content: [...toolsText, tool] }
          if (toolName === 'generate_course_module') {
            const checkpoint = await Checkpoint.create({
              type: CheckpointTypeEnum['MODULE'],
              title: toolInput.title,
              description: toolInput.description,
              content: toolInput.content,
              order: toolInput.order,
              userId: planSummary.userId,
              estimatedDuration: null,
              aiResponse,
              courseId: planSummary.courseId,
            })

            await checkpoint.save()

            // todo)) fix submodule creation
            // await CreateSubmodulesJob.enqueue({ moduleId: checkpoint.id })
          }
        }
      } else if (response.stop_reason === 'end_turn') {
        // create all the submodules
      }
    }

    course.isModulesCreated = true
    await course.save()
  }
}
