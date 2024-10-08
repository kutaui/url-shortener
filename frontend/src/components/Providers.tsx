'use client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import axios from 'axios'
import { getCookie, deleteCookie } from 'cookies-next'
import { useRouter } from 'next/navigation'
import React, {
	createContext,
	useEffect,
	useLayoutEffect,
	useState,
} from 'react'
import { useToast } from './ui/use-toast'

export const BASE_URL = process.env.NEXT_PUBLIC_API_URL

axios.defaults.baseURL = BASE_URL
axios.defaults.withCredentials = true

export const AuthContext = createContext<{
	user: User | null
	setUser: React.Dispatch<React.SetStateAction<User | null>>
}>({
	user: null,
	setUser: () => null,
})

const queryClient = new QueryClient()

export default function Providers({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	const [user, setUser] = useState<User | null>({
		id: 0,
		name: '',
		email: '',
		password: '',
	})
	const router = useRouter()
	const { toast } = useToast()

	useEffect(() => {
		const interceptor = axios.interceptors.response.use(
			(response) => response,
			(error) => {
				if (
					error.response &&
					error.response.status === 401 &&
					error.response.message !== 'Invalid Credentials'
				) {
					deleteCookie('USER')
					toast({
						title: 'Session expired',
						description: 'Redirecting to login...',
						variant: 'destructive',
						itemID: '401',
					})
					router.replace('/login')
				}
				return Promise.reject(error)
			}
		)
		return () => axios.interceptors.response.eject(interceptor)
	}, [router, toast])

	useLayoutEffect(() => {
		const storedUser = getCookie('USER')
		const userInCookie = storedUser ? JSON.parse(storedUser) : null
		setUser(userInCookie)
	}, [])

	if (user !== null && user.id === 0) {
		return <div>Loading...</div>
	}

	return (
		<QueryClientProvider client={queryClient}>
			<AuthContext.Provider
				value={{
					user: user,
					setUser: setUser,
				}}
			>
				{children}
			</AuthContext.Provider>
		</QueryClientProvider>
	)
}
