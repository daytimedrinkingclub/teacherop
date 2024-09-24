import { BaseModel, beforeCreate, belongsTo, column, hasOne } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasOne } from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'
import { v4 as uuid } from 'uuid'

import User from '#models/user'
import Submodule from './submodule.js'
import AssessmentEvaluation from '#models/assessment_evaluation'

export default class Assessment extends BaseModel {
  static selfAssignPrimaryKey = true

  @column({ isPrimary: true })
  declare id: string

  @column()
  declare question: string

  @column()
  declare aiAnswer: string

  @column()
  declare userAnswer: string | null

  @column()
  declare userId: string

  @column()
  declare submoduleId: string

  @column()
  declare aiResponse: Record<string, any>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @belongsTo(() => Submodule)
  declare submodule: BelongsTo<typeof Submodule>

  @hasOne(() => AssessmentEvaluation)
  declare assessmentEvaluation: HasOne<typeof AssessmentEvaluation>

  @beforeCreate()
  static async beforeCreateHook(assessment: Assessment) {
    assessment.id = assessment.id || uuid()
  }
}
