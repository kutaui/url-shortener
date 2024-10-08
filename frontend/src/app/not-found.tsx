'use client'
import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const Custom404 = () => {
	const router = useRouter()

	return (
		<div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
			<h1 className="text-6xl font-bold text-gray-800">404</h1>
			<p className="mt-4 text-xl text-gray-600">
				Oops! The page you&apos;re looking for doesn&apos;t exist.
			</p>
			<p className="mt-2 text-lg text-gray-600">
				If you think this page should exist, consider contributing to our
				open-source project!
			</p>
			<div className="mt-6">
				<a
					className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
					href="https://github.com/kutaui/url-shortener"
				>
					Contribute on GitHub
				</a>
			</div>
			<div className="mt-4">
				<button
					onClick={() => router.back()}
					className="px-4 py-2 text-gray-800 bg-gray-200 rounded hover:bg-gray-300"
				>
					Go Back
				</button>
			</div>
		</div>
	)
}

export default Custom404
