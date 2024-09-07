import { BaseSchema } from '@adonisjs/lucid/schema'

import { QuestionType } from '#enums/question'

export default class extends BaseSchema {
  protected tableName = 'questions'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary()
      table.string('content').notNullable()
      table
        .enum('type', Object.values(QuestionType), {
          useNative: false,
          enumName: 'question_type_enum',
          schemaName: 'public',
        })
        .notNullable()
      table.json('meta').nullable()
      table.json('ai_response').nullable()
      table.string('answer').nullable()
      table.uuid('user_id').notNullable().references('users.id').onDelete('cascade')
      table.uuid('course_id').notNullable().references('courses.id').onDelete('cascade')

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
