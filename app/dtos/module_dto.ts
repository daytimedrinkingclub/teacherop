import Module from '#models/module'

export default class ModuleDto {
  constructor(private module: Module) {}

  toJSON() {
    return {
      id: this.module.id,
      title: this.module.title,
      description: this.module.description,
      isCompleted: this.module.isCompleted,
      order: this.module.order,
      createdAt: this.module.createdAt.toISO(),
      updatedAt: this.module.updatedAt?.toISO() || null,
    }
  }
}
