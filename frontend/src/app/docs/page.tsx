import Header from '@/components/Header'
import React from 'react'
import Image from 'next/image'

export default function page() {
  return (
		<section className="max-w-[1280px] mx-auto">
      <Header />
      <Image src="/megamind.jpg" width={0}
        height={0} className='w-svw h-[94vh]' sizes="100vw" alt='Megamind peeking meme says "no documentation ?"' />
    </section>
  )
}
