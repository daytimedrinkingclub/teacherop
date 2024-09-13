import User from '#models/user'

export default class UserDto {
  constructor(private user: User) {}
  toJSON() {
    return {
      id: this.user.id,
      fullName: this.user.fullName,
      email: this.user.email,
      age: this.user.age,
      gender: this.user.gender,
      qualification: this.user.qualification,
      createdAt: this.user.createdAt.toISO(),
      updatedAt: this.user.updatedAt?.toISO() || null,
    }
  }
}
