import SubmodulesController from '#controllers/submodules_controller'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { InferPageProps } from '@adonisjs/inertia/types'
import { router } from '@inertiajs/react'
import { Icons } from '~/lib/components/icons'
// import { useFullScreen } from '~/lib/hooks/use_fullscreen'

import AppLayout from '~/lib/components/layout/app_layout'
import { Layout } from '~/lib/components/layout/custom_layout'
import Markdown from '~/lib/components/markdown'
import Timer from '~/lib/components/timer'
import { Button } from '~/lib/components/ui/button'
import { Separator } from '~/lib/components/ui/separator'
import { UserNav } from '~/lib/components/user_nav'
import BreadcrumbNav from '~/lib/components/bedcrumLinks'
import FullscreenBtn from '~/lib/components/fullscreenBtn'

export default function CheckpointShow({
  course,
  module,
  submodule,
}: InferPageProps<SubmodulesController, 'show'>) {
  const { next } = submodule
  // const { isFullScreen, enterFullScreen, toggleFullScreen } = useFullScreen()

  // useEffect(() => {
  //   enterFullScreen()
  // }, [])

  const breadcrumbLinks = [
    { name: 'Home', href: '/' },
    { name: 'Course', href: `/courses/${course.id}` },
    { name: 'Module', href: `/modules/${module.id}` },
    { name: 'Lesson', href: `/lessons/${submodule.id}` },
  ]


  return (
    <AppLayout>
      <Layout.Header>

      </Layout.Header>
      <Layout.Body>
        <div className="p-4 min-h-screen bg-background md:px-8">
          <BreadcrumbNav links={breadcrumbLinks} />
          <Card className="mx-auto shadow-lg">
            <CardHeader className="space-y-1">
              <CardTitle className="flex flex-col space-y-2 text-2xl font-bold sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center">
                  <Icons.bookOpen className="flex-shrink-0 mr-2 w-6 h-6" />
                  <span className="break-words">{course.title}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Timer initialTime={0} />
                  <FullscreenBtn />
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
                    {submodule.content && (
                      <>
                        <div className="max-w-none prose prose-lg dark:prose-invert">
                          <Markdown content={submodule.content.value} />
                        </div>
                      </>
                    )}

                    <div className="flex justify-between">
                      <Button
                        className="mt-4"
                        onClick={() => router.visit(`/courses/${course.id}`)}
                      >
                        Back to course
                      </Button>
                      <div className="flex items-center space-x-2">
                        {next?.type === 'module' && <Button
                          className="mt-4"
                          onClick={() => router.visit(`/assignments/${next.id}`)}
                        >
                          Start assignment
                        </Button>
                        }
                        <Button
                          className="mt-4"
                          onClick={() => {
                            const url =
                              next &&
                              (next.type === 'module' ? `/modules/${next.id}` : `/lessons/${next.id}`)
                            url && router.visit(url)
                          }}
                          disabled={!next}
                        >
                          Next
                        </Button>
                      </div>
                    </div>
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
