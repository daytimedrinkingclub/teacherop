import CoursesController from '#controllers/courses_controller'
import { InferPageProps } from '@adonisjs/inertia/types'
import { router } from '@inertiajs/react'
import axios from 'axios'
import { format } from 'date-fns'
import { FormEvent, useEffect, useState } from 'react'
import { Icons } from '~/lib/components/icons'

import AppLayout from '~/lib/components/layout/app_layout'
import { Layout } from '~/lib/components/layout/custom_layout'
import { Button } from '~/lib/components/ui/button'
import { Calendar } from '~/lib/components/ui/calendar'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '~/lib/components/ui/card'
import { Checkbox } from '~/lib/components/ui/checkbox'
import { Input } from '~/lib/components/ui/input'
import { Label } from '~/lib/components/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '~/lib/components/ui/popover'
import { RadioGroup, RadioGroupItem } from '~/lib/components/ui/radio-group'
import { Skeleton } from '~/lib/components/ui/skeleton'
import { Slider } from '~/lib/components/ui/slider'
import { cn } from '~/lib/lib/utils'

export default function CourseOnboardingPage(
  props: InferPageProps<CoursesController, 'onboardCourse'>
) {
  const { course, currentQuestion } = props

  const [answer, setAnswer] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [date, setDate] = useState<Date>()

  const renderInput = () => {
    if (!currentQuestion) return null
    switch (currentQuestion.type) {
      case 'text':
        return (
          <Input
            value={answer || ''}
            onChange={(e) => setAnswer(e.target.value)}
            className="w-full"
            placeholder="Type your answer here..."
            autoFocus
          />
        )
      case 'radio':
        return (
          <RadioGroup value={answer} onValueChange={setAnswer}>
            {currentQuestion.meta?.options.map((option: string) => (
              <div
                key={option}
                className="flex items-center space-x-2 p-2 hover:bg-secondary rounded-md"
              >
                <RadioGroupItem value={option} id={option} />
                <Label htmlFor={option} className="flex-grow cursor-pointer">
                  {option}
                </Label>
              </div>
            ))}
          </RadioGroup>
        )
      case 'checkbox':
        return (
          <div className="space-y-2">
            {currentQuestion.meta?.options.map((option: string) => (
              <div
                key={option}
                className="flex items-center space-x-2 p-2 hover:bg-secondary rounded-md"
              >
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
                <Label htmlFor={option} className="flex-grow cursor-pointer">
                  {option}
                </Label>
              </div>
            ))}
          </div>
        )
      case 'scale':
        setAnswer(1)
        return (
          <div className="space-y-4">
            <Slider
              min={currentQuestion.meta?.min}
              max={currentQuestion.meta?.max}
              step={1}
              value={[currentQuestion.meta?.min]}
              onValueChange={(value: any) => setAnswer(value[0])}
            />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>{currentQuestion.meta?.min}</span>
              <span>{currentQuestion.meta?.max}</span>
            </div>
          </div>
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
                <Icons.calendarIcon className="mr-2 w-4 h-4" />
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
    if (course.isOnboardingComplete) return router.visit(`/courses/${course.id}`)
  }, [course.isOnboardingComplete])

  useEffect(() => {
    if (!currentQuestion) {
      const interval = setInterval(() => {
        router.reload()
      }, 5000)

      return () => clearInterval(interval)
    }
  }, [currentQuestion])
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    try {
      setIsLoading(true)
      await axios.put(`/questions/${currentQuestion?.id}`, { answer })
      setDate(undefined)
      setAnswer(null)
      router.reload()
    } catch (error) {
      console.error('Error submitting answer:', error)
      alert('Error submitting answer. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AppLayout>
      <Layout.Header></Layout.Header>
      <Layout.Body>
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Icons.bookOpen className="w-6 h-6" />
              <h1 className="text-2xl font-bold">{course.title} Onboarding</h1>
            </CardTitle>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent>
              {currentQuestion ? (
                <div className="space-y-4">
                  <Label className="text-lg font-semibold">{currentQuestion.content}</Label>
                  {renderInput()}
                </div>
              ) : (
                <div className="space-y-4">
                  <Skeleton className="w-full h-8" />
                  <Skeleton className="w-full h-32" />
                  <Skeleton className="w-full h-8" />
                </div>
              )}
            </CardContent>
            <CardFooter>
              {currentQuestion && (
                <Button type="submit" disabled={!answer || isLoading} className="w-full">
                  {isLoading ? (
                    <Icons.loader className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Icons.arrowRight className="mr-2 h-4 w-4" />
                  )}
                  {isLoading ? 'Submitting...' : 'Next'}
                </Button>
              )}
            </CardFooter>
          </form>
        </Card>
      </Layout.Body>
    </AppLayout>
  )
}
