import React from 'react'
import { Link, useForm } from '@inertiajs/react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Icons } from '@/components/icons'
import { ArrowLeft } from "lucide-react"
import useError from '@/hooks/use_error'
import { cn } from '@/lib/utils'

interface LoginFormProps extends React.HTMLAttributes<HTMLDivElement> { }

export default function LoginForm({ className, ...props }: LoginFormProps) {
    const form = useForm({
        email: '',
        password: '',
    })

    const handleSignup = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        form.post('/auth/login')
    }
    const errors = useError()

    return (
        <div className="container mx-auto flex flex-col min-h-screen bg-white text-black p-4">
            <header className="flex justify-between items-center mb-8">
                <Link href="/" className="inline-flex items-center">
                    <Button variant="ghost" className="text-black hover:bg-transparent hover:text-black">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back
                    </Button>
                </Link>

                <div className="flex items-center gap-2">
                    <div className="text-xl font-semibold">TeacherOP</div>
                    <Icons.logo className="w-20 h-20 stroke-black" />
                </div>
            </header>
            <main className="mx-auto items-center flex-grow flex md:mt-12 flex-col">
                <div className={cn('w-full max-w-7xl space-y-6', className)} {...props}>
                    <h1 className="text-4xl md:text-9xl font-bold mb-2 w-full">Welcome back.</h1>
                    <p className="text-lg px-4 md:text-xl mb-6 font-semibold">
                        It's always good to see you back :)
                        <br />
                        Happy Learning
                    </p>
                    <form onSubmit={handleSignup} className="space-y-4 px-4  max-w-md">
                        <div className="grid gap-1">
                            <Label htmlFor="email" className="sr-only">
                                Email
                            </Label>
                            <Input
                                id="email"
                                placeholder="name@gmail.com"
                                type="email"
                                autoCapitalize="none"
                                autoComplete="email"
                                autoCorrect="off"
                                value={form.data.email}
                                onChange={(e) => form.setData('email', e.target.value)}
                                className="w-ful"
                            />
                            {errors?.email && <p className="px-1 text-xs text-red-600">{errors.email}</p>}
                        </div>
                        <div className="grid gap-1">
                            <Label htmlFor="password" className="sr-only">
                                Password
                            </Label>
                            <Input
                                id="password"
                                placeholder="********"
                                type="password"
                                autoCapitalize="none"
                                value={form.data.password}
                                onChange={(e) => form.setData('password', e.target.value)}
                                className="w-full"
                            />
                            {errors?.password && <p className="px-1 text-xs text-red-600">{errors.password}</p>}
                        </div>
                        <Button
                            className="w-full rounded-full"
                            disabled={form.processing}
                        >
                            {form.processing && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
                            Login
                        </Button>
                        {errors?.auth && <p className="px-1 text-xs text-red-600">{errors.auth}</p>}
                    </form>
                    <p className="text-sm px-4 ">
                        Don't have an account?{" "}
                        <Link href="/signup" className="text-blue-600 hover:underline">
                            Create one now
                        </Link>
                    </p>
                </div>
            </main>
        </div>
    )
}