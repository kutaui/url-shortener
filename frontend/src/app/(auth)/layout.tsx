import type { Metadata } from 'next'
import { Toaster } from '@/components/ui/toaster'
import Header from '@/components/Header'
import Providers from '@/components/Providers'
import Script from 'next/script'

export const metadata: Metadata = {
	title: 'Shortie',
	description: 'Url shortener service.',
	keywords: ['urlshortener', 'linkshortener', 'shortener'],
	robots: 'index, follow',
	creator: 'kutaui',
	metadataBase: new URL('https://shortie.kutaybekleric.com'),
	authors: [
		{
			name: 'kutaui',
			url: 'https://kutay.boo',
		},
		{
			name: 'kutay bekleric',
			url: 'https://kutaybekleric.com',
		},
	],
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<>
			<Header />
			{children}
		</>
	)
}
