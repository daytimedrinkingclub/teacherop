import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import { compose } from '@adonisjs/core/helpers'
import hash from '@adonisjs/core/services/hash'
import { BaseModel, beforeCreate, column, hasMany } from '@adonisjs/lucid/orm'
import { type HasMany } from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'
import { v4 as uuid } from 'uuid'

import { GenderEnum } from '#enums/gender'
import Course from '#models/course'
import PlanSummary from '#models/plan_summary'
import Question from '#models/question'
import Submodule from '#models/submodule'
import Module from '#models/module'
import Assessment from '#models/assessment'
import AssessmentEvaluation from '#models/assessment_evaluation'

const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
  uids: ['email'],
  passwordColumnName: 'password',
})

export default class User extends compose(BaseModel, AuthFinder) {
  static selfAssignPrimaryKey = true

  @column({ isPrimary: true })
  declare id: string

  @column()
  declare fullName: string | null

  @column()
  declare email: string

  @column({ serializeAs: null })
  declare password: string

  @column()
  declare age: number

  @column()
  declare gender: GenderEnum

  @column()
  declare qualification: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @hasMany(() => Course)
  declare courses: HasMany<typeof Course>

  @hasMany(() => Question)
  declare questions: HasMany<typeof Question>

  @hasMany(() => PlanSummary)
  declare planSummaries: HasMany<typeof PlanSummary>

  @hasMany(() => Submodule)
  declare submodules: HasMany<typeof Submodule>

  @hasMany(() => Module)
  declare modules: HasMany<typeof Module>

  @hasMany(() => Assessment)
  declare assessments: HasMany<typeof Assessment>

  @hasMany(() => AssessmentEvaluation)
  declare assessmentEvaluations: HasMany<typeof AssessmentEvaluation>

  @beforeCreate()
  static async beforeCreateHook(user: User) {
    user.id = user.id || uuid()
  }
}
