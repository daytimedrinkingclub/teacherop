import { GenderEnum } from '#enums/gender'
import { QualificationEnum } from '#enums/qualification'
import vine from '@vinejs/vine'

export const signupValidator = vine.compile(
  vine.object({
    email: vine.string().email().trim().normalizeEmail(),
    password: vine.string().minLength(8).trim(),
    fullName: vine.string().trim(),
    age: vine.number().min(18).max(100),
    gender: vine.enum(GenderEnum),
    qualification: vine.enum(QualificationEnum),
  })
)


export const loginValidator = vine.compile(
  vine.object({
    email: vine.string().email().trim().normalizeEmail(),
    password: vine.string().minLength(8).trim(),
  })
)