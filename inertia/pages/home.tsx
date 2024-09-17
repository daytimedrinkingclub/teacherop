import { Head, Link } from '@inertiajs/react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Button } from '~/lib/components/ui/button'
import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Icons } from '~/lib/components/icons'
import { Input } from '~/lib/components/ui/input'
import { TypeAnimation } from 'react-type-animation';

const Header = () => (
  <header className='container mx-auto fixed bg-white z-50 top-0 left-0 right-0 flex justify-between items-center'>
    <div className='flex gap-10 font-semibold md:text-2xl text-xl'>
      <Link href="/about">About</Link>
      <Link href="/login">Login</Link>
    </div>
    <div>
      {/* <img src="/public/images/logo.png" alt="Logo" className="h-20 w-20 md:h-24 md:w-24" width={80} height={80} /> */}
      {/* <img src="https://res.cloudinary.com/ajitpatil/image/upload/v1726496203/teacherop/vc171uq8cpcdqq8m2cka.png" alt="Logo" className="h-20 w-20 md:h-24 md:w-24" width={80} height={80} /> */}
      {Icons.logo && <Icons.logo className="h-20 w-20 md:h-24 md:w-24" />}
    </div>
  </header>
)

const Hero = () => (
  <section className='container mx-auto px-6 py-4 my-[30px] relative '>
    <div className='flex flex-col gap-2 z-10'>
      <h1 className='font-albert-sans text-5xl md:text-8xl font-bold'>TeacherOP.</h1>
      <TypeAnimation
        sequence={[
          'Your course. Your pace. Your payday.',
          1000,
          '',
          100,
        ]}
        wrapper="p"
        speed={50}
        style={{ fontSize: '1.25rem', lineHeight: '1.75rem', padding: '0 0.5rem', marginBottom: '0.5rem' }}
        repeat={Infinity}
      />
      <div className='p-2 md:px-4 md:py-6'>
        <Button className='px-10 py-6 rounded-lg'>Get Started</Button>
      </div>
    </div>
    <div className='flex items-center justify-center py-8 md:px-44 md:py-0 md:-translate-y-10 md:translate-x-20 h-[300px] md:h-[400px] '>
      {/* <img
        src="/public/images/hero.png"
        alt="Hero Image"
        className="h-[300px] md:h-[400px] w-auto"
        width={1024}
        height={576}
      /> */}

      {Icons.heroImg && <Icons.heroImg className="h-[300px] md:h-[400px] w-auto" />}
    </div>
  </section>
)

// const Hero2 = () => (
//   <section className='container mx-auto px-6 py-4 my-[30px] relative'>
//     <div className='flex flex-col md:flex-row items-center justify-between'>
//       <div className='flex flex-col gap-2 z-10 md:w-1/2'>
//         <h1 className='text-5xl md:text-8xl font-bold'>Teacher OP</h1>
//         <p className='text-xl px-2 md:px-0'>Your course. Your pace. Your payday.</p>
//         <div className='p-2 md:px-0 md:py-6'>
//           <Button className='px-10 py-6 rounded-lg'>Get Started</Button>
//         </div>
//       </div>
//       <div className='md:w-1/2 flex justify-center items-center mt-8 md:mt-0'>
//         <img
//           src="/public/images/hero.png"
//           alt="Hero Image"
//           className="h-[300px] md:h-[400px] w-auto"
//           width={1024}
//           height={576}
//         />
//       </div>
//     </div>
//   </section>
// )

const HowItWorks = ({ steps }: { steps: string[] }) => (
  <section className='container mx-auto flex flex-col md:flex-row justify-center px-10 md:p-4 my-[10px] gap-8 md:gap-36'>
    <div>
      <p className='text-4xl md:text-6xl font-bold'>How does <br /> it work?</p>
    </div>
    <div className='flex flex-col gap-4'>
      {steps.map((step, index) => (
        <div key={index} className='flex flex-col gap-2'>
          <h3 className='text-4xl font-semibold'>Step {index + 1}: </h3>
          <p>{step}</p>
        </div>
      ))}
    </div>
  </section>
)

