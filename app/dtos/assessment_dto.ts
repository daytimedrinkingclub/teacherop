import Assessment from '#models/assessment'

export default class AssessmentDto {
  constructor(private assessment: Assessment) {}

  toJSON() {
    return {
      id: this.assessment.id,
      question: this.assessment.question,
      userAnswer: this.assessment.userAnswer,
    }
  }
}
