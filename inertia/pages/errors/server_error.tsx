import { router } from '@inertiajs/react'
import { Button } from '~/lib/components/ui/button'

export default function ServerError() {
  return (
    <div className="w-full h-svh">
      <div className="flex flex-col items-center justify-center w-full h-full gap-2 m-auto">
        <h1 className="text-[7rem] font-bold leading-tight">500</h1>
        <span className="font-medium">Oops! Something went wrong {`:')`}</span>
        <p className="text-center text-muted-foreground">
          We apologize for the inconvenience. <br /> Please try again later.
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
