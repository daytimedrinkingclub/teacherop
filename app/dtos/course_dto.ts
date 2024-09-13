import Course from '#models/course'

export default class CourseDto {
  constructor(private course: Course) {}

  toJSON() {
    return {
      id: this.course.id,
      query: this.course.query,
      title: this.course.title,
      description: this.course.description,
      content: this.course.content,
      status: this.course.status,
      isOnboardingComplete: this.course.isOnboardingComplete,
      isStudying: this.course.isStudying,
      isModulesCreated: this.course.isModulesCreated,
      meta: this.course.meta,
      userId: this.course.userId,
      createdAt: this.course.createdAt.toISO(),
      updatedAt: this.course.updatedAt?.toISO() || null,
    }
  }
}
