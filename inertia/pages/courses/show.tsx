import CoursesController from '#controllers/courses_controller'
import { InferPageProps } from '@adonisjs/inertia/types'
import { router } from '@inertiajs/react'
import axios from 'axios'
import { useEffect, useState } from 'react'
import CreateCourseModal from '~/lib/components/create_course'
import AppLayout from '~/lib/components/layout/app_layout'
import { Layout } from '~/lib/components/layout/custom_layout'
import { Badge } from '~/lib/components/ui/badge'
import { UserNav } from '~/lib/components/user_nav'

import { transmit } from '~/lib/lib/utils'

const subscription = transmit.subscription('checkpoint_created')
let stopListening: () => void
subscription.create().then()

export default function CoursesShow(props: InferPageProps<CoursesController, 'show'>) {
  const { course, modules } = props as any
  const [isOnboardingModalOpen, setIsOnboardingModalOpen] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState<any>(null)

  console.log('modules', modules)

  useEffect(() => {
    if (!course.isOnboardingComplete) {
      console.log('getting current question')
      axios.get('/questions/current').then((res) => {
        setCurrentQuestion(res.data.question)
      })
    }
    stopListening = subscription.onMessage(() => {
      router.reload({ only: ['course', 'modules'] })
    })
    return () => stopListening()
  }, [])

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
        {course.isOnboardingComplete ? (
          <div className="w-full max-w-3xl px-4 py-8 mx-auto sm:px-6 lg:px-8">
            <h1 className="mb-6 text-3xl font-bold">{course.title || course.query}</h1>
            <p className="mb-6 text-sm text-muted-foreground">{course.description}</p>
            <div className="space-y-8">
              {Array.isArray(modules) &&
                modules.map((module) => (
                  <div>
                    <h2 className="mb-2 text-xl font-bold">{module.title}</h2>
                    <p className="mb-4 text-muted-foreground">{module.description}</p>
                    <div className="space-y-4">
                      {Array.isArray(module.submodules) &&
                        module.submodules.map((submodules: any) => (
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="text-lg font-medium">{submodules.title}</h3>
                              <p className="text-muted-foreground">{submodules.description}</p>
                            </div>
                            <Badge
                              variant={submodules.isCompleted ? 'secondary' : 'outline'}
                              className="px-3 py-1 rounded-full"
                            >
                              {submodules.isCompleted ? 'Completed' : 'Not Completed'}
                            </Badge>
                          </div>
                        ))}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ) : (
          <>
            <h3>Onboarding not complete</h3>
            <button onClick={() => setIsOnboardingModalOpen(true)}>Start Onboarding</button>
          </>
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
