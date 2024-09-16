import { type InferPageProps } from '@adonisjs/inertia/types'
import { Link, router } from '@inertiajs/react'
import { motion } from 'framer-motion'
import { Icons } from '~/lib/components/icons'

import type CoursesController from '#controllers/courses_controller'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

import AppLayout from '~/lib/components/layout/app_layout'
import { Layout } from '~/lib/components/layout/custom_layout'
import { Badge } from '~/lib/components/ui/badge'
import { Button } from '~/lib/components/ui/button'
import { Progress } from '~/lib/components/ui/progress'
import { UserNav } from '~/lib/components/user_nav'
import WorkflowComponent from '~/lib/components/workflow'
import { calculatePercentage } from '~/lib/lib/utils'
import { Separator } from '~/lib/components/ui/separator'

export default function CoursesPage({ courses }: InferPageProps<CoursesController, 'index'>) {
  const isOngoing = courses.some((course) => course.status === 'ongoing')

  const getStatusIcon = (status: any) => {
    switch (status) {
      case 'ongoing':
        return <Icons.clock className="w-4 h-4" />
      case 'completed':
        return <Icons.checkCircle className="w-4 h-4" />
      default:
        return <Icons.alertCircle className="w-4 h-4" />
    }
  }

  return (
    <AppLayout>
      <Layout.Header>
        <div className="hidden justify-end items-end w-full md:flex">
          {/* <Search /> */}
          <div className="flex items-end space-x-4">
            {/* <ThemeSwitch /> */}
            <UserNav />
          </div>
        </div>
      </Layout.Header>
      <Layout.Body>
        <div className="px-4 py-8 w-full max-w-6xl  md:px-6 rounded-md">
          <div className="flex justify-between items-center mb-6">
            <h1 className="flex items-center text-lg font-bold whitespace-nowrap md:text-3xl">
              <Icons.bookOpen className="mr-2 w-6 h-6 md:h-8 md:w-8" />
              Your Courses
            </h1>
            <div className="relative">
              <Button
                size="sm"
                onClick={() => {
                  router.visit('/courses/create')
                }}
                disabled={isOngoing}
              >
                <Icons.plus className="mr-2 w-5 h-5" />
                <span className="hidden md:block">New Course</span>
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {courses.map((course) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Link href={`/courses/${course.id}`} className="block">
                  <Card className="overflow-hidden border-l-4  transition-shadow hover:shadow-lg">
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <span>{course.title}</span>
                      </CardTitle>
                      <CardDescription>
                        {course.description?.substring(0, 100)}
                        {course.description?.length || 0 > 100 ? '...' : ''}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <Progress
                        value={calculatePercentage(course.totalModule, course.completedModule || 0)}
                        className="mb-2"
                      />
                      <div className="flex items-center justify-between">
                        <p className="flex items-center text-sm text-gray-500">
                          <Icons.zap className="mr-1 w-4 h-4" />
                          {Math.floor(calculatePercentage(course.totalModule, course.completedModule || 0))}%
                          Complete
                        </p>
                        <Badge
                          variant={course.status === 'ongoing' ? 'outline' : 'default'}
                          className={`flex items-center`}
                        >
                          {getStatusIcon(course.status)}
                          <span className="ml-1 text-sm">{course.status}</span>
                        </Badge>
                      </div>
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
                  <Card className="bg-primary text-primary-foreground">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Icons.plus className="h-5 w-5" />
                        Create New Course
                      </CardTitle>
                      <CardDescription className="text-primary-foreground/80">
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
        <Separator className="my-8 border-2" />
        <WorkflowComponent />
      </Layout.Body>
    </AppLayout>
  )
}
