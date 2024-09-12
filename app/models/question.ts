import { BaseModel, beforeCreate, column } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'
import { v4 as uuid } from 'uuid'

import { QuestionTypeEnum } from '#enums/question'

export default class Question extends BaseModel {
  static selfAssignPrimaryKey = true

  @column({ isPrimary: true })
  declare id: string

  @column()
  declare content: string

  @column()
  declare type: QuestionTypeEnum

  @column()
  declare userId: string

  @column()
  declare courseId: string

  @column()
  declare meta: Record<string, any> | null

  @column()
  declare aiResponse: Record<string, any> | null

  @column()
  declare answer: string | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @beforeCreate()
  static async beforeCreateHook(question: Question) {
    question.id = question.id || uuid()
  }
}
