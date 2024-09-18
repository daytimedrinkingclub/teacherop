/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'

import env from './env.js'
import { middleware } from './kernel.js'
import assignmentsController from '#controllers/assignment_controller'
// import CheckpointController from '#controllers/checkpoint_controller'

const healthChecksController = () => import('#controllers/health_checks_controller')

const authController = () => import('#controllers/auth_controller')
const courseController = () => import('#controllers/courses_controller')
const dashboardController = () => import('#controllers/dashboard_controller')
const questionController = () => import('#controllers/questions_controller')
const modulesController = () => import('#controllers/modules_controller')
const submodulesController = () => import('#controllers/submodules_controller')
router.on('/').renderInertia('home')

router.get('/health', [healthChecksController]).use(({ request, response }, next) => {
  if (env.get('NODE_ENV') === 'development') return next()

  if (request.header('x-monitoring-secret') === env.get('APP_KEY')) return next()

  response.unauthorized({ message: 'Unauthorized access' })
})

router
  .group(() => {
    router.get('/login', [authController, 'showLogin'])
    router.get('/signup', [authController, 'showSignup'])
    router.post('/auth/signup', [authController, 'signup'])
    router.post('/auth/login', [authController, 'login'])
  })
  .use([middleware.guest()])
router.post('/auth/logout', [authController, 'logout']).use([middleware.auth()])

router.get('/dashboard', [dashboardController, 'index']).use([middleware.auth()])

router.get('/courses', [courseController, 'index']).use([middleware.auth()])
router.get('/courses/create', [courseController, 'create']).use([middleware.auth()])
router.post('/courses', [courseController, 'store']).use([middleware.auth()])
router.get('/courses/:courseId', [courseController, 'show']).use([middleware.auth()])
router
  .get('/courses/:courseId/onboarding', [courseController, 'onboardCourse'])
  .use([middleware.auth()])

router.get('/modules/:moduleId', [modulesController, 'show']).use([middleware.auth()])
router.get('/lessons/:lessonId', [submodulesController, 'show']).use([middleware.auth()])

router.get('/questions/current', [questionController, 'current']).use([middleware.auth()])
router.put('/questions/:id', [questionController, 'update']).use([middleware.auth()])


router.get("/assignments/:lessonId", [assignmentsController, 'show']).use([middleware.auth()])