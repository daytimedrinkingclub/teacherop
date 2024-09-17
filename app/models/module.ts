import { BaseModel, beforeCreate, belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'
import { v4 as uuid } from 'uuid'

import Course from '#models/course'
import Submodule from '#models/submodule'

export default class Module extends BaseModel {
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
  declare aiResponse: Record<string, any>

  @column()
  declare order: number

  @column()
  declare submodules: string

  @column()
  declare submodulesCreated: boolean

  @column()
  declare courseId: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => Course)
  declare course: BelongsTo<typeof Course>

  @hasMany(() => Submodule)
  declare submodulesData: HasMany<typeof Submodule>

  @beforeCreate()
  static async beforeCreateHook(module: Module) {
    module.id = module.id || uuid()
  }
}
