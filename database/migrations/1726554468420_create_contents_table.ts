import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'contents'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary()
      table.text('value').notNullable()
      table.bigInteger('estimated_duration').notNullable()
      table.bigInteger('elapsed_duration').notNullable().defaultTo(0)
      table.uuid('submodule_id').notNullable().references('submodules.id').onDelete('CASCADE')
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
