'use client'

import Hero from '@/components/Hero'
import Header from '@/components/Header'

export default function Home() {
	return (
		<section className="mt-6 max-w-[1280px] mx-auto">
			<Header />
			<Hero />
		</section>
	)
}
