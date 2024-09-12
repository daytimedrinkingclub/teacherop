import OnboardCourseJob from '#jobs/onboard_course'
import type { HttpContext } from '@adonisjs/core/http'

export default class CoursesController {
  async index({ inertia, auth }: HttpContext) {
    const user = auth.user!

    const courses = await user.related('courses').query()

    return inertia.render('courses/index', { courses, user })
  }

  async create({ response, inertia, auth }: HttpContext) {
    const user = auth.user!
    const isOngoing = await user.related('courses').query().where('status', 'ongoing').first()

    if (isOngoing) return response.redirect('/courses')

    return inertia.render('courses/create', { user })
  }

  async store({ request, response, auth }: HttpContext) {
    const user = auth.user!

    const isOngoing = await user.related('courses').query().where('status', 'ongoing').first()

    if (isOngoing) return response.redirect('/courses')

    const { query } = request.body()

    const course = await user.related('courses').create({ query })

    await OnboardCourseJob.enqueue({ id: course.id })

    return response.created({ course })
  }

  async show({ inertia, auth, params }: HttpContext) {
    const user = auth.user!
    const course = await user.related('courses').query().where('id', params.id).first()
    if (!course) return inertia.render('errors/not_found')

    const modules = await course
      .related('checkpoints')
      .query()
      .where('type', 'module')
      .orderBy('created_at', 'asc')
    const modulesWithSubmodules = []

    for (const module of modules) {
      const submodules = await module
        .related('children')
        .query()
        .where('type', 'submodule')
        .orderBy('created_at', 'asc')
      modulesWithSubmodules.push({
        ...module.serialize(),
        submodules: submodules.map((s) => s.serialize()),
      })
    }

    return inertia.render('courses/show', { course, user, modules: modulesWithSubmodules })
  }
}
