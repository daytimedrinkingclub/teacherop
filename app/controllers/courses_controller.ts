import type { HttpContext } from '@adonisjs/core/http'

import bindCourse from '#decorators/bind_course'
import CheckPointDto from '#dtos/checkpoint_dto'
import CourseDto from '#dtos/course_dto'
import UserDto from '#dtos/user_dto'
import OnboardCourseJob from '#jobs/onboard_course'
import Course from '#models/course'

export default class CoursesController {
  async index({ inertia, auth }: HttpContext) {
    const user = auth.user!

    const courses = (await user.related('courses').query()).map((c) => new CourseDto(c).toJSON())

    return inertia.render('courses/index', { courses, user: new UserDto(user).toJSON() })
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

  @bindCourse()
  async show({ inertia, auth }: HttpContext, course: Course) {
    const user = auth.user!

    const modules = await course
      .related('checkpoints')
      .query()
      .where('type', 'module')
      .orderBy('created_at', 'asc')
    const modulesWithSubmodules = []

    for (const module of modules!) {
      const submodules = await module
        .related('children')
        .query()
        .where('type', 'submodule')
        .orderBy('created_at', 'asc')
      modulesWithSubmodules.push({
        ...new CheckPointDto(module).toJSON(),
        submodules: submodules.map((s) => new CheckPointDto(s).toJSON()),
      })
    }

    return inertia.render('courses/show', {
      course: new CourseDto(course).toJSON(),
      user: new UserDto(user).toJSON(),
      modules: modulesWithSubmodules,
    })
  }
}
