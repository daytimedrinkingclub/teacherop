import { InferPageProps } from '@adonisjs/inertia/types'

import CoursesController from '#controllers/courses_controller'

import { Link, router } from '@inertiajs/react'
import AppLayout from '~/lib/components/layout/app_layout'
import { Layout } from '~/lib/components/layout/custom_layout'
import { Badge } from '~/lib/components/ui/badge'
import { Button } from '~/lib/components/ui/button'
import { UserNav } from '~/lib/components/user_nav'

export default function CoursesPage({ courses }: InferPageProps<CoursesController, 'index'>) {
  const isOngoing = courses.some((course: any) => course.status === 'ongoing')

  return (
    <AppLayout>
      <Layout.Header>
        <div className="flex items-end justify-end w-full">
          {/* <Search /> */}
          <div className="flex items-end space-x-4">
            {/* <ThemeSwitch /> */}
            <UserNav />
          </div>
        </div>
      </Layout.Header>
      <Layout.Body>
        <div className="w-full max-w-6xl px-4 py-8 mx-auto md:px-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold">Your Courses</h1>
            <div className="relative">
              <Button
                onClick={() => {
                  router.visit('/courses/create')
                }}
                disabled={isOngoing}
              >
                New Course
              </Button>
            </div>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {courses.map((course: any) => (
              <Link
                key={course.id}
                href={`/courses/${course.id}`}
                className="overflow-hidden transition-shadow border rounded-lg shadow-sm bg-card hover:shadow-md"
              >
                <div className="p-4">
                  <h3 className="mb-2 text-lg font-semibold truncate">
                    {course.title || course.query}
                  </h3>
                  <p className="text-muted-foreground line-clamp-2">{course.description}</p>
                  <Badge variant={course.status === 'ongoing' ? 'outline' : 'secondary'}>
                    {course.status}
                  </Badge>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </Layout.Body>
    </AppLayout>
  )
}
