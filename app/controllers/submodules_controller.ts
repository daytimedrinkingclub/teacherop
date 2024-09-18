import type { HttpContext } from '@adonisjs/core/http'

import bindSubmodule from '#decorators/bind_submodule'
import CourseDto from '#dtos/course_dto'
import ModuleDto from '#dtos/module_dto'
import SubmoduleDto from '#dtos/submodule_dto'
import UserDto from '#dtos/user_dto'
import Submodule from '#models/submodule'
import CreateContentJob from '#jobs/create_content'

export default class SubmodulesController {
  @bindSubmodule()
  async show({ inertia, auth }: HttpContext, submodule: Submodule) {
    const user = auth.user!
    const module = await submodule.related('module').query().first()
    const course = await module?.related('course').query().first()
    await submodule.load('content')

    const next = await submodule.getNext()

    if (next?.type === 'submodule') await CreateContentJob.enqueue({ submoduleId: next.id })
    if (next?.type === 'module') {
      const nextModule = await course
        ?.related('modules')
        .query()
        .where('order', module?.order! + 1)
        .first()
      const nextSubmodule = await nextModule
        ?.related('submodulesData')
        .query()
        .where('order', 1)
        .first()
      await CreateContentJob.enqueue({ submoduleId: nextSubmodule!.id })
    }
    console.log(next)

    return inertia.render('lessons/show', {
      user: new UserDto(user).toJSON(),
      submodule: { ...new SubmoduleDto(submodule).toJSON(), next },
      course: new CourseDto(course!).toJSON(),
      module: new ModuleDto(module!).toJSON(),
    })
  }

  async markAsComplete({ auth, params, response }: HttpContext) {
    const user = auth.user!
    const { lessonId } = params
    const submodule = await user.related('submodules').query().where('id', lessonId).first()
    if (!submodule) return response.notFound({ success: false, message: 'submodule not found' })

    submodule.isCompleted = true
    await submodule.save()

    return response.ok({ success: true, message: 'submodule has been completed' })
  }
}
