import app from '@adonisjs/core/services/app'
import { BaseJob } from 'adonis-resque'

import { CheckpointTypeEnum } from '#enums/checkpoint'
import Checkpoint from '#models/checkpoint'
import Course from '#models/course'
import PlanSummary from '#models/plan_summary'
import env from '#start/env'
import { createSubmoduleTool, searchTavilyTool } from '#tools'
import Anthropic from '@anthropic-ai/sdk'

interface CreateSubmodulesJobArgs {
  moduleId: string
}

export default class CreateSubmodulesJob extends BaseJob {
  public async perform({ moduleId }: CreateSubmodulesJobArgs) {
    // await this.createSubmodules(courseId)
    await this.createSubmodule(moduleId)
  }

  // private async createSubmodules(courseId: string) {
  //   const course = await Course.find(courseId)
  //   if (!course) return

  //   const modules = await Checkpoint.query()
  //     .where('course_id', course.id)
  //     .andWhere('type', CheckpointTypeEnum['MODULE'])

  //   for (const module of modules) {
  //     console.log('creating submodule for module: ', module.title)
  //     await this.createSubmodule(module.id)
  //   }

  //   course.isModulesCreated = true
  //   await course.save()
  // }

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
        content: `Hey I want to learn something and got a plan, a course summary and module, create checkpoints/submodules for the course using tavily API using 'search_content_and_resources' tool. Tavily may give old/out-dated/legacy information, Please refrain from using old data. Also try to incorporate external reference link in the content. Please try to keep the submodule count within 1 to 10 per module.`,
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

    const oldSubmodules = await Checkpoint.query()
      .where('course_id', course.id)
      .andWhere('parent_id', module.id)
      .orderBy('order', 'desc')
    // .limit(5)
    const oldSubmodulesSerialized = oldSubmodules.map((checkpoint) => checkpoint.serialize())

