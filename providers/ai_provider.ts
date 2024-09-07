import { ApplicationService } from '@adonisjs/core/types'

import AIService from '#services/ai_service'
import env from '#start/env'

declare module '@adonisjs/core/types' {
  interface ContainerBindings {
    ai: AIService
  }
}

export default class AIProvider {
  constructor(protected app: ApplicationService) {}

  async register() {
    this.app.container.singleton('ai', async () => {
      const AIService = (await import('#services/ai_service')).default
      return new AIService(env.get('ANTHROPIC_API_KEY'))
    })
  }
}
