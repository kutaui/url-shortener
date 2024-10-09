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
import { useForm } from 'react-hook-form'

export function AuthForm({ login }: { login?: boolean }) {
	console.log(process.env.NEXT_PUBLIC_API_URL)

	const { toast } = useToast()
	const router = useRouter()
	const { setUser, user } = useContext(AuthContext)
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm()

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
			router.replace('/dashboard')
		},
		onError: (error: any) => {
			const errorMessage =
				error.response?.data || error.message || 'Something Went Wrong'

			if (error.response?.status === 401) {
				toast({
					title: 'Error',
					description: 'Invalid email or password.',
					variant: 'destructive',
				})
			} else {
				toast({
					title: 'Error',
					description: errorMessage,
					variant: 'destructive',
				})
			}
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
			router.replace('/dashboard')
		},
		onError: (error: any) => {
			const errorMessage =
				error.response?.data || error.message || 'Something Went Wrong'

			toast({
				title: 'Error',
				description: errorMessage,
				variant: 'destructive',
			})
		},
	})

	const handleLogin = async (data: any) => {
		const userLoginData: UserLoginType = {
			email: data.email,
			password: data.password,
		}
		loginMutation.mutate(userLoginData)
	}

	const handleRegister = async (data: any) => {
		const userRegisterData: UserRegisterType = {
			name: data.name,
			email: data.email,
			password: data.password,
		}
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

			<form
				className="my-8"
				onSubmit={handleSubmit(login ? handleLogin : handleRegister)}
			>
				{!login && (
					<LabelInputContainer className="mb-4">
						<Label htmlFor="name">Name</Label>
						<Input
							id="name"
							placeholder="Jotaro Kujo"
							type="text"
							{...register('name', { required: 'Name is required' })}
						/>
						{errors.name && (
							<p className="text-red-500 text-sm">
								{String(errors.name.message)}
							</p>
						)}
					</LabelInputContainer>
				)}

				<LabelInputContainer className="mb-4">
					<Label htmlFor="email">Email Address</Label>
					<Input
						id="email"
						placeholder="hi@kutaybekleric.com"
						type="email"
						{...register('email', {
							required: 'Email is required',
							pattern: {
								value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
								message: 'Invalid email address',
							},
						})}
					/>
					{errors.email && (
						<p className="text-red-500 text-sm">
							{String(errors.email.message)}
						</p>
					)}
				</LabelInputContainer>

				<LabelInputContainer className="mb-4">
					<Label htmlFor="password">Password</Label>
					<Input
						id="password"
						placeholder="123456"
						type="password"
						{...register('password', {
							required: 'Password is required',
							minLength: {
								value: 6,
								message: 'Password must be at least 6 characters',
							},
						})}
					/>
					{errors.password && (
						<p className="text-red-500 text-sm">
							{String(errors.password.message)}
						</p>
					)}
				</LabelInputContainer>

				<button
					className="bg-primary relative group/btn block w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
					type="submit"
				>
					{login ? 'Sign in' : 'Sign up'}
					<BottomGradient />
				</button>
			</form>

			{login ? (
				<p>
					Don&apos;t have an Account ?
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
