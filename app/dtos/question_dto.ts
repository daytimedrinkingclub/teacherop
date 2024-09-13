import Question from '#models/question'

export default class QuestionDto {
  constructor(private question: Question | null) {}
  toJSON() {
    if (!this.question) return null
    return {
      id: this.question.id,
      content: this.question.content,
      type: this.question.type,
      userId: this.question.userId,
      meta: this.question.meta,
      answer: this.question.answer,
      createAt: this.question.createdAt,
      updatedAt: this.question.updatedAt,
    }
  }
}
