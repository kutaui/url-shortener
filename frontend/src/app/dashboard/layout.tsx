import DashboardLayout from '@/components/DashboardLayout'
import { cookies } from 'next/headers'

export default function Layout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {

	return (
		<DashboardLayout
		>
			{children}
		</DashboardLayout>
	)
}
