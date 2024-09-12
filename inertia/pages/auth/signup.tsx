import { Button, buttonVariants } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { Link } from '@inertiajs/react'
import { ArrowLeft, LogIn } from 'lucide-react'
import SignUpAuthForm from '~/lib/components/signup_form'

export default function SignupPage() {
  return (
    <div className="container flex items-center justify-center min-h-screen px-4 py-12">
      <Link
        href="/login"
        className={cn(
          buttonVariants({ variant: 'ghost' }),
          'absolute left-4 top-4 md:left-8 md:top-8'
        )}
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Login
      </Link>
      <Card className="w-full max-w-lg">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
              <LogIn className="w-6 h-6 text-primary-foreground" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-center">Create an account</CardTitle>
          <p className="text-sm text-center text-muted-foreground">
            Enter your details below to create your account
          </p>
        </CardHeader>
        <CardContent>
          <SignUpAuthForm />
        </CardContent>
        <CardFooter>
          <p className="px-8 text-sm text-center text-muted-foreground">
            By clicking continue, you agree to our{' '}
            <Link href="/terms" className="underline hover:text-primary underline-offset-4">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link href="/privacy" className="underline hover:text-primary underline-offset-4">
              Privacy Policy
            </Link>
            .
          </p>
        </CardFooter>
      </Card>
      <Button
        variant="ghost"
        className="absolute right-4 top-4 md:right-8 md:top-8"
        asChild
      >
        <Link href="/login">
          Login
        </Link>
      </Button>
    </div>
  )
}