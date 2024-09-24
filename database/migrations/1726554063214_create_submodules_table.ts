import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'submodules'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary()
      table.string('title').notNullable()
      table.text('description').notNullable()
      table.boolean('is_completed').defaultTo(false)
      table.json('ai_response').notNullable()
      table.integer('order').notNullable()
      table.boolean('content_created').defaultTo(false).notNullable()
      table.boolean('assessments_created').notNullable().defaultTo(false)
      table.uuid('module_id').references('modules.id').onDelete('CASCADE').notNullable()
      table.uuid('user_id').references('users.id').onDelete('CASCADE').notNullable()

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