const LearnAnything = () => {
  const images = [
    "https://res.cloudinary.com/ajitpatil/image/upload/v1726496174/teacherop/x5he8lanymfmj2fqlpgr.png",
    "https://res.cloudinary.com/ajitpatil/image/upload/v1726554491/teacherop/Property_1_Variant4_u5sstx.png",
    "https://res.cloudinary.com/ajitpatil/image/upload/v1726554472/teacherop/Property_1_41206225-young-woman-dancing-street-dance_1_yho439.svg"
  ]
  const [currentIndex, setCurrentIndex] = useAutoScroll(images.length, 1800)
  const [isTransitioning, setIsTransitioning] = useState(false)

  const goToSlide = useCallback((index: number) => {
    if (!isTransitioning) {
      setIsTransitioning(true)
      setCurrentIndex(index)
      setTimeout(() => setIsTransitioning(false), 1000)
    }
  }, [isTransitioning, setCurrentIndex])

  const goToPrevious = () => {
    goToSlide((currentIndex - 1 + images.length) % images.length)
  }

  const goToNext = () => {
    goToSlide((currentIndex + 1) % images.length)
  }

  return (
    <section className='container mx-auto flex flex-col md:flex-row items-center p-4 md:p-16 md:px-24'>
      <div className='mb-8 md:mb-0'>
        {/* <img
        src="/public/images/img1.png"
        alt="Skills inspiration"
        className="h-[300px] md:h-[400px] w-full md:w-auto object-cover rounded-lg shadow-lg"
        width={1024}
        height={576}
      /> */}
        <div className="relative w-full max-w-2xl mx-auto overflow-hidden">
          <div
            className="flex transition-transform duration-1000 ease-out"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {images.map((src, index) => (
              <img key={index} src={src}
                alt={`Slide ${index + 1}`}
                className="w-full h-auto flex-shrink-0"
              />
            ))}
          </div>
          <button
            onClick={goToPrevious}
            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full"
            aria-label="Previous slide"
          >
            <Icons.ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full"
            aria-label="Next slide"
          >
            <Icons.ChevronRight className="w-6 h-6" />
          </button>
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-colors duration-300 ${index === currentIndex ? "bg-white" : "bg-gray-400"
                  }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
      <div className='text-center p-4 md:p-0 md:text-left md:pl-24'>
        <h2 className='text-4xl md:text-5xl font-bold mb-4'>
          <span className='whitespace-nowrap'>Learn anything,</span>
          <br className='md:hidden' />
          Anytime,
          <br />
          <span className='whitespace-nowrap'>In any Language.</span>
        </h2>
        <p className='text-lg text-gray-600'>(These are just random stock images for skills inspiration.)</p>
      </div>
    </section>
  )
}

const useAutoScroll = (length: number, interval: number) => {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % length)
    }, interval)

    return () => clearInterval(timer)
  }, [length, interval])

  return [index, setIndex] as const
}

const Reviews = ({ reviews, reviewsRef, setIsScrolling }: { reviews: any[], reviewsRef: React.RefObject<HTMLDivElement>, setIsScrolling: (isScrolling: boolean) => void }) => (
  <section id="reviews" className="py-20">
    <div className="container mx-auto px-4">
      <h2 className="text-3xl font-bold mb-12 text-center">See What All the Buzz is About 🐝</h2>
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
)

const Footer = () => (
  <footer className="bg-black text-white p-8">
    <div className="max-w-7xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">TeacherOP</h2>
      <div className="flex justify-between items-start">
        <div>
          <p className="mb-2">Email:</p>
          <p className="text-sm mb-4">Sign up and we'll let you know first when we do anything.</p>
          <div className="flex gap-4">
            <Input
              type="email"
              placeholder="Email Address"
              className="mr-2v bg-black"
            />
            <Button variant="outline">
              <Icons.arrowRight className='h-6 w-6 text-black' />
            </Button>
          </div>
        </div>
        <div>
          <p className="mb-2">Connect with Us:</p>
          <div className="flex gap-4">
            <Icons.facebook className="w-6 h-6" />
            <Icons.instagram className="w-6 h-6" />
            <Icons.twitter className="w-6 h-6" />
          </div>
        </div>
      </div>
      <p className="text-sm mt-8 text-center">©2024 teacherop</p>
    </div>
  </footer>
)

export default function Home() {
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

  const steps = [
    "Register your details, set up your bank account, and you're ready to go.",
    "Pick up anything—from programming to art and learn at your own pace.",
    "Complete courses, answer questions, and get your reward right in your bank."
  ]

  return (
    <>
      <Head title="Teacher OP" />
      <Header />
      <div className='h-16'></div>
      <Hero />
      {/* <Hero2 /> */}
      <HowItWorks steps={steps} />
      <LearnAnything />
      <Reviews reviews={reviews} reviewsRef={reviewsRef} setIsScrolling={setIsScrolling} />
      <Footer />
    </>
  )
}

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