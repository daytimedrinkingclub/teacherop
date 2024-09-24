import type { InferPageProps } from '@adonisjs/inertia/types'

import AppLayout from '~/lib/components/layout/app_layout'
import { Layout } from '~/lib/components/layout/custom_layout'
import Assessment from '~/lib/components/assignments/assignmet'
import BreadcrumbNav from '~/lib/components/bedcrumLinks'
import type AssignmentsController from '#controllers/assessment_controller'

export default function CheckpointShow({
  assessments,
  course,
  module,
  submodule,
}: InferPageProps<AssignmentsController, 'show'>) {
  console.log(assessments)
  const breadcrumbLinks = [
    { name: 'Home', href: '/' },
    // { name: 'Course', href: `/courses/${course.id}` },
    // { name: 'Module', href: `/modules/${module.id}` },
    // { name: 'Lesson', href: `/lessons/${submodule.id}` },
  ]

  return (
    <AppLayout>
      <Layout.Body>
        <BreadcrumbNav links={breadcrumbLinks} />
        <Assessment
          courseTitle={course.title!}
          moduleTitle={module.title!}
          submoduleTitle={submodule.title!}
          questions={assessments}
          duration={1800} // 30 minutes
        />
      </Layout.Body>
    </AppLayout>
  )
}
