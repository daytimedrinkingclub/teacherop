import { InferPageProps } from '@adonisjs/inertia/types'
import { Link, router } from '@inertiajs/react'
import { useEffect, useState } from 'react'

import type CoursesController from '#controllers/courses_controller'
import { AnimatePresence, motion } from 'framer-motion'
import { Icons } from '~/lib/components/icons'

import axios from 'axios'
import BreadcrumbNav from '~/lib/components/bedcrumLinks'
import AppLayout from '~/lib/components/layout/app_layout'
import { Layout } from '~/lib/components/layout/custom_layout'
import { Button, buttonVariants } from '~/lib/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/lib/components/ui/card'
import { Progress } from '~/lib/components/ui/progress'
import { UserNav } from '~/lib/components/user_nav'
import { calculatePercentage, cn } from '~/lib/lib/utils'

interface CourseStatus {
  modulesCreated: boolean
  submodulesCreated: boolean
}

export default function CoursesShowPage(props: InferPageProps<CoursesController, 'show'>) {
  const { course, modules } = props

  const [expandedModule, setExpandedModule] = useState<number | null>(null)
  const [showFullDescription, setShowFullDescription] = useState(false)

  const breadcrumbLinks = [
    { name: 'Home', href: '/' },
    { name: course.title || '', href: `/courses/${course.id}` },
  ]

  const toggleModule = (index: number) => {
    setExpandedModule(expandedModule === index ? null : index)
  }

  const toggleDescription = () => {
    setShowFullDescription(!showFullDescription)
  }

  const [pollingInterval] = useState<number>(5000) // Poll every 5000ms (5 seconds)
  const [maxPollingDuration] = useState<number>(60000 * 5) // Maximum polling duration of 60 *5 seconds

  useEffect(() => {
    if (!course.isModulesCreated) {
      const startTime = Date.now() // Track start time

      const pollApi = async () => {
        try {
          const response = await axios.get<CourseStatus>(`/api/courses/${course.id}/status`)
          const data = response.data

          if (data.modulesCreated && data.submodulesCreated) {
            console.log('Modules and submodules created:', data)
            clearInterval(intervalId) // Stop polling
            router.reload() // Reload the page
            return
          }

          const elapsedTime = Date.now() - startTime
          if (elapsedTime >= maxPollingDuration) {
            console.log('Max polling duration reached. Stopping polling.')
            clearInterval(intervalId) // Stop polling after the max duration
          }
        } catch (error) {
          console.error('Error while polling API:', error)
          // Handle error and continue polling until max duration
          const elapsedTime = Date.now() - startTime
          if (elapsedTime >= maxPollingDuration) {
            console.log('Max polling duration reached. Stopping polling.')
            clearInterval(intervalId) // Stop polling after the max duration
          }
        }
      }

      const intervalId = setInterval(pollApi, pollingInterval) // Set up polling every 5 seconds

      // Cleanup interval on component unmount
      return () => clearInterval(intervalId)
    }
  }, [course.isModulesCreated, course.id, pollingInterval, maxPollingDuration, router])

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
        {course.isOnboardingComplete ? (
          <>
            <div className="container p-2 mx-auto space-y-6 rounded-lg md:p-4">
              {breadcrumbLinks.length && <BreadcrumbNav links={breadcrumbLinks} />}
              <div className="flex gap-4 items-center mb-6">
                <h1 className="text-lg font-bold md:text-3xl">{course.title}</h1>
                {!course.isModulesCreated && (
                  <p className="flex gap-2 items-center px-3 py-1 text-sm font-medium rounded-full text-muted-foreground bg-muted">
                    <Icons.loader className="w-4 h-4 animate-spin" />
                    <span className="hidden md:inline"> Creating modules...</span>
                  </p>
                )}
              </div>
              <Card className="p-6 rounded-lg shadow-lg bg-background">
                <div className="mb-4">
                  <p className={`text-gray-700 ${!showFullDescription && 'md:block hidden'}`}>
                    {course.description}
                  </p>
                  <p
                    className={`text-gray-700 md:hidden ${showFullDescription ? 'block' : 'line-clamp-3'}`}
                  >
                    {course.description}
                  </p>
                  <button
                    onClick={toggleDescription}
                    className="mt-2 text-sm text-blue-600 hover:underline md:hidden"
                  >
                    {showFullDescription ? 'Show Less' : 'Show More'}
                  </button>
                </div>

                <div className="flex items-center space-x-4 whitespace-nowrap">
                  <Progress
                    value={calculatePercentage(course.totalModule, course.completedModule || 0)}
                    className="flex-grow"
                  />
                  <p className="flex items-center text-sm text-gray-500">
                    <Icons.clock className="mr-1 w-4 h-4" />
                    <span>
                      {course.completedModule} / {course.totalModule} Modules
                    </span>
                  </p>
                </div>
                <p className="mt-2 text-sm text-gray-600">
                  {calculatePercentage(course.totalModule, course.completedModule || 0)}% Complete
                </p>

                {/* Start Course Button */}
                <div className="mt-4 flex justify-end">
                  {modules[0]?.id && (
                    <Link
                      href={`/modules/${modules[0].id}`}
                      className={cn(buttonVariants({ variant: 'default' }))}
                    >
                      Explore Course
                      <Icons.chevronRight className="ml-2 w-4 h-4" />
                    </Link>
                  )}
                </div>
              </Card>

              {modules.map((module, index) => (
                <motion.div
                  key={module.id || index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Card className="overflow-hidden rounded-lg border-l-4 shadow-md bg-background">
                    <motion.div
                      className="p-4 cursor-pointer"
                      onClick={() => toggleModule(index)}
                      initial={false}
                      animate={{
                        backgroundColor: expandedModule === index ? '#f3f4f6' : '#ffffff',
                      }}
                    >
                      <div className="flex flex-col gap-2 justify-between md:flex-row md:items-center">
                        <div className="flex items-center space-x-3">
                          <Icons.zap className="w-6 h-6" />
                          <h2 className="text-lg font-semibold">{module.title}</h2>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Progress
                            value={calculatePercentage(
                              module.totalSubmodule,
                              module.completedSubmodule || 0
                            )}
                            className="w-24"
                          />
                          <span className="flex gap-2 text-sm text-gray-600">
                            {calculatePercentage(
                              module.totalSubmodule,
                              module.completedSubmodule || 0
                            )}
                            %
                          </span>
                          <motion.div
                            animate={{ rotate: expandedModule === index ? 180 : 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            <Icons.chevronDown className="w-5 h-5" />
                          </motion.div>
                        </div>
                      </div>
                      <p className="mt-2 text-sm text-gray-600">{module.description}</p>
                    </motion.div>
                    <AnimatePresence>
                      {expandedModule === index && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <CardContent className="p-0 py-4 md:px-4 pb-4 space-y-2">
                            {module.submodules.map((submodule: any, subIndex: number) => (
                              <motion.div
                                key={submodule.id || subIndex}
                                className="flex flex-col justify-between items-center bg-gray-50 rounded-md md:flex-row md:p-3"
                                initial={{ x: -20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: subIndex * 0.1 }}
                              >
                                <div className="flex items-center space-x-3">
                                  {submodule.isCompleted ? (
                                    <Icons.checkCircle className="w-5 h-5" />
                                  ) : (
                                    <div className="w-5 h-5 rounded-full border-2 border-gray-300" />
                                  )}
                                  <div>
                                    <h3 className="font-medium">{submodule.title}</h3>
                                    <p className="text-sm text-gray-600">{submodule.description}</p>
                                  </div>
                                </div>
                              </motion.div>
                            ))}
                          </CardContent>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Card>
                </motion.div>
              ))}
            </div>
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
