import Providers from '@/components/Providers'
import { Toaster } from '@/components/ui/toaster'
import type { Metadata } from 'next'
import Script from 'next/script'
import './globals.css'

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
	openGraph: {
		type: 'website',
		url: 'https://shortie.kutaybekleric.com',
		title: 'Shortie',
		description: 'Url shortener service.',
		images: [
			{
				url: 'https://shortie.kutaybekleric.com/dashboard.png',
				width: 800,
				height: 600,
				alt: 'Shortie',
			},
		],
	},
	twitter: {
		card: 'summary_large_image',
		site: '@kutaui',
		title: 'Shortie',
		description: 'Url shortener service.',
		images: [
			{
				url: 'https://shortie.kutaybekleric.com/dashboard.png',
				width: 800,
				height: 600,
				alt: 'Shortie',
			},
		],
	},
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang="en">
			<head>
				<meta charSet="UTF-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1.0" />
				<meta name="description" content="Url shortener service." />
				<meta name="keywords" content="urlshortener, linkshortener, shortener" />
				<meta name="robots" content="index, follow" />
				<meta name="author" content="kutaui" />
				<meta property="og:type" content="website" />
				<meta property="og:url" content="https://shortie.kutaybekleric.com" />
				<meta property="og:title" content="Shortie" />
				<meta property="og:description" content="Url shortener service." />
				<meta property="og:image" content="https://shortie.kutaybekleric.com/og-image.jpg" />
				<meta name="twitter:card" content="summary_large_image" />
				<meta name="twitter:site" content="@kutaui" />
				<meta name="twitter:title" content="Shortie" />
				<meta name="twitter:description" content="Url shortener service." />
				<meta name="twitter:image" content="https://shortie.kutaybekleric.com/twitter-image.jpg" />
				<link rel="canonical" href="https://shortie.kutaybekleric.com" />
				<link rel="icon" href="/favicon.ico" />
			</head>
			<body>
				<Providers>
					{children}
					<Toaster />
				</Providers>
			</body>
			<Script src="https://scripts.simpleanalyticscdn.com/latest.js" />
		</html>
	)
}
