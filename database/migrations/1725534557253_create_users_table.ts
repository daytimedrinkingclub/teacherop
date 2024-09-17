import { GenderEnum } from '#enums/gender'
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').notNullable().primary()
      table.string('full_name').nullable()
      table.string('email', 254).notNullable().unique()
      table.string('password').notNullable()
      table.integer('age').notNullable()
      table
        .enum('gender', Object.values(GenderEnum), {
          useNative: false,
          enumName: 'gender_enum',
          schemaName: 'public',
        })
        .notNullable()
      table.string('qualification').notNullable()

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
