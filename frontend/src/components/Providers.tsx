'use client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import axios from 'axios'
import { getCookie } from 'cookies-next'
import React, {
	createContext,
	useEffect,
	useLayoutEffect,
	useState,
} from 'react'

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
