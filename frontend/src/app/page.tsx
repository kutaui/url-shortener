'use client'

import Header from '@/components/Header'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Meteors } from '@/components/ui/meteors'
import Link from 'next/link'
import Image from 'next/image'

export default function Home() {
	return (
		<section className="max-w-[1280px] mx-auto">
			<Header />
			<main className="flex justify-center items-center px-6 flex-col md:flex-row md:mt-32">
				<section className="flex flex-col gap-4  flex-1 relative overflow-hidden mb-8 md:mb-">
					<div className="bg-primary-foreground text-primary font-semibold w-max py-3 px-6 rounded-full mx-auto md:mx-0">
						<h6>Shorten your links with one✨ click.</h6>
					</div>
					<div className="w-full md:w-[90%] flex flex-col gap-6 mb-6">
						<h1 className="text-3xl font-bold font-mono md:text-6xl sm:text-5xl">
							ALL IN ONE TOOLS FOR YOUR LINKS
						</h1>
						<p className="text-gray-500">
							On a single platform, you&#39;ll find all the tools you need to
							connect audiences worldwide, manage links and have the best
							analytic and creator tools.
						</p>
					</div>
					<div className="relative flex w-[90%] mx-auto md:w-[70%] md:mx-0">
						<Input
							placeholder="https://kutay.boo"
							className="h-16 bg-primary-foreground pr-32"
						/>
						<div className="absolute inset-y-0 right-0 flex items-center px-2">
							<Link href="/register" passHref legacyBehavior>
								<Button className="h-12">Shorten✨ Link</Button>
							</Link>
						</div>
					</div>
					<p className="text-gray-500">Time to grow your audience. 🚀</p>
					<Meteors />
				</section>
				<section className="bg-black flex-1 flex justify-center items-center">
					<Image src="/dashboard.png" width={400} height={400} className='w-full' alt='Dashboard Image with Some Charts' />
				</section>
			</main>
			<div className="bg-[url('/circle-scatter-haikei.svg')] flex justify-around flex-wrap mt-8">
				<Image src="/twitch.png" width={150} height={150} alt="Twitch Logo" />
				<Image src="/milka.png" width={150} height={150} alt="Milka Logo" />
				<Image src="/pepsi.png" width={150} height={150} alt="Pepsi Logo" />
				<Image src="/the-beatles.png" width={150} height={150} alt="Beatles Logo" />
			</div>
		</section>
	)
}
