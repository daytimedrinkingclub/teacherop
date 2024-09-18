import { InferPageProps } from '@adonisjs/inertia/types'
import { router } from '@inertiajs/react'
import axios from 'axios'
import { useState } from 'react'

import CoursesController from '#controllers/courses_controller'

import AppLayout from '~/lib/components/layout/app_layout'
import { Layout } from '~/lib/components/layout/custom_layout'
import { Button } from '~/lib/components/ui/button'
import { Icons } from '~/lib/components/icons'
import TypewriterInput from '~/lib/components/typewriterInput'

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

export default function CoursesCreatePage(props: InferPageProps<CoursesController, 'create'>) {
  const { user } = props as any
  const [query, setQuery] = useState('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const { data } = await axios.post('/courses', {
      query,
    })
    router.visit(`/courses/${data.course.id}/onboarding`)
  }

  return (
    <AppLayout>
      <Layout.Header>
      </Layout.Header>
      <Layout.Body>
        <div className="container flex flex-col max-w-md text-center items-center justify-center md:mx-64 md:my-16">
          <h1 className="text-4xl md:text-6xl font-bold mb-2 px-2 break-words">
            Hi{' '}
            <span className={`${user.fullName.length > 10 ? 'block mt-2' : 'inline'}`}>
              {user.fullName}!
            </span>
          </h1>
          <p className="text-xl mb-6 font-semibold">What would you like to learn today?</p>
          <form onSubmit={handleSubmit} className="relative w-full max-w-md">
            <TypewriterInput placeholders={placeholders} typingSpeed={100} delay={2000} query={query} setQuery={setQuery} />
            <Button
              type="submit"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-transparent hover:bg-transparent"
            >
              <Icons.search className="h-5 w-5 text-gray-500" />
              <span className="sr-only">Search</span>
            </Button>
          </form>
          <p className="mt-12 md:mt-40 text-center font-semibold max-w-md md:translate-y-full md:translate-x-full">
            Our AI will generate a personalized course for you. Learn anything in any language at
            your own pace!
          </p>
        </div>
      </Layout.Body>
    </AppLayout>
  )
}

