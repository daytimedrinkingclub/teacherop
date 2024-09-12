import { InferPageProps } from '@adonisjs/inertia/types'

import CoursesController from '#controllers/courses_controller'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Link, router } from '@inertiajs/react'
import AppLayout from '~/lib/components/layout/app_layout'
import { Layout } from '~/lib/components/layout/custom_layout'
import { Badge } from '~/lib/components/ui/badge'
import { Button } from '~/lib/components/ui/button'
import { UserNav } from '~/lib/components/user_nav'
import { BookIcon, BrainIcon, PlusIcon, UserIcon } from 'lucide-react'
import { Progress } from '~/lib/components/ui/progress'

export default function CoursesPage({ courses }: InferPageProps<CoursesController, 'index'>) {
  const isOngoing = courses.some((course: any) => course.status === 'ongoing')

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
        <div className="w-full max-w-6xl px-4 py-8 mx-auto md:px-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold">Your Courses</h1>
            <div className="relative">
              <Button
                size="sm"
                onClick={() => {
                  router.visit('/courses/create')
                }}
                disabled={isOngoing}
              >
                <PlusIcon className="h-5 w-5" />  New Course
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course: any) => (
              <Link
                key={course.id}
                href={`/courses/${course.id}`}
                className="overflow-hidden transition-shadow border rounded-lg shadow-sm bg-card hover:shadow-md"
              >
                <Card>
                  <CardHeader>
                    <CardTitle>{course.title || course.query}</CardTitle>
                    <CardDescription>{course.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Progress value={33} className="mb-2" />
                    <p className="text-sm text-gray-500">33% Complete</p>
                    <Badge variant={course.status === 'ongoing' ? 'outline' : 'secondary'}>
                      {course.status}
                    </Badge>
                  </CardContent>
                </Card>
                {/* <div className="p-4">
                  <h3 className="mb-2 text-lg font-semibold truncate">
                    {course.title || course.query}
                  </h3>
                  <p className="text-muted-foreground line-clamp-2">{course.description}</p>
                  <Badge variant={course.status === 'ongoing' ? 'outline' : 'secondary'}>
                    {course.status}
                  </Badge>
                </div> */}
              </Link>
            ))}
            {courses.length === 0 ? <Link
              href={'/courses/create'}
            >
              <Card className="bg-primary text-primary-foreground">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PlusIcon className="h-5 w-5" />
                    Create New Course
                  </CardTitle>
                  <CardDescription className="text-primary-foreground/80">
                    Let AI generate a course for you
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">
                    Input your topic, and our AI will create modules, content, and questions.
                  </p>
                </CardContent>
              </Card>
            </Link> : ""}
          </div>
          <div className="mt-12">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">How TeacherOP Works</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BrainIcon className="h-5 w-5" />
                    AI Course Creation
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">Our AI analyzes your topic and generates a comprehensive course structure.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookIcon className="h-5 w-5" />
                    Custom Modules
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">Tailored modules and content to match your learning objectives.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <UserIcon className="h-5 w-5" />
                    Personalized Learning
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">Adaptive questions and assessments to reinforce your understanding.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </Layout.Body>
    </AppLayout>
  )
}
