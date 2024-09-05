/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'

const authController = () => import('#controllers/auth_controller')

router.on('/').renderInertia('home', { version: 6 })

router
  .group(() => {
    router.get('/login', [authController, 'showLogin'])
    router.get('/signup', [authController, 'showSignup'])
    router.post('/auth/signup', [authController, 'signup'])
    router.post('/auth/login', [authController, 'login'])
  })
  .use([middleware.guest()])
router.post('/auth/logout', [authController, 'logout']).use([middleware.auth()])
