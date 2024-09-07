import { defineConfig } from '@adonisjs/transmit'

export default defineConfig({
  pingInterval: false,
  transport: null,
  async routeHandlerModifier(route) {
    const { middleware } = await import('#start/kernel')

    // Ensure you are authenticated to register your client
    if (route.getPattern() === '__transmit/events') {
      route.middleware(middleware.auth())
      return
    }

    // Add a throttle middleware to other transmit routes
    // route.use(throttle)
  },
})
