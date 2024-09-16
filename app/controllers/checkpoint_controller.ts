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
    const next = await checkpoint.getNextCheckpoint()

    await checkpoint.load('children')

    const children =
      checkpoint.type === 'module'
        ? checkpoint.children.map((c) => new CheckPointDto(c).toJSON())
        : null

    const module = { ...new CheckPointDto(checkpoint).toJSON(), children, next: next?.id }

    return inertia.render('resources/show', {
      user: new UserDto(user).toJSON(),
      course: new CourseDto(course!).toJSON(),
      module,
    })
  }
}