import type CheckpointController from '#controllers/checkpoint_controller'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { InferPageProps } from '@adonisjs/inertia/types'
import { Link, router } from '@inertiajs/react'
import { useCallback, useEffect, useState } from 'react'
import { Icons } from '~/lib/components/icons'

import AppLayout from '~/lib/components/layout/app_layout'
import { Layout } from '~/lib/components/layout/custom_layout'
import Markdown from '~/lib/components/markdown'
import { Button } from '~/lib/components/ui/button'
import { Separator } from '~/lib/components/ui/separator'
import { UserNav } from '~/lib/components/user_nav'

export default function CheckpointShow({
  course,
  module,
}: InferPageProps<CheckpointController, 'show'>) {
  const [timeSpent, setTimeSpent] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeSpent((prevTime) => prevTime + 1)
    }, 1000)

    // Add event listener for page unload
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault()
      e.returnValue = ''
    }

    window.addEventListener('beforeunload', handleBeforeUnload)

    return () => {
      clearInterval(timer)
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [])

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
      setIsFullscreen(true)
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen()
        setIsFullscreen(false)
      }
    }
  }, [])

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
        <div className="p-4 min-h-screen bg-background md:px-8">
          <Card className="mx-auto shadow-lg">
            <CardHeader className="space-y-1">
              <CardTitle className="flex flex-col space-y-2 text-2xl font-bold sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center">
                  <Icons.bookOpen className="flex-shrink-0 mr-2 w-6 h-6" />
                  <span className="break-words">{course.title}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="flex items-center p-2 text-white rounded-md bg-foreground">
                    <Icons.clockIcon className="flex-shrink-0 mr-1 w-5 h-5" />
                    <span className="text-base font-medium">{formatTime(timeSpent)}</span>
                  </div>
                  <Button variant="outline" size="icon" onClick={toggleFullscreen} className="p-2">
                    {isFullscreen ? (
                      <Icons.minimize2 className="w-4 h-4" />
                    ) : (
                      <Icons.maximize2 className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h2 className="flex items-center mb-2 text-xl font-semibold">
                    <Icons.layersIcon className="mr-2 w-6 h-6" />
                    {module.title}
                  </h2>
                  <p className="text-muted-foreground">{module.description}</p>
                </div>
                <Separator />
                <Card className="mt-6 bg-muted text-foreground">
                  <CardContent className="p-6">
                    {!module.children && module.content && (
                      <>
                        <div className="max-w-none prose prose-lg dark:prose-invert">
                          <Markdown content={module.content} />
                        </div>
                      </>
                    )}
                    {!module.children && (
                      <div className="flex justify-between">
                        <Button
                          className="mt-4"
                          onClick={() => router.visit(`/courses/${course.id}`)}
                        >
                          Back to course
                        </Button>
                        <Button
                          className="mt-4"
                          onClick={() => router.visit(`/resources/${module.next}`)}
                        >
                          Next
                        </Button>
                      </div>
                    )}
                    {Array.isArray(module.children) && (
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Submodules</h3>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                          {module.children
                            .filter((submodule) => submodule !== null)
                            .map((submodule) => (
                              <Link
                                href={`/resources/${submodule?.id}`}
                                key={submodule.id}
                                className="p-4 rounded-lg border transition-colors cursor-pointer bg-background hover:bg-muted-foreground/10"
                              >
                                <span>{submodule.title}</span>
                              </Link>
                            ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </div>
      </Layout.Body>
    </AppLayout>
  )
}