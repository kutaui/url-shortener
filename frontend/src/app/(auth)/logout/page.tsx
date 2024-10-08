'use client'
import { useEffect, useContext } from 'react'
import { useRouter } from 'next/navigation'
import { LogoutRequest } from '@/controllers/UserController'
import { deleteCookie } from 'cookies-next'
import { AuthContext } from '@/components/Providers'

const LogoutPage = () => {
	const router = useRouter()
	const { syncUser } = useContext(AuthContext)

	useEffect(() => {
		const logout = async () => {
			deleteCookie('USER')
			await LogoutRequest()
			syncUser()
			router.push('/')
		}
		logout()
	}, [router, syncUser])

	return (
		<div>
			<h1>Logging you out...</h1>
			<p>Please wait while we log you out.</p>
		</div>
	)
}

export default LogoutPage
