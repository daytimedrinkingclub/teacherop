import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import WorkflowComponent from './workflow'
import { Icons } from '@/components/icons'
const reviews = [
  {
    id: 1,
    name: 'Alice Johnson',
    role: 'Software Developer',
    content:
      'TeacherOP has revolutionized my learning process. The AI-generated courses are spot-on!',
    rating: 5,
  },
  {
    id: 2,
    name: 'Bob Smith',
    role: 'Language Enthusiast',
    content:
      'Learning Sanskrit was a breeze with TeacherOP. The universal learning approach is fantastic!',
    rating: 4,
  },
  {
    id: 3,
    name: 'Carol White',
    role: 'Neuroscience Student',
    content: 'The personalized learning path helped me grasp complex neuroscience concepts easily.',
    rating: 5,
  },
  {
    id: 4,
    name: 'David Brown',
    role: 'Sports Coach',
    content:
      "TeacherOP's custom modules have greatly improved my coaching techniques. Highly recommended!",
    rating: 3,
  },
  {
    id: 1,
    name: 'Alice Johnson',
    role: 'Software Developer',
    content:
      'TeacherOP has revolutionized my learning process. The AI-generated courses are spot-on!',
    rating: 5,
  },
  {
    id: 2,
    name: 'Bob Smith',
    role: 'Language Enthusiast',
    content:
      'Learning Sanskrit was a breeze with TeacherOP. The universal learning approach is fantastic!',
    rating: 4,
  },
  {
    id: 3,
    name: 'Carol White',
    role: 'Neuroscience Student',
    content: 'The personalized learning path helped me grasp complex neuroscience concepts easily.',
    rating: 5,
  },
  {
    id: 4,
    name: 'David Brown',
    role: 'Sports Coach',
    content:
      "TeacherOP's custom modules have greatly improved my coaching techniques. Highly recommended!",
    rating: 4,
  },
]

const faqs = [
  {
    question: 'How does TeacherOP create courses?',
    answer:
      'TeacherOP uses advanced AI to analyze your chosen topic and generate a comprehensive course structure tailored to your learning objectives.',
  },
  {
    question: 'Can I learn any subject with TeacherOP?',
    answer:
      'Yes! TeacherOP supports universal learning, allowing you to master subjects ranging from computer languages to Sanskrit, neuroscience, sports, and beyond.',
  },
  {
    question: 'How does personalized learning work?',
    answer:
      'TeacherOP adapts to your learning style and pace, providing custom questions and assessments to reinforce your understanding of the material.',
  },
  {
    question: 'Is there a limit to how many courses I can take?',
    answer:
      "There's no limit! You can take as many courses as you like, and our goal tracking feature helps you manage multiple learning objectives simultaneously.",
  },
]

export default function LandingPage() {
  const [isVideoOpen, setIsVideoOpen] = useState(false)
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const reviewsRef = useRef<any>(null)
  const [isScrolling, setIsScrolling] = useState(true)

  useEffect(() => {
    const scrollReviews = () => {
      if (reviewsRef.current && isScrolling) {
        reviewsRef.current.scrollLeft += 1
        if (
          reviewsRef.current.scrollLeft >=
          reviewsRef.current.scrollWidth - reviewsRef.current.clientWidth
        ) {
          reviewsRef.current.scrollLeft = 0
        }
      }
    }

    const reviewsInterval = setInterval(scrollReviews, 20)

    return () => {
      clearInterval(reviewsInterval)
    }
  }, [isScrolling])

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 text-center bg-gray-50">
        <h1 className="text-5xl font-bold mb-6">TeacherOP: AI Course Creation</h1>
        <p className="text-xl mb-8 text-gray-600">Universal Learning in Any Language</p>
        <div className="relative inline-block">
          <img
            src="/placeholder.svg?height=400&width=600"
            alt="TeacherOP Demo"
            className="rounded-lg shadow-lg"
          />
          <Button
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
            onClick={() => setIsVideoOpen(true)}
          >
            <Icons.play className="mr-2 h-4 w-4" /> Watch Demo
          </Button>
        </div>
      </section>

      {/* Workflow Steps */}
      <WorkflowComponent />

      {/* Reviews Section */}
      <section id="reviews" className="py-20 bg-gray-100">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center text-blue-800">What Our Users Say</h2>
          <div
            ref={reviewsRef}
            className="flex overflow-x-hidden gap-4 overflow-auto"
            onMouseEnter={() => setIsScrolling(false)}
            onMouseLeave={() => setIsScrolling(true)}
          >
            {reviews.map((review) => (
              <motion.div
                key={review.id}
                className="flex-shrink-0 w-80"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      {[...Array(review.rating)].map((_, i) => (
                        <Icons.star key={i} className="h-5 w-5  fill-current" />
                      ))}
                    </div>
                    <p className="text-gray-600 mb-4">{review.content}</p>
                    <div className="font-semibold">{review.name}</div>
                    <div className="text-sm text-gray-500">{review.role}</div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      {/* FAQs Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center text-blue-800">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <Card
                key={index}
                className="cursor-pointer"
                onClick={() => setOpenFaq(openFaq === index ? null : index)}
              >
                <CardHeader>
                  <CardTitle className="flex justify-between items-center text-lg">
                    {faq.question}
                    <Icons.chevronDown
                      className={`h-5 w-5 transition-transform ${openFaq === index ? 'transform rotate-180' : ''}`}
                    />
                  </CardTitle>
                </CardHeader>
                {openFaq === index && (
                  <CardContent>
                    <p className="text-gray-600">{faq.answer}</p>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-blue-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">TeacherOP</h3>
              <p className="text-sm">
                Revolutionizing learning with AI-powered course creation and universal learning
                capabilities.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="hover:underline">
                    Home
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:underline">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:underline">
                    Courses
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:underline">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Connect With Us</h3>
              <div className="flex space-x-4">
                <a href="#" className="hover:text-blue-300">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>
                <a href="#" className="hover:text-blue-300">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                  </svg>
                </a>
                <a href="#" className="hover:text-blue-300">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-blue-800 text-center">
            <p>&copy; 2023 TeacherOP. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
