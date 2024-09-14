import app from '@adonisjs/core/services/app'
import { BaseJob } from 'adonis-resque'

import { CheckpointTypeEnum } from '#enums/checkpoint'
import Checkpoint from '#models/checkpoint'
import Course from '#models/course'
import PlanSummary from '#models/plan_summary'
import env from '#start/env'
import { createSubmoduleTool } from '#tools'
import Anthropic from '@anthropic-ai/sdk'

interface CreateSubmodulesJobArgs {
  courseId: string
}

export default class CreateSubmodulesJob extends BaseJob {
  public async perform({ courseId }: CreateSubmodulesJobArgs) {
    await this.createSubmodules(courseId)
  }

  private async createSubmodules(courseId: string) {
    const course = await Course.find(courseId)
    if (!course) return

    const modules = await Checkpoint.query()
      .where('course_id', course.id)
      .andWhere('type', CheckpointTypeEnum['MODULE'])

    for (const module of modules) {
      console.log('creating submodule for module: ', module.title)
      await this.createSubmodule(module.id)
    }

    course.isModulesCreated = true
    await course.save()
  }

  private async createSubmodule(moduleId: string) {
    const module = (await Checkpoint.find(moduleId))!
    const course = await Course.find(module?.courseId)
    const planSummary = await PlanSummary.findBy('course_id', course?.id)
    if (!planSummary) return

    const { aiResponse: aiRedPlanSum, ...planSummaryWithoutAiResponse } = planSummary.serialize()

    if (!course) return

    const { aiResponse, ...moduleWithoutAIResponse } = module
    const messages = [
      {
        role: 'user',
        content: `Hey I want to learn something and got a plan, a course summary and module, can you help me create checkpoints/submodules for the course?`,
      },
      {
        role: 'assistant',
        content: `Sure, I will assist you. Share the plan, the course summary and module info with me and I will create a checkpoint/submodule for you.`,
      },
      {
        role: 'user',
        content: `create detailed one or more checkpoints/submodules for the course with the following course summary: ${JSON.stringify(course)},plan summary: ${planSummaryWithoutAiResponse} checkpoint/module: ${JSON.stringify(moduleWithoutAIResponse)}.`,
      },
    ] as Anthropic.Messages.MessageParam[]

    const oldCheckpoints = await Checkpoint.query()
      .where('course_id', course.id)
      .andWhere('parent_id', module.id)
      .orderBy('created_at', 'desc')
      .limit(5)
    const oldCheckpointsSerialized = oldCheckpoints.map((checkpoint) => checkpoint.serialize())

    for (let checkpoint of oldCheckpointsSerialized) {
      const toolUse = checkpoint.aiResponse?.content[checkpoint.aiResponse?.content.length - 1]

      const { aiResponse, ...checkpointWithoutAiResponse } = checkpoint

      messages.push({ role: 'assistant', content: aiResponse?.content })
      messages.push({
        role: 'user',
        content: [
          {
            type: 'tool_result',
            tool_use_id: toolUse.id,
            content: JSON.stringify(checkpointWithoutAiResponse),
          },
        ],
      })
    }

    const ai = await app.container.make('ai')
    const response = await ai.ask({
      model: env.get('LLM_MODEL', 'claude-3-5-sonnet-20240620'),
      messages,
      max_tokens: 4000,
      temperature: 0,
      tools: createSubmoduleTool,
    })

    console.log('<!---------->')
    console.log('AI response submodule:', JSON.stringify(response, null, 2))
    console.log('<!---------->')

    if (response.stop_reason === 'tool_use') {
      const toolsToUse = response.content.filter((tool) => tool.type === 'tool_use')
      const toolsText = response.content.filter((tool) => tool.type === 'text')

      for (let tool of toolsToUse) {
        const toolName = tool.name
        const toolInput = tool.input as {
          title: string
          description: string
          content: string
          estimated_duration: BigInt
          order: number
        }
        const aiResponse = { ...response, content: [...toolsText, tool] }

        if (toolName === 'generate_course_submodule') {
          const checkpoint = await Checkpoint.create({
            type: CheckpointTypeEnum['SUBMODULE'],
            title: toolInput.title,
            description: toolInput.description,
            content: toolInput.content,
            userId: planSummary.userId,
            estimatedDuration: toolInput.estimated_duration,
            order: toolInput.order,
            aiResponse,
            courseId: planSummary.courseId,
            parentId: module.id,
          })
          await checkpoint.save()
        }
      }
      this.createSubmodule(moduleId)
    } else if (response.stop_reason === 'end_turn') {
      // console.log('AI response', response)
    }
  }
}
