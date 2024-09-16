import { Head, Link, router } from '@inertiajs/react'
import { useEffect, useState } from 'react'

import { Icons } from '~/lib/components/icons'
import LandingPage from '~/lib/components/landing_page'
import { buttonVariants } from '~/lib/components/ui/button'
import { cn } from '~/lib/lib/utils'

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

export default function Home() {
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

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setPlaceholderIndex((prevIndex) => (prevIndex + 1) % placeholders.length)
    router.visit('/login')
  }

  return (
    <>
      <Head title="Teacher OP" />
      {/* <title>AdonisJS {props.version} x Inertia x React</title> */}

      <div className="flex flex-col min-h-[100dvh] ">
        <header
          className={`sticky top-0 flex items-center justify-between px-4 bg-background lg:px-16 h-14`}
        >
          <Link href="#" className="flex justify-center items-center">
            <Icons.logo className="w-8 h-8" />
          </Link>

          {/* <nav className="hidden gap-4 sm:gap-6 md:flex">
            <Link
              href="#features"
              className="text-sm font-medium hover:underline underline-offset-4"
            >
              Features
            </Link>
            <Link
              href="#pricing"
              className="text-sm font-medium hover:underline underline-offset-4"
            >
              Pricing
            </Link>
            <Link
              href="#testimonials"
              className="text-sm font-medium hover:underline underline-offset-4"
            >
              Testimonials
            </Link>
            <Link href="#" className="text-sm font-medium hover:underline underline-offset-4">
              Contact
            </Link>
          </nav> */}
          <div className="flex justify-center items-center">
            <Link
              href="/login"
              className={cn(buttonVariants({ variant: 'outline' }), 'text-sm font-medium ml-4')}
            >
              Login
            </Link>
            <Link
              href="/signup"
              className={cn(buttonVariants({ variant: 'default' }), 'text-sm font-medium ml-4')}
            >
              Signup
            </Link>
          </div>
        </header>
        <LandingPage />
        {/*
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
        <footer className="py-4 footer bg-background sm:py-6">
          <div className="container px-4 mx-auto sm:px-6 lg:px-8">
            <div className="flex flex-col items-center">
              <div className="mb-4 space-x-4">
                <DropdownMenu>
                  <DropdownMenuTrigger className="text-sm underline text-foreground sm:text-base">
                    Support & Policies
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuItem asChild className="cursor-pointer">
                      <Link href="/support">Contact Us</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="cursor-pointer">
                      <Link href="/terms-of-service">Terms of Service</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="cursor-pointer">
                      <Link href="/privacy-policy">Privacy Policy</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="cursor-pointer">
                      <Link href="/refund-policy">Refund Policy</Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <p className="text-sm text-text-color sm:text-base">
                © 2024 TeacherOP. All rights reserved.
              </p>
            </div>
          </div>
        </footer> */}
      </div>
    </>
  )
}
