import { router } from '@inertiajs/react'
import { Button } from '~/lib/components/ui/button'

export default function NotFound() {
  return (
    <div className="h-svh">
      <div className="flex flex-col items-center justify-center w-full h-full gap-2 m-auto">
        <h1 className="text-[7rem] font-bold leading-tight">404</h1>
        <span className="font-medium">Oops! Page Not Found!</span>
        <p className="text-center text-muted-foreground">
          It seems like the page you're looking for <br />
          does not exist or might have been removed.
        </p>
        <div className="flex gap-4 mt-6">
          <Button variant="outline" onClick={() => router.visit('/courses')}>
            Back to Courses
          </Button>
          <Button onClick={() => router.visit('/')}>Back to Home</Button>
        </div>
      </div>
    </div>
  )
}
