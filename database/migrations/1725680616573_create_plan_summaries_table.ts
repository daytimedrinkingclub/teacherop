import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'plan_summaries'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary()
      table.text('plan_overview').notNullable()
      table.text('learning_goal').notNullable()
      table.text('modules').notNullable()
      table.text('sub_modules').notNullable()
      table.json('ai_response').notNullable()
      table.uuid('course_id').references('courses.id').notNullable().onDelete('cascade')
      table.uuid('user_id').references('users.id').notNullable().onDelete('cascade')

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
