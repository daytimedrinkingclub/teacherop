import { InferPageProps } from '@adonisjs/inertia/types'
import { Link, router } from '@inertiajs/react'
import { BookIcon, BrainIcon, PlusIcon, UserIcon } from 'lucide-react'

import CoursesController from '#controllers/courses_controller'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import AppLayout from '~/lib/components/layout/app_layout'
import { Layout } from '~/lib/components/layout/custom_layout'
import { Badge } from '~/lib/components/ui/badge'
import { Button } from '~/lib/components/ui/button'
import { UserNav } from '~/lib/components/user_nav'
import { AlertCircleIcon, BookOpenIcon, CheckCircleIcon, ClockIcon, PlusIcon, TargetIcon, ZapIcon } from 'lucide-react'
import { Progress } from '~/lib/components/ui/progress'
import WorkflowComponent from '~/lib/components/workflow'
import { motion } from 'framer-motion'

export default function CoursesPage({ courses }: InferPageProps<CoursesController, 'index'>) {
  const isOngoing = courses.some((course) => course.status === 'ongoing')

  const getStatusIcon = (status: any) => {
    switch (status) {
      case 'ongoing':
        return <ClockIcon className="h-5 w-5 text-yellow-500" />
      case 'completed':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />
      default:
        return <AlertCircleIcon className="h-5 w-5 text-red-500" />
    }
  }

  return (
    <AppLayout>
      <Layout.Header>
        <div className="hidden md:flex items-end justify-end w-full">
          {/* <Search /> */}
          <div className="flex items-end space-x-4">
            {/* <ThemeSwitch /> */}
            <UserNav />
          </div>
        </div>
      </Layout.Header>
      <Layout.Body>
        <div className="w-full max-w-6xl px-4 py-8 mx-auto md:px-6 bg-gradient-to-br from-blue-50 to-purple-50">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-lg whitespace-nowrap md:text-3xl font-bold text-blue-800 flex items-center">
              <BookOpenIcon className="md:h-8 md:w-8 h-6 w-6 mr-2 text-blue-600" />
              Your Courses
            </h1>
            <div className="relative">
              <Button
                size="sm"
                onClick={() => {
                  router.visit('/courses/create')
                }}
                disabled={isOngoing}
                className="bg-green-500 hover:bg-green-600 text-white"
              >
                <PlusIcon className="h-5 w-5 mr-2" />
                <span className="hidden md:block">New Course</span>
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-1  lg:grid-cols-3 gap-6">
            {courses.map((course: any) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Link href={`/courses/${course.id}`} className="block">
                  <Card className="overflow-hidden transition-shadow hover:shadow-lg bg-white border-l-4 border-blue-500">
                    <CardHeader>
                      <CardTitle className="flex items-center text-blue-700 ">
                        <span>{course.title}</span>
                      </CardTitle>
                      <CardDescription>{course.description.substring(0, 100)}{course.description.length > 100 ? "..." : ""}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Progress value={course.progress} className="mb-2" />
                      <p className="text-sm text-gray-500 flex items-center">
                        <ZapIcon className="h-4 w-4 mr-1 text-yellow-500" />
                        {course.progress}% Complete
                      </p>
                      <Badge
                        variant="outline"
                        className={`absolute top-2 right-2 flex items-center ${course.status === "ongoing" ? "bg-yellow-100 text-yellow-800" : "bg-green-100 text-green-800"
                          }`}
                      >
                        {getStatusIcon(course.status)}
                        <span className="ml-1">{course.status}</span>
                      </Badge>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
            {courses.length === 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <Link href="/courses/create">
                  <Card className="bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <PlusIcon className="h-6 w-6" />
                        Create New Course
                      </CardTitle>
                      <CardDescription className="text-white/80">
                        Let AI generate a course for you
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm">
                        Input your topic, and our AI will create modules, content, and questions.
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            )}
          </div>
        </div>
        <WorkflowComponent />
      </Layout.Body>
    </AppLayout>
  )
}
