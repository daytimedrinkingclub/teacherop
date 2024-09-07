import { useForm } from '@inertiajs/react'
import React from 'react'

import { Icons } from '@/components/icons'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import useError from '@/hooks/use_error'
import { cn } from '@/lib/utils'

interface AuthFormProps extends React.HTMLAttributes<HTMLDivElement> {
  auth: 'Login' | 'Sign up'
}

export default function AuthForm({ className, auth, ...props }: AuthFormProps) {
  const form = useForm({
    email: '',
    password: '',
  })

  const handleSignup = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const postURL = auth === 'Login' ? '/auth/login' : '/auth/signup'
    form.post(postURL)
  }
  const errors = useError()

  return (
    <div className={cn('grid gap-6', className)} {...props}>
      <form onSubmit={handleSignup}>
        <div className="grid gap-2">
          <div className="grid gap-1">
            <Label className="sr-only" htmlFor="email">
              Email
            </Label>
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
            <Label className="sr-only" htmlFor="password">
              Password
            </Label>
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

          <Button disabled={form.processing}>
            {form.processing && <Icons.spinner />}
            {auth}
          </Button>
          {errors?.auth && <p className="px-1 text-red-600">{errors.auth}</p>}
        </div>
      </form>
    </div>
  )
}
