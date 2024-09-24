import vine from '@vinejs/vine'

export const validateAssessmentAnswer = vine.compile(
  vine.object({
    id: vine.string().uuid({ version: [4] }),
    answer: vine.string().minLength(3),
  })
)
