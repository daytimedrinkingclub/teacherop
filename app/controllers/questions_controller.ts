import OnboardCourseJob from '#jobs/onboard_course'
import type { HttpContext } from '@adonisjs/core/http'

export default class QuestionsController {
  // public async store({ request, response }: HttpContext) {
  //   const { content, type, courseId } = request.body()
  // }

  public async update({ request, response, auth }: HttpContext) {
    const user = auth.user!

    const { id } = request.params()
    const { answer } = request.body()

    console.log(id, answer)

    const question = await user.related('questions').query().where('id', id).first()

    if (!question) {
      return response.status(404).json({ error: 'Question not found' })
    }

    question.answer = answer
    await question.save()

    await OnboardCourseJob.enqueue({ id: question.courseId })

    return response.json({ question })
  }

  public async current({ response, auth }: HttpContext) {
    const user = auth.user!

    const question = await user.related('questions').query().whereNull('answer').first()

    return response.json({ question })
  }
}
