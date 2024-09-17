import { InferPageProps } from '@adonisjs/inertia/types'
import ModulesController from '#controllers/modules_controller'
import { Layout } from '@/components/layout/custom_layout'
import { UserNav } from '@/components/user_nav'
import AppLayout from '@/components/layout/app_layout'

export default function ModulesShow({
  module,
  submodules,
}: InferPageProps<ModulesController, 'show'>) {
  console.log(module, submodules)
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
      <Layout.Body></Layout.Body>
    </AppLayout>
  )
}
