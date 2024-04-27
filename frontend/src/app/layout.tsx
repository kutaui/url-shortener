import type { Metadata } from 'next'
import './globals.css'
import { Toaster } from '@/components/ui/toaster'
import Header from '@/components/Header'
import Providers from '@/components/Providers'

export const metadata: Metadata = {
	title: 'Shortie',
	description: 'URL shortener and link management platform.',
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang="en">
			<body className="mt-6 max-w-[1280px] mx-auto">
				<Providers>
					<Header />
					{children}
					<Toaster />
				</Providers>
			</body>
		</html>
	)
}
