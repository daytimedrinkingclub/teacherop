import { InferPageProps } from '@adonisjs/inertia/types'

import AppLayout from '~/lib/components/layout/app_layout'
import { Layout } from '~/lib/components/layout/custom_layout'
import Assessment from '~/lib/components/assignments/assignmet'
import { UserNav } from '~/lib/components/user_nav'
import BreadcrumbNav from '~/lib/components/bedcrumLinks'
import assignmentsController from '#controllers/assignment_controller'

interface Question {
  id: number
  text: string
  type: 'mcq' | 'subjective' // Correctly defined as a union of string literals
  options?: string[] // Options for MCQ
}

export default function CheckpointShow({}: InferPageProps<assignmentsController, 'show'>) {
  const breadcrumbLinks = [
    { name: 'Home', href: '/' },
    // { name: 'Course', href: `/courses/${course.id}` },
    // { name: 'Module', href: `/modules/${module.id}` },
    // { name: 'Lesson', href: `/lessons/${submodule.id}` },
  ]

  const questions: Question[] = [
    {
      id: 1,
      text: 'What is the capital of France?',
      type: 'mcq', // Use the correct literal type here
      options: ['Berlin', 'Madrid', 'Paris', 'Rome'],
    },
    {
      id: 2,
      text: 'Explain the significance of the theory of relativity.',
      type: 'subjective', // Use the correct literal type here
    },
  ]

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
        <BreadcrumbNav links={breadcrumbLinks} />
        <Assessment
          courseTitle="Physics 101"
          moduleTitle="Introduction to Physics"
          submoduleTitle="Basic Concepts"
          questions={questions}
          duration={1800} // 30 minutes
        />
      </Layout.Body>
    </AppLayout>
  )
}
