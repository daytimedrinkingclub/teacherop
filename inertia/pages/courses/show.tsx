import { InferPageProps } from '@adonisjs/inertia/types'
import { router } from '@inertiajs/react'
import axios from 'axios'
import { useEffect, useState } from 'react'

import CoursesController from '#controllers/courses_controller'
import CreateCourseModal from '~/lib/components/create_course'
import AppLayout from '~/lib/components/layout/app_layout'
import { Layout } from '~/lib/components/layout/custom_layout'
import { UserNav } from '~/lib/components/user_nav'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/lib/components/ui/card'

import { transmit } from '~/lib/lib/utils'
import { Button } from '~/lib/components/ui/button'
import { ChevronRightIcon, ChevronDownIcon, BookOpenIcon, CheckCircleIcon, PlayIcon, ClockIcon, ChevronDown, ZapIcon } from 'lucide-react'
import { Progress } from '~/lib/components/ui/progress'
import { motion, AnimatePresence } from 'framer-motion'

const subscription = transmit.subscription('checkpoint_created')
let stopListening: () => void
subscription.create().then()


export default function CoursesShow(props: InferPageProps<CoursesController, 'show'>) {
  const { course, modules } = props as any
  const [isOnboardingModalOpen, setIsOnboardingModalOpen] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState<any>(null)

  const [expandedModule, setExpandedModule] = useState<number | null>(null)

  const toggleModule = (index: number) => {
    setExpandedModule(expandedModule === index ? null : index)
  }

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
        <div className="hidden md:flex justify-end items-end w-full">
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
            <div className="container mx-auto p-4 space-y-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg">
              <h1 className="text-3xl font-bold mb-6 text-blue-800">{course.title}</h1>
              <Card className="bg-white p-6 shadow-lg rounded-lg">
                <p className="text-gray-700 mb-4">{course.description}</p>
                <div className="flex items-center space-x-4 whitespace-nowrap">
                  <Progress value={course.progress} className="flex-grow" />
                  <p className="text-sm text-gray-500 flex items-center">
                    <ClockIcon className="w-4 h-4 mr-1 text-blue-500" />
                    <span>{course.progress}% Complete</span>
                  </p>
                </div>
              </Card>
              {modules.map((module: any, index: number) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Card className="bg-white rounded-lg shadow-md overflow-hidden border-l-4 border-blue-500">
                    <motion.div
                      className="p-4 cursor-pointer"
                      onClick={() => toggleModule(index)}
                      initial={false}
                      animate={{ backgroundColor: expandedModule === index ? "#f3f4f6" : "#ffffff" }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <ZapIcon className="w-6 h-6 text-blue-500" />
                          <h2 className="text-lg font-semibold text-blue-700">{module.title}</h2>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Progress value={module.progress} className="w-24" />
                          <span className="text-sm text-gray-600">
                            {module.progress}%
                          </span>
                          <motion.div
                            animate={{ rotate: expandedModule === index ? 180 : 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            <ChevronDown className="w-5 h-5 text-blue-500" />
                          </motion.div>
                        </div>
                      </div>
                      <p className="mt-2 text-sm text-gray-600">{module.description}</p>
                    </motion.div>
                    <AnimatePresence>
                      {expandedModule === index && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <CardContent className="px-4 pb-4 space-y-2">
                            {module.submodules.map((submodule: any, subIndex: number) => (
                              <motion.div
                                key={subIndex}
                                className="bg-gray-50 p-3 rounded-md flex items-center justify-between"
                                initial={{ x: -20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: subIndex * 0.1 }}
                              >
                                <div className="flex items-center space-x-3">
                                  {submodule.isCompleted ? (
                                    <CheckCircleIcon className="w-5 h-5 text-green-500" />
                                  ) : (
                                    <div className="w-5 h-5 rounded-full border-2 border-gray-300" />
                                  )}
                                  <div>
                                    <h3 className="font-medium text-blue-600">{submodule.title}</h3>
                                    <p className="text-sm text-gray-600">{submodule.description}</p>
                                  </div>
                                </div>
                                <Button
                                  size="sm"
                                  variant={submodule.isCompleted ? "outline" : "default"}
                                  className={submodule.isCompleted ? "text-green-500" : "bg-blue-500 hover:bg-blue-600 text-white"}
                                >
                                  {submodule.isCompleted ? "Review" : "Start"}
                                  <PlayIcon className="w-4 h-4 ml-2" />
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
