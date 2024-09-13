import { InferPageProps } from '@adonisjs/inertia/types'
import { router } from '@inertiajs/react'
import axios from 'axios'
import { format } from 'date-fns'
import { useEffect, useState } from 'react'

import CoursesController from '#controllers/courses_controller'

import { CalendarIcon } from 'lucide-react'
import AppLayout from '~/lib/components/layout/app_layout'
import { Layout } from '~/lib/components/layout/custom_layout'
import { Button } from '~/lib/components/ui/button'
import { Calendar } from '~/lib/components/ui/calendar'
import { Checkbox } from '~/lib/components/ui/checkbox'
import { Input } from '~/lib/components/ui/input'
import { Label } from '~/lib/components/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '~/lib/components/ui/popover'
import { RadioGroup, RadioGroupItem } from '~/lib/components/ui/radio-group'
import { Skeleton } from '~/lib/components/ui/skeleton'
import { Slider } from '~/lib/components/ui/slider'
import { UserNav } from '~/lib/components/user_nav'
import { cn } from '~/lib/lib/utils'

export default function CourseOnboardingPage(
  props: InferPageProps<CoursesController, 'onboardCourse'>
) {
  const { course, currentQuestion } = props
  if (course.isOnboardingComplete) return router.visit(`/courses/${course.id}`)

  const [answer, setAnswer] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [date, setDate] = useState<Date>()

  const renderInput = () => {
    if (!currentQuestion) return
    switch (currentQuestion.type) {
      case 'text':
        return (
          <Input
            value={answer || ''}
            onChange={(e) => setAnswer(e.target.value)}
            className="w-full"
          />
        )
      case 'radio':
        return (
          <RadioGroup value={answer} onValueChange={setAnswer}>
            {currentQuestion.meta?.options.map((option: string) => (
              <div key={option} className="flex items-center space-x-2">
                <RadioGroupItem value={option} id={option} />
                <Label htmlFor={option}>{option}</Label>
              </div>
            ))}
          </RadioGroup>
        )
      case 'checkbox':
        return (
          <div className="space-y-2">
            {currentQuestion.meta?.options.map((option: string) => (
              <div key={option} className="flex items-center space-x-2">
                <Checkbox
                  id={option}
                  checked={(answer || []).includes(option)}
                  onCheckedChange={(checked: boolean) => {
                    setAnswer((prev: string[]) =>
                      checked
                        ? [...(prev || []), option]
                        : (prev || []).filter((item: string) => item !== option)
                    )
                  }}
                />
                <Label htmlFor={option}>{option}</Label>
              </div>
            ))}
          </div>
        )
      case 'scale':
        return (
          <Slider
            min={currentQuestion.meta?.min}
            max={currentQuestion.meta?.max}
            step={1}
            value={[answer || currentQuestion.meta?.min]}
            onValueChange={(value: any) => setAnswer(value[0])}
          />
        )
      case 'datepicker':
        return (
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  'w-full justify-start text-left font-normal',
                  !date && 'text-muted-foreground'
                )}
              >
                <CalendarIcon className="mr-2 w-4 h-4" />
                {date ? format(date, 'PPP') : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0 w-auto">
              <Calendar
                mode="single"
                selected={date}
                onSelect={(newDate) => {
                  setDate(newDate)
                  setAnswer(newDate ? format(newDate, 'yyyy-MM-dd') : null)
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        )
      default:
        return null
    }
  }
  useEffect(() => {
    const interval = setInterval(() => {
      if (currentQuestion) setIsLoading(false)
      if (course.isOnboardingComplete) clearInterval(interval)
      router.reload()
    }, 2000)
  }, [])

  // if (!currentQuestion) router.reload({ only: ['currentQuestion'] })
  const handleSubmit = async () => {
    setIsLoading(true)
    setAnswer(null)
    setDate(undefined)
    await axios.put(`/questions/${currentQuestion?.id}`, {
      answer,
    })
    // setInterval(() => {
    // }, 500)
  }

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
        {currentQuestion ? (
          <div className="grid gap-4 py-4">
            <Label className="text-lg font-semibold">{currentQuestion.content}</Label>
            {renderInput()}
            <Button onClick={handleSubmit} disabled={!answer || isLoading}>
              Next
            </Button>
          </div>
        ) : (
          <div className="mx-auto mt-10 w-full max-w-md">
            <div className="space-y-4">
              {/* Header skeleton */}
              <div className="flex items-center space-x-4">
                <Skeleton className="w-12 h-12 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[250px]" />
                  <Skeleton className="h-4 w-[200px]" />
                </div>
              </div>

              {/* Content skeleton */}
              <div className="space-y-2">
                <Skeleton className="w-full h-4" />
                <Skeleton className="w-full h-4" />
                <Skeleton className="w-3/4 h-4" />
              </div>

              {/* Image placeholder skeleton */}
              <Skeleton className="w-full h-40" />

              {/* Action buttons skeleton */}
              <div className="flex space-x-4">
                <Skeleton className="w-full h-10" />
                <Skeleton className="w-full h-10" />
              </div>
            </div>

            {/* Accessibility considerations */}
            <div className="sr-only" aria-live="polite">
              Loading content, please wait.
            </div>
          </div>
        )}
      </Layout.Body>
    </AppLayout>
  )
}
