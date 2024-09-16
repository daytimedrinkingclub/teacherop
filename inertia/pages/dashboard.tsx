import { InferPageProps } from '@adonisjs/inertia/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import DashboardController from '#controllers/dashboard_controller'
import { Icons } from '@/components/icons'
import AppLayout from '~/lib/components/layout/app_layout'
import { Layout } from '~/lib/components/layout/custom_layout'
import { UserNav } from '~/lib/components/user_nav'

// Sample data - replace with actual data in a real application
const stats = {
  totalCourses: 10,
  completedCourses: 3,
  timeSpent: 1500, // in minutes
  achievements: 15,
  currentStreak: 7,
  totalPoints: 2500,
}

function formatTime(minutes: number) {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return `${hours}h ${mins}m`
}

export default function DashboardPage({ }: InferPageProps<DashboardController, 'index'>) {
  const completionPercentage = (stats.completedCourses / stats.totalCourses) * 100
  return (
    <AppLayout>
      <Layout.Header className="">
        <div className="hidden md:flex items-end justify-end w-full">
          {/* <Search /> */}
          <div className="flex items-end space-x-4">
            {/* <ThemeSwitch /> */}
            <UserNav />
          </div>
        </div>
      </Layout.Header>
      <Layout.Body>
        <div className="p-6">
          <h1 className="text-3xl font-bold mb-6">Course Dashboard</h1>
          <div className="grid gap-6 md:grid-cols-3">
            <Card className="border-l-4">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
                <Icons.bookOpen className="h-6 w-6" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalCourses}</div>
                <p className="text-xs">Courses available</p>
              </CardContent>
            </Card>
            <Card className="border-l-4">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Completed Courses</CardTitle>
                <Icons.checkCircle className="h-6 w-6" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.completedCourses}</div>
                <Progress value={completionPercentage} className="mt-2" />
                <p className="text-xs mt-2">{completionPercentage.toFixed(1)}% completion rate</p>
              </CardContent>
            </Card>
            <Card className="border-l-4">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Time Spent</CardTitle>
                <Icons.clock className="h-6 w-6" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatTime(stats.timeSpent)}</div>
                <p className="text-xs">Total learning time</p>
              </CardContent>
            </Card>
            <Card className="border-l-4">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Achievements</CardTitle>
                <Icons.trophy className="h-6 w-6" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.achievements}</div>
                <p className="text-xs">Badges earned</p>
              </CardContent>
            </Card>
            <Card className="border-l-4">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
                <Icons.zap className="h-6 w-6" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.currentStreak} days</div>
                <p className="text-xs ">Keep it up!</p>
              </CardContent>
            </Card>
            <Card className="border-l-4">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Points</CardTitle>
                <Icons.target className="h-6 w-6" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalPoints}</div>
                <p className="text-xs">XP gained</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </Layout.Body>
    </AppLayout>
  )
}
