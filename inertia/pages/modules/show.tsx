import { InferPageProps } from '@adonisjs/inertia/types'
import ModulesController from '#controllers/modules_controller'
import { Layout } from '@/components/layout/custom_layout'
import { UserNav } from '@/components/user_nav'
import AppLayout from '@/components/layout/app_layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Icons } from '~/lib/components/icons'
import { Separator } from '~/lib/components/ui/separator'
import { Link } from '@inertiajs/react'
// import { useFullScreen } from '~/lib/hooks/use_fullscreen'
import BreadcrumbNav from '~/lib/components/bedcrumLinks'
import FullscreenBtn from '~/lib/components/fullscreenBtn'

export default function ModulesShow({
  course,
  module,
  submodules,
}: InferPageProps<ModulesController, 'show'>) {
  console.log(module, submodules)
  // const { isFullScreen, enterFullScreen, toggleFullScreen } = useFullScreen()

  // useEffect(() => {
  //   enterFullScreen()
  // }, [])

  const breadcrumbLinks = [
    { name: 'Home', href: '/' },
    { name: 'Course', href: `/courses/${course.id}` },
    { name: 'Module', href: `/modules/${module.id}` },
  ]

  return (
    <AppLayout>
      <Layout.Header></Layout.Header>
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
                <FullscreenBtn />
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
                        <h3 className="text-lg font-semibold">Submodules</h3>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                          {submodules.map((submodule) => (
                            <Link
                              href={`/lessons/${submodule.id}`}
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
