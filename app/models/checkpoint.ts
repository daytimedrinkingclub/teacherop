import { BaseModel, beforeCreate, belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'
import { v4 as uuid } from 'uuid'

import { CheckpointTypeEnum } from '#enums/checkpoint'
import Course from '#models/course'
import User from '#models/user'

export default class Checkpoint extends BaseModel {
  static selfAssignPrimaryKey = true

  @column({ isPrimary: true })
  declare id: string

  @column()
  declare type: CheckpointTypeEnum

  @column()
  declare title: string

  @column()
  declare description: string

  @column()
  declare content: string

  @column()
  declare isCompleted: boolean

  @column()
  declare isLocked: boolean

  @column()
  declare aiResponse: Record<string, any>
  @column()
  declare userId: string

  @column()
  declare parentId: string | null

  @column()
  declare courseId: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @beforeCreate()
  static generateId(checkpoint: Checkpoint) {
    checkpoint.id = checkpoint.id || uuid()
  }

  @belongsTo(() => Checkpoint, { foreignKey: 'parentId' })
  declare parent: BelongsTo<typeof Checkpoint>

  @hasMany(() => Checkpoint, { foreignKey: 'parentId' })
  declare children: HasMany<typeof Checkpoint>

  @belongsTo(() => Course)
  declare course: BelongsTo<typeof Course>

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>
}
