import { InferPageProps } from '@adonisjs/inertia/types'
import { router } from '@inertiajs/react'
import { useEffect, useState } from 'react'

import type CoursesController from '#controllers/courses_controller'
import { AnimatePresence, motion } from 'framer-motion'
import {
  CheckCircleIcon,
  ChevronDown,
  ChevronRightIcon,
  ClockIcon,
  LoaderIcon,
  PlayIcon,
  ZapIcon,
} from 'lucide-react'
import AppLayout from '~/lib/components/layout/app_layout'
import { Layout } from '~/lib/components/layout/custom_layout'
import { Button } from '~/lib/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/lib/components/ui/card'
import { Progress } from '~/lib/components/ui/progress'
import { UserNav } from '~/lib/components/user_nav'
import { calculatePercentage } from '~/lib/lib/utils'

export default function CoursesShowPage(props: InferPageProps<CoursesController, 'show'>) {
  const { course, modules } = props

  const [expandedModule, setExpandedModule] = useState<number | null>(null)
  const [showFullDescription, setShowFullDescription] = useState(false)

  const toggleModule = (index: number) => {
    setExpandedModule(expandedModule === index ? null : index)
  }

  const toggleDescription = () => {
    setShowFullDescription(!showFullDescription)
  }

  useEffect(() => {
    if (!course.isModulesCreated) {
      const interval = setInterval(() => {
        console.log('modules created:', course.isModulesCreated)
        router.reload()
      }, 5000)

      return () => clearInterval(interval)
    }
  }, [course.isModulesCreated])

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
            <div className="container p-2 md:p-4 mx-auto space-y-6 rounded-lg">
              <div className="flex items-center gap-4 mb-6">
                <h1 className="text-lg md:text-3xl font-bold">{course.title}</h1>
                {!course.isModulesCreated && (
                  <p className="flex items-center gap-2 text-sm font-medium text-muted-foreground bg-muted px-3 py-1 rounded-full">
                    <LoaderIcon className="w-4 h-4 animate-spin" />
                    <span className="hidden md:inline"> Creating modules...</span>
                  </p>
                )}
              </div>
              <Card className="p-6 bg-background rounded-lg shadow-lg">
                <div className="mb-4">
                  <p className={`text-gray-700 ${!showFullDescription && 'md:block hidden'}`}>
                    {course.description}
                  </p>
                  <p className={`text-gray-700 md:hidden ${showFullDescription ? 'block' : 'line-clamp-3'}`}>
                    {course.description}
                  </p>
                  <button
                    onClick={toggleDescription}
                    className="text-sm text-blue-600 hover:underline mt-2 md:hidden"
                  >
                    {showFullDescription ? 'Show Less' : 'Show More'}
                  </button>
                </div>
                <div className="flex items-center space-x-4 whitespace-nowrap">
                  <Progress
                    value={(course.completedModule / course.totalModule) * 100}
                    className="flex-grow"
                  />
                  <p className="flex items-center text-sm text-gray-500">
                    <ClockIcon className="mr-1 w-4 h-4" />
                    <span>
                      {course.completedModule} / {course.totalModule} Modules
                    </span>
                  </p>
                </div>
                <p className="mt-2 text-sm text-gray-600">
                  {calculatePercentage(course.totalModule, course.completedModule || 0)}% Complete
                </p>
              </Card>
              {modules.map((module, index) => (
                <motion.div
                  key={module.id}
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
                      <div className="flex flex-col md:flex-row gap-2 justify-between md:items-center">
                        <div className="flex items-center space-x-3">
                          <ZapIcon className="w-6 h-6" />
                          <h2 className="text-lg font-semibold">{module.title}</h2>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Progress
                            value={calculatePercentage(module.totalSubmodule, module.completedSubmodule || 0)}
                            className="w-24"
                          />
                          <span className="text-sm text-gray-600 flex gap-2">
                            {!course.isModulesCreated && (
                              <span className="flex items-center gap-2 text-sm font-medium text-muted-foreground bg-muted px-3 py-1 rounded-full">
                                <LoaderIcon className="w-4 h-4 animate-spin" />
                              </span>
                            )} {calculatePercentage(module.totalSubmodule, module.completedSubmodule || 0)}%
                          </span>
                          <motion.div
                            animate={{ rotate: expandedModule === index ? 180 : 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            <ChevronDown className="w-5 h-5" />
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
                          <CardContent className="px-4 pb-4 space-y-2">
                            {module.submodules.map((submodule: any, subIndex: number) => (
                              <motion.div
                                key={subIndex}
                                className="flex justify-between flex-col md:flex-row items-center md:p-3 bg-gray-50 rounded-md"
                                initial={{ x: -20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: subIndex * 0.1 }}
                              >
                                <div className="flex items-center space-x-3">
                                  {submodule.isCompleted ? (
                                    <CheckCircleIcon className="w-5 h-5 " />
                                  ) : (
                                    <div className="w-5 h-5 rounded-full border-2 border-gray-300" />
                                  )}
                                  <div>
                                    <h3 className="font-medium">{submodule.title}</h3>
                                    <p className="text-sm text-gray-600">{submodule.description}</p>
                                  </div>
                                </div>
                                <Button
                                  size="sm"
                                  variant={submodule.isCompleted ? 'outline' : 'default'}
                                >
                                  {submodule.isCompleted ? 'Review' : 'Start'}
                                  <PlayIcon className="ml-2 w-4 h-4" />
                                </Button>
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
                  <ChevronRightIcon className="ml-2 w-4 h-4" />
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </Layout.Body>
    </AppLayout>
  )
}
