import ModulesController from '#controllers/modules_controller'
import AppLayout from '@/components/layout/app_layout'
import { Layout } from '@/components/layout/custom_layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { InferPageProps } from '@adonisjs/inertia/types'
import { Icons } from '~/lib/components/icons'
import { Separator } from '~/lib/components/ui/separator'
// import { useFullScreen } from '~/lib/hooks/use_fullscreen'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Link } from '@inertiajs/react'
import { useEffect } from 'react'
import BreadcrumbNav from '~/lib/components/bedcrumLinks'
import { useFullScreen } from '~/lib/hooks/use_fullscreen'

export default function ModulesShow({
  course,
  module,
  submodules,
}: InferPageProps<ModulesController, 'show'>) {
  console.log(module, submodules)
  const { enterFullScreen } = useFullScreen()

  useEffect(() => {
    enterFullScreen()
  }, [])

  const breadcrumbLinks = [
    { name: 'Home', href: '/' },
    { name: 'Course', href: `/courses/${course.id}` },
    { name: module.title, href: `/modules/${module.id}` },
  ]

  const isSubmoduleDisabled = (index: number) => {
    return index > 0 && !submodules[index - 1].isCompleted
  }

  return (
    <AppLayout>
      <Layout.Header></Layout.Header>
      <Layout.Body>
        <div className="p-4 min-h-screen bg-background md:px-8">
          {breadcrumbLinks.length && <BreadcrumbNav links={breadcrumbLinks} />}
          <Card className="mx-auto shadow-lg">
            <CardHeader className="space-y-1">
              <CardTitle className="flex flex-col space-y-2 text-2xl font-bold sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center">
                  <Icons.bookOpen className="flex-shrink-0 mr-2 w-6 h-6" />
                  <span className="break-words">{course.title}</span>
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
                    {Array.isArray(submodules) && (
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Lessons</h3>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                          {submodules.map((submodule, index) => (
                            <TooltipProvider key={submodule.id}>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Link
                                    href={`/lessons/${submodule.id}`}
                                    className={`p-4 rounded-lg border transition-colors ${
                                      isSubmoduleDisabled(index)
                                        ? 'bg-background cursor-not-allowed'
                                        : 'bg-background hover:bg-muted-foreground/10 cursor-pointer'
                                    }`}
                                  >
                                    <div className="flex justify-between items-center">
                                      <span>{`${index + 1}. ${submodule.title}`}</span>
                                      {submodule.isCompleted ? (
                                        <Icons.checkCircle className="w-5 h-5" />
                                      ) : index == 1 || isSubmoduleDisabled(index) ? (
                                        <Icons.lock className="w-5 h-5" />
                                      ) : (
                                        <Icons.unlock className="w-5 h-5" />
                                      )}
                                    </div>
                                  </Link>
                                </TooltipTrigger>
                                {isSubmoduleDisabled(index) && (
                                  <TooltipContent>
                                    <p>
                                      You cannot start this until the previous Lesson is completed.
                                    </p>
                                  </TooltipContent>
                                )}
                              </Tooltip>
                            </TooltipProvider>
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
