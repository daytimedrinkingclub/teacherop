import UserDto from '#dtos/user_dto'
import type { HttpContext } from '@adonisjs/core/http'


export default class CheckpointController {
    async show({ inertia, auth }: HttpContext,) {
        const user = auth.user!



        return inertia.render('resources/show', {
            user: new UserDto(user).toJSON()
        })
    }
}
