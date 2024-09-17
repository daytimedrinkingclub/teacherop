import { HttpContext } from '@adonisjs/core/http'
import logger from '@adonisjs/core/services/logger'
import { errors as validationErrors } from '@vinejs/vine'

import Submodule from '#models/submodule'

import { isUUID } from '../lib/utils.js'

const bindSubmodule = () => (_target: any, _key: any, descriptor: PropertyDescriptor) => {
  const originalMethod = descriptor.value

  descriptor.value = async function (this: any, ctx: HttpContext) {
    const { params, request, inertia, auth } = ctx
    const user = auth.user!

    const submoduleId = params.lessonId || request.input('lessonId') || request.all().lessonId

    if (!submoduleId) throw new validationErrors.E_VALIDATION_ERROR('resource id is required.')

    if (!isUUID(submoduleId)) return inertia.render('errors/not_found')

    try {
      const submodule = await Submodule.find(submoduleId)
      if (!submodule) return inertia.render('errors/not_found')

      const module = await submodule.related('module').query().first()
      if (!module) return inertia.render('errors/not_found')

      const course = await module.related('course').query().first()
      if (!course) return inertia.render('errors/not_found')
      if (course.userId !== user.id) return inertia.render('errors/not_found')

      return await originalMethod.call(this, ctx, submodule)
    } catch (error) {
      logger.error(error, 'Failed to bind Course.')
      return inertia.render('errors/server_error')
    }
  }
}

export default bindSubmodule
