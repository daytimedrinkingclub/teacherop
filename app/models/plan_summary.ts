import { BaseModel, beforeCreate, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'
import { v4 as uuid } from 'uuid'

import Course from '#models/course'
import User from '#models/user'

export default class PlanSummary extends BaseModel {
  static selfAssignPrimaryKey = true

  @column({ isPrimary: true })
  declare id: string

  @column()
  declare planOverview: string

  @column()
  declare learningGoal: string

  @column()
  declare modules: string

  @column()
  declare subModules: string

  @column()
  declare aiResponse: Record<string, any>

  @column()
  declare courseId: string

  @column()
  declare userId: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @beforeCreate()
  static async beforeCreateHook(planSummary: PlanSummary) {
    planSummary.id = planSummary.id || uuid()
  }

  @belongsTo(() => Course)
  declare course: BelongsTo<typeof Course>

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>
}
