import { BaseModel, beforeCreate, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'
import { v4 as uuid } from 'uuid'

import Submodule from '#models/submodule'

export default class Content extends BaseModel {
  static selfAssignPrimaryKey = true

  @column({ isPrimary: true })
  declare id: string

  @column()
  declare value: string

  @column()
  declare estimatedDuration: BigInt

  @column()
  declare elapsedDuration: BigInt

  @column()
  declare submoduleId: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @beforeCreate()
  static async beforeCreateHook(content: Content) {
    content.id = content.id || uuid()
  }

  @belongsTo(() => Submodule)
  declare submodule: BelongsTo<typeof Submodule>
}