    for (let submodules of oldSubmodulesSerialized) {
      const toolUse = submodules.aiResponse?.content[submodules.aiResponse?.content.length - 1]

      const { aiResponse, ...checkpointWithoutAiResponse } = submodules

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
    // tavily search using tools
    const tavilyAiToolResponse = await ai.ask({
      model: env.get('LLM_MODEL', 'claude-3-5-sonnet-20240620'),
      messages,
      max_tokens: 2000,
      temperature: 0,
      tools: searchTavilyTool,
      tool_choice: { type: 'tool', name: 'search_content_and_resources' },
    })

    if (tavilyAiToolResponse.stop_reason === 'tool_use') {
      const tool = tavilyAiToolResponse.content[tavilyAiToolResponse.content.length - 1]

      if (tool.type === 'tool_use') {
        if (tool.name === 'search_content_and_resources') {
          const { query } = tool.input as { query: string }

          const tavily = await app.container.make('tavily')
          const tavilyResponse = await tavily.search(query)

          const anthropicResponse = await ai.ask({
            model: env.get('LLM_MODEL', 'claude-3-5-sonnet-20240620'),
            messages: [
              ...messages,
              { role: 'assistant', content: tavilyAiToolResponse.content },
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
            max_tokens: 4000,
            temperature: 0,
            tools: createSubmoduleTool,
            tool_choice: { type: 'tool', name: 'generate_course_submodule' },
          })

          if (anthropicResponse.stop_reason === 'tool_use') {
            const toolsToUse = anthropicResponse.content.filter((tool) => tool.type === 'tool_use')
            const toolsText = anthropicResponse.content.filter((tool) => tool.type === 'text')

            for (let tool of toolsToUse) {
              const toolName = tool.name
              console.log('using tool: ', toolName)

              const aiResponse = {
                ...anthropicResponse,
                content: [...toolsText, tool],
              }

              if (toolName === 'generate_course_submodule') {
                // console.log('<!---------->')
                // console.log(
                //   'AI response submodule create:',
                //   JSON.stringify(anthropicResponse, null, 2)
                // )
                // console.log('<!---------->')

                const { title, description, content, estimated_duration, order } = tool.input as {
                  title: string
                  description: string
                  content: string
                  estimated_duration: BigInt
                  order: number
                }
                const existingCheckpoint = await Checkpoint.query()
                  .where('type', CheckpointTypeEnum.SUBMODULE)
                  .andWhere('order', order)
                  .where('parent_id', module.id)
                  .andWhere('course_id', planSummary.courseId)
                  .first()
                if (!existingCheckpoint) return
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
                console.log('submodules created for module id: ', moduleId)

                console.log('new submodule:', checkpoint.$isNew, checkpoint.id)
                await checkpoint.save()
              }
            }
            this.createSubmodule(moduleId)
          }
        }
      }
    } else if (tavilyAiToolResponse.stop_reason === 'max_tokens') {
      module.children_created = true
      await module.save()
      console.log('<!---------->')
      console.log('Max Token HIT:', JSON.stringify(tavilyAiToolResponse, null, 2))
      console.log('<!---------->')
    } else {
      module.children_created = true
      await module.save()
      console.log('<!---------->')
      console.log('Submodules created for:', module.serialize())
      console.log('<!---------->')
    }

    // const response = await ai.ask({
    //   model: env.get('LLM_MODEL', 'claude-3-5-sonnet-20240620'),
    //   messages,
    //   max_tokens: 4000,
    //   temperature: 0,
    //   tools: createSubmoduleTool,
    // })

    // if (response.stop_reason === 'tool_use') {
    //   const toolsToUse = response.content.filter((tool) => tool.type === 'tool_use')
    //   const toolsText = response.content.filter((tool) => tool.type === 'text')

    //   for (let tool of toolsToUse) {
    //     const toolName = tool.name
    //     console.log('using tool: ', toolName)

    //     const aiResponse = {
    //       ...response,
    //       content: [...toolsText, tool],
    //     }

    //     if (toolName === 'search_content_and_resources') {
    //       const { query } = tool.input as { query: string }

    //       console.log('<!---------->')
    //       console.log('AI response content search submodule:', JSON.stringify(response, null, 2))
    //       console.log('<!---------->')

    //       const tavily = await app.container.make('tavily')
    //       const tavilyResponse = await tavily.search(query)

    //       const aiTavResponse = await ai.ask({
    //         model: env.get('LLM_MODEL', 'claude-3-5-sonnet-20240620'),
    //         messages: [
    //           ...messages,
    //           { role: 'assistant', content: aiResponse.content },
    //           {
    //             role: 'user',
    //             content: [
    //               {
    //                 type: 'tool_result',
    //                 tool_use_id: tool.id,
    //                 content: JSON.stringify(tavilyResponse),
    //               },
    //             ],
    //           },
    //         ],
    //         max_tokens: 8000,
    //         temperature: 0,
    //         tools: createSubmoduleTool,
    //       })

    //       console.log('<!---------->')
    //       console.log('AI response submodule:', JSON.stringify(aiTavResponse, null, 2))
    //       console.log('<!---------->')

    //       if (aiTavResponse.stop_reason === 'tool_use') {
    //         const tool = aiTavResponse.content[aiTavResponse.content.length - 1]

    //         if (tool.type === 'tool_use') {
    //           const { title, description, content, estimated_duration, order } = tool.input as {
    //             title: string
    //             description: string
    //             content: string
    //             estimated_duration: BigInt
    //             order: number
    //           }
    //           const checkpoint = await Checkpoint.firstOrCreate(
    //             {
    //               type: CheckpointTypeEnum['SUBMODULE'],
    //               order,
    //               userId: planSummary.userId,
    //               parentId: module.id,
    //               courseId: planSummary.courseId,
    //             },
    //             {
    //               title,
    //               estimatedDuration: estimated_duration,
    //               aiResponse,
    //               content,
    //               description,
    //             }
    //           )
    //           await checkpoint.save()
    //         }
    //       }
    //     }
    //     // else if (toolName === 'generate_course_submodule') {
    //     //   const { title, description, content, estimated_duration, order } = tool.input as {
    //     //     title: string
    //     //     description: string
    //     //     content: string
    //     //     estimated_duration: BigInt
    //     //     order: number
    //     //   }
    //     //   const checkpoint = await Checkpoint.firstOrCreate(
    //     //     {
    //     //       type: CheckpointTypeEnum['SUBMODULE'],
    //     //       order,
    //     //       userId: planSummary.userId,
    //     //       parentId: module.id,
    //     //       courseId: planSummary.courseId,
    //     //     },
    //     //     {
    //     //       title,
    //     //       estimatedDuration: estimated_duration,
    //     //       aiResponse,
    //     //       content,
    //     //       description,
    //     //     }
    //     //   )
    //     //   await checkpoint.save()
    //     // }
    //   }
    //   this.createSubmodule(moduleId)
    // } else if (response.stop_reason === 'end_turn') {
    //   // console.log('AI response', response)
    // }
  }
}
