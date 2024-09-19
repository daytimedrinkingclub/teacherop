import { BaseModel, beforeCreate, belongsTo, column, hasOne } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasOne } from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'
import { v4 as uuid } from 'uuid'

import Content from '#models/content'
import Module from '#models/module'
import User from './user.js'

export default class Submodule extends BaseModel {
  static selfAssignPrimaryKey = true

  @column({ isPrimary: true })
  declare id: string

  @column()
  declare title: string

  @column()
  declare description: string

  @column()
  declare isCompleted: boolean

  @column()
  declare order: number

  @column()
  declare contentCreated: boolean

  @column()
  declare aiResponse: Record<string, any>

  @column()
  declare moduleId: string

  @column()
  declare userId: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => Module)
  declare module: BelongsTo<typeof Module>

  @hasOne(() => Content)
  declare content: HasOne<typeof Content>

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @beforeCreate()
  static beforeCreateHook(submodule: Submodule) {
    submodule.id = submodule.id || uuid()
  }

  async getNext() {
    // Check for next submodule
    const possibleNextSubmodule = await Submodule.query()
      .where('order', this.order + 1)
      .andWhere('moduleId', this.moduleId)
      .first()
    if (possibleNextSubmodule)
      return {
        type: 'submodule',
        id: possibleNextSubmodule.id,
        contentCreated: possibleNextSubmodule.contentCreated,
      }

    // Check for next module
    const currentModule = await Module.find(this.moduleId)
    if (!currentModule) return null
    const possibleNextModule = await Module.query()
      .where('order', currentModule.order + 1)
      .andWhere('courseId', currentModule.courseId)
      .first()

    if (!possibleNextModule) return null

    const nextModuleFirstSubmodule = await possibleNextModule
      .related('submodulesData')
      .query()
      .where('order', 1)
      .first()

    return {
      type: 'module',
      id: possibleNextModule.id,
      contentCreated: nextModuleFirstSubmodule?.contentCreated,
    }

    // // Return the first submodule of the next module
    // const firstSubmoduleOfNextModule = await Submodule.query()
    //   .where('moduleId', possibleNextModule.id)
    //   .orderBy('order', 'asc')
    //   .first()

    // return firstSubmoduleOfNextModule
    //   ? { type: 'submodule', id: firstSubmoduleOfNextModule.id }
    //   : { type: 'module', id: possibleNextModule.id }
  }

  async getMeta() {
    const module = await Module.find(this.moduleId)
    if (!module) return null

    const course = await module.related('course').query().first()
    if (!course) return null

    const questions = await course.related('questions').query().orderBy('createdAt', 'asc')
    return {
      modulesData: {
        title: module.title,
        description: module.description,
      },
      courseData: {
        title: course.title,
        description: course.description,
      },
      submoduleData: {
        title: this.title,
        description: this.description,
      },
      userPreferences: questions.map((q) => ({ question: q.content, answer: q.answer })),
    }
  }

  async getPrevious() {
    // Check for previous submodule
    const possiblePreviousSubmodule = await Submodule.query()
      .where('order', this.order - 1)
      .andWhere('moduleId', this.moduleId)
      .first()
    if (possiblePreviousSubmodule) return { type: 'submodule', id: possiblePreviousSubmodule.id }

    // Check for previous module
    const currentModule = await Module.find(this.moduleId)
    if (!currentModule) return null
    const possiblePreviousModule = await Module.query()
      .where('order', currentModule.order - 1)
      .andWhere('courseId', currentModule.courseId)
      .first()

    if (!possiblePreviousModule) return null

    // Return the last submodule of the previous module
    const lastSubmoduleOfPreviousModule = await Submodule.query()
      .where('moduleId', possiblePreviousModule.id)
      .orderBy('order', 'desc')
      .first()

    return lastSubmoduleOfPreviousModule
      ? { type: 'submodule', id: lastSubmoduleOfPreviousModule.id }
      : { type: 'module', id: possiblePreviousModule.id }
  }
}
