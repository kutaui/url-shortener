'use client'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { LoginRequest, RegisterRequest } from '@/controllers/UserController'
import { cn } from '@/lib/utils'
import { useMutation } from '@tanstack/react-query'
import { setCookie } from 'cookies-next'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useContext } from 'react'
import { AuthContext } from './Providers'
import { useToast } from './ui/use-toast'

export function AuthForm({ login }: { login?: boolean }) {
	const { toast } = useToast()
	const router = useRouter()
	const { setUser, user } = useContext(AuthContext)
	const loginMutation = useMutation({
		mutationFn: LoginRequest,
		onSuccess: (response) => {
			toast({
				title: 'Success',
				description: 'Logged in successfully',
				variant: 'success',
			})
			setCookie('USER', JSON.stringify(response.data.user))
			setUser(response.data.user)
			//	router.push('/dashboard')
		},
		onError: (error) => {
			const errorMessage = error.response.data || 'Something went wrong'
			toast({
				title: 'Error',
				description: errorMessage,
				variant: 'destructive',
			})
		},
	})
	const registerMutation = useMutation({
		mutationFn: RegisterRequest,
		onSuccess: (response) => {
			toast({
				title: 'Success',
				description: 'Registered successfully',
				variant: 'success',
			})
			setCookie('USER', JSON.stringify(response.data.user))
			setUser(response.data.user)
			//	router.push('/dashboard')
		},
		onError: (error) => {
			const errorMessage = error.response.data || 'Something went wrong'
			toast({
				title: 'Error',
				description: errorMessage,
				variant: 'destructive',
			})
		},
	})

	const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()

		const formData = new FormData(e.target)
		const email = formData.get('email') as string
		const password = formData.get('password') as string

		const userLoginData: UserLoginType = { email, password }
		loginMutation.mutate(userLoginData)
	}

	const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()

		const formData = new FormData(e.target)
		const name = formData.get('name') as string
		const email = formData.get('email') as string
		const password = formData.get('password') as string

		const userRegisterData: UserRegisterType = { name, email, password }
		registerMutation.mutate(userRegisterData)
	}

	return (
		<div className="max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-white dark:bg-black">
			<h2 className="font-bold text-xl text-neutral-800 dark:text-neutral-200">
				{login ? 'Welcome Back' : 'Welcome to Shortie'}
			</h2>
			<p className="text-neutral-600 text-sm max-w-sm mt-2 dark:text-neutral-300">
				{login ? 'Sign in to your account' : 'Sign up to get started'}
			</p>

			<form className="my-8" onSubmit={login ? handleLogin : handleRegister}>
				<LabelInputContainer className={`mb-4 ${login ? 'hidden' : 'block'}`}>
					<Label htmlFor="firstname">Name</Label>
					<Input
						name="firstname"
						id="firstname"
						placeholder="Jotaro Kujo"
						type="text"
					/>
				</LabelInputContainer>

				<LabelInputContainer className="mb-4">
					<Label htmlFor="email">Email Address</Label>
					<Input
						name="email"
						id="email"
						placeholder="hi@kutaybekleric.com"
						type="email"
					/>
				</LabelInputContainer>
				<LabelInputContainer className="mb-4">
					<Label htmlFor="password">Password</Label>
					<Input
						name="password"
						id="password"
						placeholder="••••••••"
						type="password"
					/>
				</LabelInputContainer>

				<button
					className="bg-primary relative group/btn block  w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
					type="submit"
				>
					{login ? 'Sign in' : 'Sign up'}
					<BottomGradient />
				</button>
			</form>
			{login ? (
				<p>
					Don't have an Account ?
					<Link
						href="/register"
						className="text-primary font-semibold underline ml-1"
					>
						Sign Up
					</Link>
				</p>
			) : (
				<p>
					Have an Account ?
					<Link
						href="/login"
						className="text-primary font-semibold underline ml-1"
					>
						Sign In
					</Link>
				</p>
			)}
		</div>
	)
}

const BottomGradient = () => {
	return (
		<>
			<span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-orange-500 to-transparent" />
			<span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-orange-500 to-transparent" />
		</>
	)
}

const LabelInputContainer = ({
	children,
	className,
}: {
	children: React.ReactNode
	className?: string
}) => {
	return (
		<div className={cn('flex flex-col space-y-2 w-full', className)}>
			{children}
		</div>
	)
}
