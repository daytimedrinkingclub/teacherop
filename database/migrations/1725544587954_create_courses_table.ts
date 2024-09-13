import { BaseSchema } from '@adonisjs/lucid/schema'

import { CourseStatusEnum } from '#enums/course'

export default class extends BaseSchema {
  protected tableName = 'courses'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary()
      table.string('query').notNullable()
      table.string('title').nullable()
      table.text('description').nullable()
      table.text('content').nullable()
      table
        .enum('status', Object.values(CourseStatusEnum), {
          enumName: 'course_status_enum',
          useNative: false,
          schemaName: 'public',
        })
        .notNullable()
        .defaultTo(CourseStatusEnum.ONGOING)
      table.boolean('is_onboarding_complete').notNullable().defaultTo(false)
      table.boolean('is_studying').notNullable().defaultTo(false)
      table.boolean('is_modules_created').notNullable().defaultTo(false)
      table.json('meta').nullable()
      table.uuid('user_id').references('users.id').notNullable().onDelete('CASCADE')
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.raw('DROP TYPE IF EXISTS "course_status_enum" CASCADE')
    this.schema.dropTable(this.tableName)
  }
}
