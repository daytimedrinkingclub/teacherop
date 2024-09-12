import { InferPageProps } from '@adonisjs/inertia/types'
import { router } from '@inertiajs/react'
import axios from 'axios'
import { useEffect, useState } from 'react'

import CoursesController from '#controllers/courses_controller'
import CreateCourseModal from '~/lib/components/create_course'
import AppLayout from '~/lib/components/layout/app_layout'
import { Layout } from '~/lib/components/layout/custom_layout'
import { Badge } from '~/lib/components/ui/badge'
import { UserNav } from '~/lib/components/user_nav'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/lib/components/ui/card'

import { transmit } from '~/lib/lib/utils'
import { Button } from '~/lib/components/ui/button'
import { ChevronRightIcon } from 'lucide-react'

const subscription = transmit.subscription('checkpoint_created')
let stopListening: () => void
subscription.create().then()

export default function CoursesShow(props: InferPageProps<CoursesController, 'show'>) {
  const { course, modules } = props as any
  const [isOnboardingModalOpen, setIsOnboardingModalOpen] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState<any>(null)

  useEffect(() => {
    if (!course.isOnboardingComplete) {
      axios.get('/questions/current').then((res) => {
        setCurrentQuestion(res.data.question)
      })
    }

    stopListening = subscription.onMessage((data) => {
      router.reload({ only: ['course', 'modules'] })
    })
    return () => stopListening()
  }, [])

  return (
    <AppLayout>
      <Layout.Header>
        <div className="flex justify-end items-end w-full">
          {/* <Search /> */}
          <div className="flex items-end space-x-4">
            {/* <ThemeSwitch /> */}
            <UserNav />
          </div>
        </div>
      </Layout.Header>
      <Layout.Body>
        {course.isOnboardingComplete ? (
          <div className="px-4 py-8 mx-auto w-full max-w-3xl sm:px-6 lg:px-8">
            <h1 className="mb-6 text-3xl font-bold">{course.title || course.query}</h1>
            <p className="mb-6 text-sm text-muted-foreground">{course.description}</p>
            <div className="space-y-8">
              {Array.isArray(modules) &&
                modules.map((module) => (
                  <div key={module.id}>
                    <h2 className="mb-2 text-xl font-bold">{module.title}</h2>
                    <p className="mb-4 text-muted-foreground">{module.description}</p>
                    <div className="space-y-4">
                      {Array.isArray(module.submodules) &&
                        module.submodules.map((submodule: any) => (
                          <div className="flex justify-between items-center" key={submodule.id}>
                            <div>
                              <h3 className="text-lg font-medium">{submodule.title}</h3>
                              <p className="text-muted-foreground">{submodule.description}</p>
                            </div>
                            <Badge
                              variant={submodule.isCompleted ? 'secondary' : 'outline'}
                              className="px-3 py-1 rounded-full"
                            >
                              {submodule.isCompleted ? 'Completed' : 'Not Completed'}
                            </Badge>
                          </div>
                        ))}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-[calc(100vh-4rem)]">
            <Card className="w-full max-w-md text-center">
              <CardHeader>
                <CardTitle>Welcome to Your Course</CardTitle>
                <CardDescription>Complete the onboarding to get started</CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={() => setIsOnboardingModalOpen(true)} className="w-full">
                  Start Onboarding
                  <ChevronRightIcon className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
        <CreateCourseModal
          isOpen={isOnboardingModalOpen}
          setIsOpen={setIsOnboardingModalOpen}
          data={currentQuestion}
        />
      </Layout.Body>
    </AppLayout>
  )
}
