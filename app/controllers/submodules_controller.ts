import type { HttpContext } from '@adonisjs/core/http'

import bindSubmodule from '#decorators/bind_submodule'
import Submodule from '#models/submodule'
import UserDto from '#dtos/user_dto'
import SubmoduleDto from '#dtos/submodule_dto'

export default class SubmodulesController {
  @bindSubmodule()
  async show({ inertia, auth }: HttpContext, submodule: Submodule) {
    const user = auth.user!
    await submodule.load('content')

    return inertia.render('lessons/show', {
      user: new UserDto(user).toJSON(),
      submodule: new SubmoduleDto(submodule).toJSON(),
    })
  }
}
