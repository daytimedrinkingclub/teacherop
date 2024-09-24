import { BaseModel, beforeCreate, belongsTo, column, hasMany, hasOne } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany, HasOne } from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'
import { v4 as uuid } from 'uuid'

import Content from '#models/content'
import Module from '#models/module'
import User from './user.js'
import Assessment from '#models/assessment'

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
  declare assessmentsCreated: boolean

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

  @hasMany(() => Assessment)
  declare assessments: HasMany<typeof Assessment>

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
    if (possibleNextSubmodule) return { type: 'submodule', id: possibleNextSubmodule.id }

    // Check for next module
    const currentModule = await Module.find(this.moduleId)
    if (!currentModule) return null
    const possibleNextModule = await Module.query()
      .where('order', currentModule.order + 1)
      .andWhere('courseId', currentModule.courseId)
      .first()

    if (!possibleNextModule) return null

    return { type: 'module', id: possibleNextModule.id }

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

    const user = await course.related('user').query().first()
    if (!user) return null

    const questions = await course.related('questions').query().orderBy('createdAt', 'asc')
    return {
      modulesData: {
        title: module.title,
        description: module.description,
      },
      courseData: {
        title: course.title,
        description: course.description,
        userQuery: course.query,
      },
      submoduleData: {
        title: this.title,
        description: this.description,
      },
      userPreferences: questions.map((q) => ({ question: q.content, answer: q.answer })),
      userDetails: {
        name: user.fullName,
        email: user.email,
        age: user.age,
        gender: user.gender,
        qualification: user.qualification,
      },
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
