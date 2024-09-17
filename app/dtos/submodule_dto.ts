import Submodule from '#models/submodule'

export default class SubmoduleDto {
  constructor(private submodule: Submodule) {}

  toJSON() {
    return {
      id: this.submodule.id,
      title: this.submodule.title,
      description: this.submodule.description,
      isCompleted: this.submodule.isCompleted,
      order: this.submodule.order,
      moduleId: this.submodule.moduleId,
      content: this.submodule.content || null,
      createdAt: this.submodule.createdAt.toISO(),
      updatedAt: this.submodule.updatedAt?.toISO() || null,
    }
  }
}
