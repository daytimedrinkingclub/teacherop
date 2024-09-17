import type { HttpContext } from '@adonisjs/core/http'

import bindCourse from '#decorators/bind_course'
import CourseDto from '#dtos/course_dto'
import QuestionDto from '#dtos/question_dto'
import UserDto from '#dtos/user_dto'
import OnboardCourseJob from '#jobs/onboard_course'
import Course from '#models/course'
import ModuleDto from '#dtos/module_dto'
import submoduleDto from '#dtos/submodule_dto'

export default class CoursesController {
  async index({ inertia, auth }: HttpContext) {
    const user = auth.user!

    const courses = await user.related('courses').query()
    for (const course of courses) {
      await course.load('modules')
    }

    // const totalModules = await Module.query()
    // const completedModules = await Module.query()
    //   .where('type', CheckpointTypeEnum.MODULE)
    //   .andWhere('is_completed', true)

    const data = courses.map((c) => ({
      ...new CourseDto(c).toJSON(),
      totalModule: c.modules.length,
      completedModule: c.modules.filter((m) => m.isCompleted).length,
    }))

    return inertia.render('courses/index', { courses: data, user: new UserDto(user).toJSON() })
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

    const modules = await course.related('modules').query().orderBy('order', 'asc')
    const modulesWithSubmodules = []

    for (const module of modules!) {
      const submodules = await module.related('submodulesData').query().orderBy('order', 'asc')
      modulesWithSubmodules.push({
        ...new ModuleDto(module).toJSON(),
        totalSubmodule: submodules.length,
        completedSubmodule: submodules.filter((s) => s.isCompleted).length,
        submodules: submodules.map((s) => new submoduleDto(s).toJSON()),
      })
    }

    const totalModule = modules.length
    const completedModule = modules.filter((m) => m.isCompleted).length

    return inertia.render('courses/show', {
      course: { ...new CourseDto(course).toJSON(), totalModule, completedModule },
      user: new UserDto(user).toJSON(),
      modules: modulesWithSubmodules,
    })
  }

  @bindCourse()
  async onboardCourse({ auth, inertia }: HttpContext, course: Course) {
    const user = auth.user!

    const question = await user.related('questions').query().whereNull('answer').first()
    return inertia.render('courses/onboarding', {
      course: new CourseDto(course).toJSON(),
      currentQuestion: new QuestionDto(question).toJSON(),
      user,
    })
  }
}
