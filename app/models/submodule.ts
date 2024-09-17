import { BaseModel, beforeCreate, belongsTo, column, hasOne } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasOne } from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'
import { v4 as uuid } from 'uuid'

import Content from '#models/content'
import Module from '#models/module'

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

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => Module)
  declare module: BelongsTo<typeof Module>

  @hasOne(() => Content)
  declare content: HasOne<typeof Content>

  @beforeCreate()
  static beforeCreateHook(submodule: Submodule) {
    submodule.id = submodule.id || uuid()
  }
}
