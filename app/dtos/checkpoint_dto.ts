import Checkpoint from '#models/checkpoint'

export default class CheckPointDto {
  constructor(private checkpoint: Checkpoint | null) {}

  toJSON() {
    if (!this.checkpoint) return null
    return {
      id: this.checkpoint.id,
      type: this.checkpoint.type,
      title: this.checkpoint.title,
      description: this.checkpoint.description,
      content: this.checkpoint.content,
      isCompleted: this.checkpoint.isCompleted,
      isLocked: this.checkpoint.isLocked,
      aiResponse: this.checkpoint.aiResponse,
      estimatedDuration: this.checkpoint.estimatedDuration?.toString() || null,
      elapsedDuration: this.checkpoint.elapsedDuration.toString(),
      userId: this.checkpoint.userId,
      parentId: this.checkpoint.parentId,
      courseId: this.checkpoint.courseId,
      createdAt: this.checkpoint.createdAt.toISO(),
      updatedAt: this.checkpoint.updatedAt.toISO(),
    }
  }
}
