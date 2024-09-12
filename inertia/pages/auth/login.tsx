// import AuthForm from '@/components/auth_form'
import { Icons } from '@/components/icons'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Link } from '@inertiajs/react'
import LoginForm from '~/lib/components/login_form'

export default function LoginPage() {
  return (
    <>
      <div className="container flex flex-col items-center justify-center w-screen h-screen">
        <Link
          href="/"
          className={cn(
            buttonVariants({ variant: 'ghost' }),
            'absolute left-4 top-4 md:left-8 md:top-8'
          )}
        >
          <>
            <Icons.chevronLeft className="w-4 h-4 mr-2" />
            Back
          </>
        </Link>
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
            <p className="text-sm text-muted-foreground">
              Enter your email to sign in to your account
            </p>
          </div>
          <LoginForm />
          <p className="px-8 text-sm text-center text-muted-foreground">
            <Link href="/signup" className="underline hover:text-brand underline-offset-4">
              Don&apos;t have an account? Sign Up
            </Link>
          </p>
        </div>
      </div>
    </>
  )
}
