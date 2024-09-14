import bindCheckpoint from '#decorators/bind_checkpoint'
import CheckPointDto from '#dtos/checkpoint_dto'
import CourseDto from '#dtos/course_dto'
import UserDto from '#dtos/user_dto'
import Checkpoint from '#models/checkpoint'
import type { HttpContext } from '@adonisjs/core/http'

export default class CheckpointController {
  @bindCheckpoint()
  async show({ inertia, auth }: HttpContext, checkpoint: Checkpoint) {
    const user = auth.user!

    const course = await checkpoint.related('course').query().first()
    const module = await checkpoint.related('parent').query().first()

    // todo)) only pass required data
    return inertia.render('resources/show', {
      user: new UserDto(user).toJSON(),
      checkpoint: new CheckPointDto(checkpoint).toJSON(),
      course: new CourseDto(course!).toJSON(),
      module: new CheckPointDto(module).toJSON(),
    })
  }
}
