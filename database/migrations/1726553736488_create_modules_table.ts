import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'modules'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary()
      table.string('title').notNullable()
      table.text('description').notNullable()
      table.boolean('is_completed').notNullable().defaultTo(false)
      table.json('ai_response').notNullable()
      table.integer('order').notNullable()
      table.text('submodules').notNullable()
      table.boolean('submodules_created').notNullable().defaultTo(false)
      table.uuid('course_id').references('courses.id').notNullable().onDelete('CASCADE')
      table.uuid('user_id').references('users.id').notNullable().onDelete('CASCADE')

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
