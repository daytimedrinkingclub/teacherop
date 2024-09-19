import { BaseModel, beforeCreate, belongsTo, column, hasMany, hasOne } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany, HasOne } from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'
import { v4 as uuid } from 'uuid'

import { CourseStatusEnum } from '#enums/course'
import Module from '#models/module'
import PlanSummary from '#models/plan_summary'
import Question from '#models/question'
import User from '#models/user'

export default class Course extends BaseModel {
  static selfAssignPrimaryKey = true

  @column({ isPrimary: true })
  declare id: string

  @column()
  declare query: string

  @column()
  declare title: string | null

  @column()
  declare description: string | null

  @column()
  declare status: CourseStatusEnum

  @column()
  declare isOnboardingComplete: boolean

  @column()
  declare isStudying: boolean

  @column()
  declare isModulesCreated: boolean

  @column()
  declare meta: Record<string, any> | null

  @column()
  declare userId: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @hasMany(() => Question)
  declare questions: HasMany<typeof Question>

  @hasOne(() => PlanSummary)
  declare planSummary: HasOne<typeof PlanSummary>

  @hasMany(() => Module)
  declare modules: HasMany<typeof Module>

  @beforeCreate()
  static async beforeCreateHook(course: Course) {
    course.id = course.id || uuid()
  }

  async getCurrentTopic() {
    const currentModule = await Module.query()
      .where('course_id', this.id)
      .orderBy('order', 'asc')
      .andWhere('is_completed', false)
      .first()

    if (!currentModule) return null

    const currentSubmodule = await currentModule
      .related('submodulesData')
      .query()
      .orderBy('order', 'asc')
      .where('is_completed', false)
      .first()

    if (currentSubmodule && currentSubmodule.order !== 1) {
      return { type: 'submodule', id: currentSubmodule.id, order: currentSubmodule.order }
    } else {
      return { type: 'module', id: currentModule.id, order: currentModule.order }
    }
  }
}
