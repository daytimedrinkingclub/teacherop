import axios from 'axios'
import { useEffect, useState } from 'react'

import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Slider } from '@/components/ui/slider'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import { CalendarIcon } from 'lucide-react'

import { router } from '@inertiajs/react'
import { transmit } from '~/lib/lib/utils'

const subscription = transmit.subscription('onboard_course')

let stopListening: () => void

subscription.create().then()

export default function CreateCourseModal({
  isOpen,
  setIsOpen,
  data,
}: {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
  data?: any
}) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState(
    'Please answer the following questions to help us create your course.'
  )
  const [currentQuestion, setCurrentQuestion] = useState<any>(null)
  const [answer, setAnswer] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [date, setDate] = useState<Date>()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    axios.get('/questions/current').then((res) => {
      setCurrentQuestion(res.data.question)
      if (res.data.question) setIsLoading(false)
    })
  }, [data, isOpen])

  useEffect(() => {
    stopListening = subscription.onMessage((data: any) => {
      console.log('data received', data)
      if (data.question) {
        setCurrentQuestion(data.question)
        setAnswer(null)
      }
      if (data.planSummary) {
        setTitle(data.planSummary.title)
        setCurrentQuestion(null)
        setIsLoading(false)
        setDescription('Thank you for answering all the questions. Your course is being prepared.')
        setIsLoading(false)
        setTimeout(() => {
          setIsOpen(false)
          router.visit(`/courses/${data.planSummary.courseId}`)
        }, 5000)
      } else if (data.course) {
        setTitle(data.course.title)
        setCurrentQuestion(null)
        setIsLoading(false)
        setTimeout(() => {
          setIsOpen(false)
          router.visit(`/courses/${data.course.id}`)
        }, 5000)
      } else if (data.error) {
        setError(data.error)
        setIsLoading(false)
        setCurrentQuestion(null)
        setDescription('')
      }
      setIsLoading(false)
    })

    return () => {
      stopListening()
    }
  }, [])

  const handleSubmit = async () => {
    setIsLoading(true)
    await axios.put(`/questions/${currentQuestion.id}`, {
      answer,
    })
  }

  const renderInput = () => {
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
            {currentQuestion.meta.options.map((option: string) => (
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
            {currentQuestion.meta.options.map((option: string) => (
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
            min={currentQuestion.meta.min}
            max={currentQuestion.meta.max}
            step={1}
            value={[answer || currentQuestion.meta.min]}
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
                <CalendarIcon className="w-4 h-4 mr-2" />
                {date ? format(date, 'PPP') : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
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

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open)
        // clear all the states
        setTitle('')
        setDescription('')
        setCurrentQuestion(null)
        setAnswer(null)
        setError(null)
        setIsLoading(false)
        if (!open) router.reload()
      }}
    >
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        {currentQuestion && (
          <div className="grid gap-4 py-4">
            <Label className="text-lg font-semibold">{currentQuestion.content}</Label>
            {renderInput()}
            <Button onClick={handleSubmit} disabled={answer === null || isLoading}>
              Next
            </Button>
          </div>
        )}
        {!currentQuestion && !isLoading && (
          <div className="py-4">
            {error ? (
              <p className="text-red-500">{error}</p>
            ) : (
              <p>
                Thank you for answering all the questions. Your course is being prepared.
                Redirecting you to the course...
              </p>
            )}
          </div>
        )}
        {isLoading && <p>Loading...</p>}
      </DialogContent>
    </Dialog>
  )
}
