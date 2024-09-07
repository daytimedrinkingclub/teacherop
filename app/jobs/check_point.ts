import app from '@adonisjs/core/services/app'
import { BaseJob } from 'adonis-resque'

import { CheckpointType } from '#enums/checkpoint'
import Checkpoint from '#models/checkpoint'
import Course from '#models/course'
import PlanSummary from '#models/plan_summary'
import env from '#start/env'
import { checkpointTools } from '#tools'
import transmit from '@adonisjs/transmit/services/main'
import Anthropic from '@anthropic-ai/sdk'

interface CheckPointJobArgs {
  planSummaryId: string
}

export default class CheckPointJob extends BaseJob {
  perform({ planSummaryId }: CheckPointJobArgs) {
    this.createCheckpoint(planSummaryId)
  }

  private async createCheckpoint(planSummaryId: string) {
    const planSummary = await PlanSummary.find(planSummaryId)

    if (!planSummary) return

    const { aiResponse, ...planSummaryWithoutAiResponse } = planSummary

    const course = await Course.find(planSummary.courseId)

    if (!course) return

    const messages = [
      {
        role: 'user',
        content: `Hey I want to learn something and got a plan and a course summary, can you help me create a checkpoint for the course?`,
      },
      {
        role: 'assistant',
        content: `Sure, I will assist you. Share the plan and the course summary with me and I will create a checkpoint for you.`,
      },
      {
        role: 'user',
        content: `Hey help me create all the checkpoints for the course with the following plan: ${JSON.stringify(planSummaryWithoutAiResponse)} and the following course summary: ${JSON.stringify(course)}`,
      },
    ] as Anthropic.Messages.MessageParam[]

    const oldCheckpoints = await Checkpoint.query().where('course_id', course.id)
    const oldCheckpointsSerialized = oldCheckpoints.map((checkpoint) => checkpoint.serialize())

    for (let checkpoint of oldCheckpointsSerialized) {
      const toolUse = checkpoint.aiResponse?.content[checkpoint.aiResponse?.content.length - 1]

      const { aiResponse, ...checkpointWithoutAiResponse } = checkpoint

      console.log('tool Use', JSON.stringify(toolUse, null, 2))

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
    console.log('messages', JSON.stringify(messages, null, 2))
    const response = await ai.ask({
      model: env.get('LLM_MODEL', 'claude-3-5-sonnet-20240620'),
      messages,
      max_tokens: 1000,
      temperature: 0,
      tools: checkpointTools,
    })

    console.log('<!--------->')
    console.log('AI Response in create checkpoint', JSON.stringify(response, null, 2))
    console.log('<!--------->')

    if (response.stop_reason === 'tool_use') {
      const toolsToUse = response.content.filter((tool) => tool.type === 'tool_use')
      const toolsText = response.content.filter((tool) => tool.type === 'text')

      for (let tool of toolsToUse) {
        if (tool.name === 'generate_course_checkpoint') {
          console.log('<!--------->')
          console.log('Tool Use in create checkpoint', JSON.stringify(tool, null, 2))
          console.log('<!--------->')

          const toolName = tool.name
          const toolInput = tool.input as {
            type: string
            title: string
            description: string
            content: string
            parent_id: string | null
          }
          const aiResponse = { ...response, content: [...toolsText, tool] }

          if (toolName === 'generate_course_checkpoint') {
            const checkpoint = await Checkpoint.create({
              type: toolInput.type as CheckpointType,
              title: toolInput.title,
              description: toolInput.description,
              content: toolInput.content,
              userId: planSummary.userId,
              aiResponse,
              courseId: planSummary.courseId,
              parentId: toolInput.parent_id,
            })

            await checkpoint.save()

            transmit.broadcast('checkpoint_created', {
              checkpointId: checkpoint.id,
            })
          }

          // recursively create checkpoints for the new checkpoint and its children until no more checkpoints are created
          await this.createCheckpoint(planSummaryId)
        }
      }
    } else if (response.stop_reason === 'end_turn') {
      // create course title and description

      // transmit.broadcast('course_created', {
      transmit.broadcast('course_created', {
        courseId: planSummary.courseId,
      })
    }
  }
}
