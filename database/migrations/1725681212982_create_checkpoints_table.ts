import { CheckpointTypeEnum } from '#enums/checkpoint'
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'checkpoints'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary()
      table
        .enum('type', Object.values(CheckpointTypeEnum), {
          useNative: false,
          enumName: 'checkpoint_type_enum',
          schemaName: 'public',
        })
        .notNullable()
      table.string('title').notNullable()
      table.text('description').notNullable()
      table.text('content').notNullable()
      table.boolean('is_completed').defaultTo(false)
      table.bigint('estimated_duration').nullable()
      table.bigint('elapsed_duration').notNullable().defaultTo(0)
      table.integer('order').notNullable()
      table.json('ai_response').notNullable()
      table.uuid('user_id').references('users.id').notNullable().onDelete('cascade')
      table.uuid('parent_id').references('checkpoints.id').onDelete('cascade')
      table.uuid('course_id').references('courses.id').notNullable().onDelete('cascade')

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
