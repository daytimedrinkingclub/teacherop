import { InferPageProps } from '@adonisjs/inertia/types'
import axios from 'axios'
import { useEffect, useState } from 'react'

import CoursesController from '#controllers/courses_controller'

import CreateCourseModal from '~/lib/components/create_course'
import AppLayout from '~/lib/components/layout/app_layout'
import { Layout } from '~/lib/components/layout/custom_layout'
import { UserNav } from '~/lib/components/user_nav'

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

export default function CoursesCreatePage({}: InferPageProps<CoursesController, 'create'>) {
  const [displayText, setDisplayText] = useState('')
  const [placeholderIndex, setPlaceholderIndex] = useState(0)
  const [isFocused, setIsFocused] = useState(false)
  const [query, setQuery] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
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

    await axios.post('/courses', {
      query,
    })
    setIsModalOpen(true)
  }

  return (
    <AppLayout>
      <Layout.Header>
        <div className="flex justify-end items-end w-full">
          {/* <Search /> */}
          <div className="flex items-end space-x-4">
            {/* <ThemeSwitch /> */}
            <UserNav />
          </div>
        </div>
      </Layout.Header>
      <Layout.Body>
        <main className="flex flex-col flex-1 justify-center items-center">
          <div className="container flex flex-col justify-center items-center px-4 mx-auto h-full sm:px-6 lg:px-8">
            <h1 className="mb-8 text-3xl font-bold text-center sm:text-4xl lg:text-5xl text-primary">
              TeacherOP
            </h1>
            <div className="relative w-full max-w-lg">
              <form onSubmit={handleSubmit} className="relative w-full max-w-lg">
                <div className="relative">
                  <input
                    type="text"
                    className="px-4 py-3 pr-12 w-full text-lg rounded-md border border-gray-300 transition duration-300 ease-in-out sm:py-4 focus:outline-none focus:ring-2 focus:ring-accent sm:text-xl"
                    placeholder={displayText}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                  />
                  <button type="submit" className="absolute top-0 right-0 mt-3 mr-4 sm:mt-4">
                    <svg
                      className="w-6 h-6 text-gray-600"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </main>
        <CreateCourseModal isOpen={isModalOpen} setIsOpen={setIsModalOpen} data={query} />
      </Layout.Body>
    </AppLayout>
  )
}
