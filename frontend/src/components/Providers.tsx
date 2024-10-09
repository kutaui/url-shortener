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
	useCallback,
} from 'react'
import { useToast } from './ui/use-toast'

export const BASE_URL = process.env.NEXT_PUBLIC_API_URL

axios.defaults.baseURL = BASE_URL
axios.defaults.withCredentials = true

export const AuthContext = createContext<{
	user: User | null
	setUser: React.Dispatch<React.SetStateAction<User | null>>
	syncUser: () => void
}>({
	user: null,
	setUser: () => null,
	syncUser: () => null,
})

const queryClient = new QueryClient()

export default function Providers({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	const [user, setUser] = useState<User | null>(null)
	const router = useRouter()
	const { toast } = useToast()
	console.log(BASE_URL, 'provider')
	const syncUser = useCallback(() => {
		const storedUser = getCookie('USER')
		const userInCookie = storedUser ? JSON.parse(storedUser as string) : null
		setUser(userInCookie)
	}, [])

	useEffect(() => {
		const interceptor = axios.interceptors.response.use(
			(response) => response,
			(error) => {
				if (
					error.response &&
					error.response.status === 401 &&
					!error.response.data.trim().includes('Invalid Credentials')
				) {
					console.log(error.response)
					deleteCookie('USER')
					syncUser()
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
	}, [router, toast, syncUser])

	useLayoutEffect(() => {
		syncUser()
	}, [syncUser])

	return (
		<QueryClientProvider client={queryClient}>
			<AuthContext.Provider
				value={{
					user,
					setUser,
					syncUser,
				}}
			>
				{children}
			</AuthContext.Provider>
		</QueryClientProvider>
	)
}
