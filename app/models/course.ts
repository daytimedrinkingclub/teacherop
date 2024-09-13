import { BaseModel, beforeCreate, belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import { type BelongsTo, type HasMany } from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'
import { v4 as uuid } from 'uuid'

import { CourseStatusEnum } from '#enums/course'
import Checkpoint from '#models/checkpoint'
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
  declare content: string | null

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

  @beforeCreate()
  static async beforeCreateHook(course: Course) {
    course.id = course.id || uuid()
  }

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @hasMany(() => Question)
  declare questions: HasMany<typeof Question>

  @hasMany(() => PlanSummary)
  declare planSummaries: HasMany<typeof PlanSummary>

  @hasMany(() => Checkpoint)
  declare checkpoints: HasMany<typeof Checkpoint>
}
