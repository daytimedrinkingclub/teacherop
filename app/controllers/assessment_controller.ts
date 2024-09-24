import type { HttpContext } from '@adonisjs/core/http'

import UserDto from '#dtos/user_dto'
import bindSubmodule from '#decorators/bind_submodule'
import Submodule from '#models/submodule'
import AssessmentDto from '#dtos/assessment_dto'
import CourseDto from '#dtos/course_dto'
import ModuleDto from '#dtos/module_dto'
import SubmoduleDto from '#dtos/submodule_dto'
import { validateAssessmentAnswer } from '#validators/assessment_validator'
import app from '@adonisjs/core/services/app'
import env from '#start/env'
import { evaluateAssessmentTool } from '#tools'
import Anthropic from '@anthropic-ai/sdk'

export default class AssessmentController {
  @bindSubmodule()
  async show({ inertia, auth }: HttpContext, submodule: Submodule) {
    const user = auth.user!

    const module = await submodule.related('module').query().first()

    const course = await module?.related('course').query().first()

    const assessmentsData = await submodule.related('assessment').query()
    // .whereNull('user_answer')
    const assessments = assessmentsData.map((a) => new AssessmentDto(a).toJSON())

    return inertia.render('assessment/show', {
      user: new UserDto(user).toJSON(),
      assessments,
      course: new CourseDto(course!).toJSON(),
      module: new ModuleDto(module!).toJSON(),
      submodule: new SubmoduleDto(submodule!).toJSON(),
    })
  }

  @bindSubmodule()
  async answer({ auth, request, response }: HttpContext, submodule: Submodule) {
    const user = auth.user!
    const question = await request.validateUsing(validateAssessmentAnswer)
    const assessment = await submodule
      .related('assessments')
      .query()
      .whereNull('user_answer')
      .where('id', question.id)
      .first()
    if (!assessment) return response.notFound({ success: false, message: 'assessment not found' })

    assessment.userAnswer = question.answer
    await assessment.save()
    const meta = await submodule.getMeta()

    const messages: Anthropic.Messages.MessageParam[] = [
      {
        role: 'user',
        content: 'Evaluate some question answer and determine if the answer is acceptable.',
      },
      {
        role: 'assistant',
        content: 'Sure, I will evaluate that for you. Please share the details.',
      },
      {
        role: 'user',
        content: `evaluation question details:${{ question: assessment.question, aiAnswer: assessment.aiAnswer, userAnswer: assessment.userAnswer }}, user preference: ${JSON.stringify(meta)}`,
      },
    ]

    const ai = await app.container.make('ai')
    const aiResponse = await ai.ask({
      model: env.get('LLM_MODEL', 'claude-3-5-sonnet-20240620'),
      messages,
      max_tokens: 2000,
      temperature: 0,
      tools: evaluateAssessmentTool,
      tool_choice: { name: 'evaluate_assessment', type: 'tool' },
    })

    console.log('<!--------->')
    console.log('ai response --> evaluate assessment -->', JSON.stringify(aiResponse, null, 2))
    console.log('<!--------->')

    if (aiResponse.stop_reason === 'tool_use') {
      const tool = aiResponse.content[aiResponse.content.length - 1]
      if (tool.type === 'tool_use') {
        const { acceptable, remark } = tool.input as {
          acceptable: boolean
          remark?: string
        }
      }
    }
  }
}
