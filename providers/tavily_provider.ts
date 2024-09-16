import TavilyService from '#services/tavily_service'
import env from '#start/env'
import { ApplicationService } from '@adonisjs/core/types'

declare module '@adonisjs/core/types' {
  interface ContainerBindings {
    tavily: TavilyService
  }
}

export default class TavilyProvider {
  constructor(protected app: ApplicationService) {}
  async register() {
    this.app.container.singleton('tavily', async () => {
      const TavilyService = (await import('#services/tavily_service')).default
      return new TavilyService(env.get('TAVILY_API_KEY'))
    })
  }
}
