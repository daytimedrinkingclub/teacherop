import { Gender } from '#enums/gender'
import { Qualification } from '#enums/qualification'
import vine from '@vinejs/vine'

export const signupValidator = vine.compile(
  vine.object({
    email: vine.string().email().trim().normalizeEmail(),
    password: vine.string().minLength(8).trim(),
    fullName: vine.string().trim(),
    age: vine.number().min(18).max(100),
    gender: vine.enum(Gender),
    qualification: vine.enum(Qualification),
  })
)


export const loginValidator = vine.compile(
  vine.object({
    email: vine.string().email().trim().normalizeEmail(),
    password: vine.string().minLength(8).trim(),
  })
)