import type { HttpContext } from '@adonisjs/core/http'

import UserDto from '#dtos/user_dto'

export default class AssessmentController {
  async show({ inertia, auth }: HttpContext) {
    const user = auth.user!

    return inertia.render('assignments/show', {
      user: new UserDto(user).toJSON(),
    })
  }
}
