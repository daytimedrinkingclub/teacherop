import type { HttpContext } from '@adonisjs/core/http'

export default class DashboardController {
  public async index({ inertia, auth }: HttpContext) {
    const user = auth.user!
    return inertia.render('dashboard', { user })
  }
}
