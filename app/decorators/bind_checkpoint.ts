import { HttpContext } from '@adonisjs/core/http'
import logger from '@adonisjs/core/services/logger'
import { errors as validationErrors } from '@vinejs/vine'

import Checkpoint from '#models/checkpoint'
import { isUUID } from '../lib/utils.js'

const bindCheckpoint = () => (_target: any, _key: any, descriptor: PropertyDescriptor) => {
  const originalMethod = descriptor.value

  descriptor.value = async function (this: any, ctx: HttpContext) {
    const { params, request, inertia, auth } = ctx
    const user = auth.user!

    const checkpointId =
      params.checkpointId || request.input('checkpointId') || request.all().checkpointId

    if (!checkpointId) throw new validationErrors.E_VALIDATION_ERROR('resource id is required.')

    if (!isUUID(checkpointId)) return inertia.render('errors/not_found')

    try {
      const checkpoint = await Checkpoint.query()
        .where('id', checkpointId)
        .andWhere('user_id', user.id)
        .first()
      if (!checkpoint) return inertia.render('errors/not_found')
      return await originalMethod.call(this, ctx, checkpoint)
    } catch (error) {
      logger.error(error, 'Failed to bind Course.')
      return inertia.render('errors/server_error')
    }
  }
}

export default bindCheckpoint
