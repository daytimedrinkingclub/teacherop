import Course from '#models/course'
import { HttpContext } from '@adonisjs/core/http'
import logger from '@adonisjs/core/services/logger'
import { errors as validationErrors } from '@vinejs/vine'
import { isUUID } from '../lib/utils.js'

const bindCourse = () => (_target: any, _key: any, descriptor: PropertyDescriptor) => {
  const originalMethod = descriptor.value

  descriptor.value = async function (this: any, ctx: HttpContext) {
    const { params, request, inertia } = ctx

    const courseId = params.courseId || request.input('courseId') || request.all().courseId

    if (!courseId) throw new validationErrors.E_VALIDATION_ERROR('course id is required.')

    if (!isUUID(courseId)) return inertia.render('errors/not_found')

    try {
      const course = await Course.find(courseId)
      if (!course) return inertia.render('errors/not_found')
      return await originalMethod.call(this, ctx, course)
    } catch (error) {
      logger.error(error, 'Failed to bind Course.')
      return inertia.render('errors/server_error')
    }
  }
  return descriptor
}

export default bindCourse
