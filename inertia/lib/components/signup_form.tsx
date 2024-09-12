import { useForm } from '@inertiajs/react'
import React from 'react'

import { Icons } from '@/components/icons'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import useError from '@/hooks/use_error'
import { cn } from '@/lib/utils'
import { Gender } from '#enums/gender'
import { Qualification } from '#enums/qualification'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface SignUpAuthFormProps extends React.HTMLAttributes<HTMLDivElement> { }

interface SignupFormData {
  fullName: string
  email: string
  password: string
  age: number
  gender: Gender
  qualification: Qualification
}

export default function SignUpAuthForm({ className, ...props }: SignUpAuthFormProps) {
  const form = useForm<SignupFormData>({
    fullName: '',
    email: '',
    password: '',
    age: 0,
    gender: Gender.MALE,
    qualification: Qualification.BACHELOR,
  })

  const handleSignup = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    form.post(`/auth/signup`)
  }
  const errors = useError()

  return (
    <div className={cn('grid gap-6', className)} {...props}>
      <form onSubmit={handleSignup}>
        <div className="grid gap-8 md:grid-cols-2">
          <div className="grid gap-1">
            <Label htmlFor="fullname">Name</Label>
            <Input
              id="fullname"
              placeholder="FullName"
              type="text"
              autoCapitalize="none"
              autoCorrect="off"
              value={form.data.fullName}
              onChange={(e) => form.setData('fullName', e.target.value)}
            />
            {errors?.fullname && <p className="px-1 text-xs text-red-600">{errors.fullname}</p>}
          </div>
          <div className="grid gap-1">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              placeholder="name@example.com"
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
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              placeholder="*********"
              type="password"
              autoCapitalize="none"
              value={form.data.password}
              onChange={(e) => form.setData('password', e.target.value)}
            />
            {errors?.password && <p className="px-1 text-red-600">{errors.password}</p>}
          </div>
          <div className="grid gap-1">
            <Label htmlFor="age">Age</Label>
            <Input
              id="age"
              placeholder="20"
              type="number"
              autoCapitalize="none"
              autoCorrect="off"
              value={form.data.age}
              onChange={(e) => form.setData('age', +e.target.value)}
            />
            {errors?.age && <p className="px-1 text-xs text-red-600">{errors.age}</p>}
          </div>
          <div className="grid gap-1">
            <Label htmlFor="gender">Gender</Label>
            <Select
              value={form.data.gender}
              onValueChange={(value: Gender) => form.setData('gender', value as Gender)}
            >
              <SelectTrigger id="gender">
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={Gender.MALE}>Male</SelectItem>
                <SelectItem value={Gender.FEMALE}>Female</SelectItem>
                <SelectItem value={Gender.OTHER}>Other</SelectItem>
              </SelectContent>
            </Select>
            {errors?.gender && <p className="px-1 text-xs text-red-600">{errors.gender}</p>}
          </div>
          <div className="grid gap-1">
            <Label htmlFor="qualification">Qualification</Label>
            <Select
              value={form.data.qualification}
              onValueChange={(value: Qualification) => form.setData('qualification', value as Qualification)}
            >
              <SelectTrigger id="qualification">
                <SelectValue placeholder="Select qualification" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={Qualification.BACHELOR}>BACHELOR</SelectItem>
                <SelectItem value={Qualification.DOCTORATE}>DOCTORATE</SelectItem>
                <SelectItem value={Qualification.HIGH_SCHOOL}>HIGH_SCHOOL</SelectItem>
                <SelectItem value={Qualification.MASTER}>MASTER</SelectItem>
              </SelectContent>
            </Select>
            {errors?.qualification && (
              <p className="px-1 text-xs text-red-600">{errors.qualification}</p>
            )}
          </div>
          <Button className="col-span-full" disabled={form.processing}>
            {form.processing && <Icons.spinner />}
            Sign up
          </Button>
          {errors?.auth && <p className="px-1 text-red-600">{errors.auth}</p>}
        </div>
      </form>
    </div>
  )
}
