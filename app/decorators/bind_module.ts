import { HttpContext } from '@adonisjs/core/http'
import logger from '@adonisjs/core/services/logger'
import { errors as validationErrors } from '@vinejs/vine'

import { isUUID } from '../lib/utils.js'
import Module from '#models/module'

const bindModule = () => (_target: any, _key: any, descriptor: PropertyDescriptor) => {
  const originalMethod = descriptor.value

  descriptor.value = async function (this: any, ctx: HttpContext) {
    const { params, request, inertia, auth } = ctx
    const user = auth.user!

    const moduleId = params.moduleId || request.input('moduleId') || request.all().moduleId

    if (!moduleId) throw new validationErrors.E_VALIDATION_ERROR('module id is required.')

    if (!isUUID(moduleId)) return inertia.render('errors/not_found')

    try {
      const module = await Module.find(moduleId)
      if (!module) return inertia.render('errors/not_found')

      const course = await module.related('course').query().first()
      if (!course) return inertia.render('errors/not_found')
      if (course.userId !== user.id) return inertia.render('errors/not_found')

      return await originalMethod.call(this, ctx, module)
    } catch (error) {
      logger.error(error, 'Failed to bind Course.')
      return inertia.render('errors/server_error')
    }
  }
}

export default bindModule
