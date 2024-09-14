import { BaseSchema } from '@adonisjs/lucid/schema'

import { QuestionTypeEnum } from '#enums/question'

export default class extends BaseSchema {
  protected tableName = 'questions'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary()
      table.text('content').notNullable()
      table
        .enum('type', Object.values(QuestionTypeEnum), {
          useNative: false,
          enumName: 'question_type_enum',
          schemaName: 'public',
        })
        .notNullable()
      table.json('meta').nullable()
      table.json('ai_response').nullable()
      table.text('answer').nullable()
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
