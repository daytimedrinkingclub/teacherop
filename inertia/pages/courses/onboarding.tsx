import CoursesController from '#controllers/courses_controller'
import { InferPageProps } from '@adonisjs/inertia/types'
import AppLayout from '~/lib/components/layout/app_layout'
import { Layout } from '~/lib/components/layout/custom_layout'
import { UserNav } from '~/lib/components/user_nav'

export default function CourseOnboardingPage(
  props: InferPageProps<CoursesController, 'onboardCourse'>
) {
  console.log(props)
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
    </AppLayout>
  )
}
