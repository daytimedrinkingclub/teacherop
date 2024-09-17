import React from 'react'
import { useForm } from '@inertiajs/react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Icons } from '@/components/icons'
import { ArrowLeft } from "lucide-react"
import useError from '@/hooks/use_error'
import { cn } from '@/lib/utils'
import { GenderEnum } from '#enums/gender'
import { QualificationEnum } from '#enums/qualification'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Link } from '@inertiajs/react'

interface SignUpAuthFormProps extends React.HTMLAttributes<HTMLDivElement> { }

interface SignupFormData {
  fullName: string
  email: string
  password: string
  age: number | undefined
  gender: GenderEnum
  qualification: QualificationEnum
}

export default function SignupForm({ className, ...props }: SignUpAuthFormProps) {
  const form = useForm<SignupFormData>({
    fullName: '',
    email: '',
    password: '',
    age: undefined,
    gender: GenderEnum.MALE,
    qualification: QualificationEnum.BACHELOR,
  })

  const handleSignup = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    form.post(`/auth/signup`)
  }
  const errors = useError()

  return (
    <div className="flex flex-col min-h-screen bg-white text-black p-4">
      <header className="flex justify-between items-center mb-8">
        <Link href="/" className="text-black hover:bg-transparent hover:text-black">
          <Button variant="ghost" className="text-black hover:bg-transparent hover:text-black">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </Link>

        <div className="flex items-center gap-2">
          <div className="text-xl font-semibold">TeacherOP</div>
          <Icons.logo className="w-10 h-10 stroke-black" />
        </div>
      </header>
      <main className="container m-auto flex-grow flex flex-col">
        <div className={cn('w-full max-w-2xl space-y-6', className)} {...props}>
          <h1 className="text-4xl md:text-7xl font-bold mb-2">Join us.</h1>
          <p className="text-lg mb-6 font-semibold">
            Learners earned loads of rewards this week for their hard work.
            <br />
            You're just 2 steps away from unlocking your first reward!
          </p>
          <form onSubmit={handleSignup} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="grid gap-1">
                <Label htmlFor="fullName">Full Name:</Label>
                <Input
                  id="fullName"
                  placeholder="Alice Smith"
                  type="text"
                  autoCapitalize="none"
                  autoCorrect="off"
                  value={form.data.fullName}
                  onChange={(e) => form.setData('fullName', e.target.value)}
                />
                {errors?.fullname && <p className="px-1 text-xs text-red-600">{errors.fullname}</p>}
              </div>
              <div className="grid gap-1">
                <Label htmlFor="email">Email:</Label>
                <Input
                  id="email"
                  placeholder="name@gmail.com"
                  type="email"
                  autoCapitalize="none"
                  autoComplete="email"
                  autoCorrect="off"
                  value={form.data.email}
                  onChange={(e) => form.setData('email', e.target.value)}
                />
                {errors?.email && <p className="px-1 text-xs text-red-600">{errors.email}</p>}
              </div>
              <div className="grid gap-1">
                <Label htmlFor="age">Age:</Label>
                <Input
                  id="age"
                  placeholder="0"
                  type="number"
                  autoCapitalize="none"
                  autoCorrect="off"
                  value={form.data.age}
                  onChange={(e) => form.setData('age', +e.target.value)}
                />
                {errors?.age && <p className="px-1 text-xs text-red-600">{errors.age}</p>}
              </div>
              <div className="grid gap-1">
                <Label htmlFor="password">Password:</Label>
                <Input
                  id="password"
                  placeholder="********"
                  type="password"
                  autoCapitalize="none"
                  value={form.data.password}
                  onChange={(e) => form.setData('password', e.target.value)}
                />
                {errors?.password && <p className="px-1 text-xs text-red-600">{errors.password}</p>}
              </div>
              <div className="grid gap-1">
                <Label htmlFor="gender">Gender:</Label>
                <Select
                  value={form.data.gender}
                  onValueChange={(value: GenderEnum) => form.setData('gender', value as GenderEnum)}
                >
                  <SelectTrigger id="gender">
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={GenderEnum.MALE}>Male</SelectItem>
                    <SelectItem value={GenderEnum.FEMALE}>Female</SelectItem>
                    <SelectItem value={GenderEnum.OTHER}>Other</SelectItem>
                  </SelectContent>
                </Select>
                {errors?.gender && <p className="px-1 text-xs text-red-600">{errors.gender}</p>}
              </div>
              <div className="grid gap-1">
                <Label htmlFor="qualification">Qualification:</Label>
                <Select
                  value={form.data.qualification}
                  onValueChange={(value: QualificationEnum) =>
                    form.setData('qualification', value as QualificationEnum)
                  }
                >
                  <SelectTrigger id="qualification">
                    <SelectValue placeholder="Select qualification" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={QualificationEnum.BACHELOR}>Bachelors</SelectItem>
                    <SelectItem value={QualificationEnum.DOCTORATE}>Doctorate</SelectItem>
                    <SelectItem value={QualificationEnum.HIGH_SCHOOL}>High School</SelectItem>
                    <SelectItem value={QualificationEnum.MASTER}>Master</SelectItem>
                  </SelectContent>
                </Select>
                {errors?.qualification && (
                  <p className="px-1 text-xs text-red-600">{errors.qualification}</p>
                )}
              </div>
            </div>
            <Button className="w-full bg-black text-white hover:bg-gray-800" disabled={form.processing}>
              {form.processing && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
              Let's go
            </Button>
            {errors?.auth && <p className="px-1 text-xs text-red-600">{errors.auth}</p>}
          </form>
          <p className="text-xs text-center">
            By clicking continue, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </main>
    </div>
  )
}