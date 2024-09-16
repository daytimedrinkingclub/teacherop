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
        content: `Hey I want to learn something and got a plan, a course summary and module, create checkpoints/submodules for the course using tavily API using 'search_content_and_resources' tool. Tavily may give old/out-dated/legacy information, Please refrain from using old data. Also try to incorporate external reference link in the content.`,
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

    if (response.stop_reason === 'tool_use') {
      const toolsToUse = response.content.filter((tool) => tool.type === 'tool_use')
      const toolsText = response.content.filter((tool) => tool.type === 'text')

      for (let tool of toolsToUse) {
        const toolName = tool.name
        console.log('using tool: ', toolName)

        const aiResponse = {
          ...response,
          content: [...toolsText, tool],
        }

        if (toolName === 'search_content_and_resources') {
          const { query } = tool.input as { query: string }

          console.log('<!---------->')
          console.log('AI response content search submodule:', JSON.stringify(response, null, 2))
          console.log('<!---------->')

          const tavily = await app.container.make('tavily')
          const tavilyResponse = await tavily.search(query)

          const aiTavResponse = await ai.ask({
            model: env.get('LLM_MODEL', 'claude-3-5-sonnet-20240620'),
            messages: [
              ...messages,
              { role: 'assistant', content: aiResponse.content },
              {
                role: 'user',
                content: [
                  {
                    type: 'tool_result',
                    tool_use_id: tool.id,
                    content: JSON.stringify(tavilyResponse),
                  },
                ],
              },
            ],
            max_tokens: 8000,
            temperature: 0,
            tools: createSubmoduleTool,
          })

          console.log('<!---------->')
          console.log('AI response submodule:', JSON.stringify(aiTavResponse, null, 2))
          console.log('<!---------->')

          if (aiTavResponse.stop_reason === 'tool_use') {
            const tool = aiTavResponse.content[aiTavResponse.content.length - 1]

            if (tool.type == 'tool_use') {
              const { title, description, content, estimated_duration, order } = tool.input as {
                title: string
                description: string
                content: string
                estimated_duration: BigInt
                order: number
              }
              const checkpoint = await Checkpoint.firstOrCreate(
                {
                  type: CheckpointTypeEnum['SUBMODULE'],
                  order,
                  userId: planSummary.userId,
                  parentId: module.id,
                  courseId: planSummary.courseId,
                },
                {
                  title,
                  estimatedDuration: estimated_duration,
                  aiResponse,
                  content,
                  description,
                }
              )
              await checkpoint.save()
            }
          }
        } else if (toolName === 'generate_course_submodule') {
          const { title, description, content, estimated_duration, order } = tool.input as {
            title: string
            description: string
            content: string
            estimated_duration: BigInt
            order: number
          }
          const checkpoint = await Checkpoint.firstOrCreate(
            {
              type: CheckpointTypeEnum['SUBMODULE'],
              order,
              userId: planSummary.userId,
              parentId: module.id,
              courseId: planSummary.courseId,
            },
            {
              title,
              estimatedDuration: estimated_duration,
              aiResponse,
              content,
              description,
            }
          )
          await checkpoint.save()
        }
      }
      this.createSubmodule(moduleId)
    } else if (response.stop_reason === 'end_turn') {
      // console.log('AI response', response)
    }
  }
}
