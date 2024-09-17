import { InferPageProps } from '@adonisjs/inertia/types'
import { router } from '@inertiajs/react'
import axios from 'axios'
import { useEffect, useState } from 'react'

import CoursesController from '#controllers/courses_controller'

import AppLayout from '~/lib/components/layout/app_layout'
import { Layout } from '~/lib/components/layout/custom_layout'
import { UserNav } from '~/lib/components/user_nav'
import { Button } from '~/lib/components/ui/button'
import { Icons } from '~/lib/components/icons'
import { Input } from '~/lib/components/ui/input'

const placeholders = [
  'What do you want to learn today?',
  'I want to learn how to code...',
  'I want to cook lasagna...',
  'I want to learn to play the piano...',
  'I want to to crack the Amazon SDE 1 interview...',
  'I want to learn to spanish...',
  'I want to get 2400/2400 in my SAT...',
  'I want to get into IIT...',
  'I want to learn training a dog...',
]

export default function CoursesCreatePage({ user }: InferPageProps<CoursesController, 'create'>) {

  const [displayText, setDisplayText] = useState('')
  const [placeholderIndex, setPlaceholderIndex] = useState(0)
  const [isFocused, setIsFocused] = useState(false)
  const [query, setQuery] = useState('')
  useEffect(() => {
    if (isFocused) return

    const placeholder = placeholders[placeholderIndex]
    let currentIndex = 0

    const typingInterval = setInterval(() => {
      setDisplayText(placeholder.slice(0, currentIndex))
      currentIndex++

      if (currentIndex > placeholder.length) {
        clearInterval(typingInterval)
      }
    }, 75)

    return () => clearInterval(typingInterval)
  }, [placeholderIndex, isFocused])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setPlaceholderIndex((prevIndex) => (prevIndex + 1) % placeholders.length)

    const { data } = await axios.post('/courses', {
      query,
    })
    router.visit(`/courses/${data.course.id}/onboarding`)
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
        <div className="container flex flex-col max-w-md text-center items-center justify-center md:mx-72 md:my-20">
          <h1 className="text-4xl md:text-8xl font-bold mb-2 px-2">Hi {user.fullName}</h1>
          <p className="text-xl mb-6 font-semibold">What would you like to learn today?</p>
          <form onSubmit={handleSubmit} className="relative w-full max-w-md">
            <Input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              className="w-full pl-4 pr-10 py-2 text-lg"
              placeholder={displayText}
            />
            <Button
              type="submit"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-transparent hover:bg-transparent"
            >
              <Icons.search className="h-5 w-5 text-gray-500" />
              <span className="sr-only">Search</span>
            </Button>
          </form>
          <p className="mt-12 md:mt-40 text-center font-semibold max-w-md md:translate-y-full md:translate-x-full">
            Our AI will generate a personalized course for you.
            Learn anything in any language at your own pace!
          </p>
        </div>
      </Layout.Body>
    </AppLayout>
  )
}
