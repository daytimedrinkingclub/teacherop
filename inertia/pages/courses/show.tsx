import { InferPageProps } from '@adonisjs/inertia/types'
import { router } from '@inertiajs/react'

import type CoursesController from '#controllers/courses_controller'
import { Icons } from '~/lib/components/icons'

import AppLayout from '~/lib/components/layout/app_layout'
import { Layout } from '~/lib/components/layout/custom_layout'
import { Button } from '~/lib/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/lib/components/ui/card'
import CourseComponent from '~/lib/components/courses/courseComponent'

export default function CoursesShowPage(props: InferPageProps<CoursesController, 'show'>) {
  const { course, modules } = props

  return (
    <AppLayout>
      <Layout.Header></Layout.Header>
      <Layout.Body>
        {course.isOnboardingComplete ? (
          <>
            <CourseComponent course={course} modules={modules} />
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-[calc(100vh-4rem)]">
            <Card className="w-full max-w-md text-center">
              <CardHeader>
                <CardTitle>Welcome to Your Course</CardTitle>
                <CardDescription>Complete the onboarding to get started</CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={() => router.visit(`${course.id}/onboarding`)} className="w-full">
                  Start Onboarding
                  <Icons.chevronRight className="ml-2 w-4 h-4" />
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </Layout.Body>
    </AppLayout>
  )
}
