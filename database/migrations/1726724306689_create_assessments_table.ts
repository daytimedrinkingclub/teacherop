import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'assessments'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary()
      table.text('question').notNullable()
      table.text('ai_answer').notNullable()
      table.text('user_answer').nullable()
      table.uuid('user_id').notNullable().references('users.id').onDelete('CASCADE')
      table.uuid('submodule_id').notNullable().references('submodules.id').onDelete('CASCADE')
      table.json('ai_response').notNullable()

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
