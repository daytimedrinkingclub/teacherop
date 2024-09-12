import { InferPageProps } from '@adonisjs/inertia/types'

import DashboardController from '#controllers/dashboard_controller'

import AppLayout from '~/lib/components/layout/app_layout'
import { Layout } from '~/lib/components/layout/custom_layout'
import { UserNav } from '~/lib/components/user_nav'

export default function DashboardPage({ }: InferPageProps<DashboardController, 'index'>) {
  return (
    <AppLayout>
      <Layout.Header className=''>
        <div className="flex items-end justify-end w-full">
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
