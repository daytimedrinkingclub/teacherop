import vine from '@vinejs/vine'

export const authenticationValidator = vine.compile(
  vine.object({
    email: vine.string().email().trim().normalizeEmail(),
    password: vine.string().minLength(8).trim(),
  })
)
