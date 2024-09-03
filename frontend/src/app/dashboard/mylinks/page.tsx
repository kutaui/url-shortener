"use client"
import { CreateLinkDialog } from '@/components/CreateLinkDialog'
import LinkCard from '@/components/LinkCard'
import { GetLinksByUserQuery } from '@/controllers/LinkController'

export default function Page() {
    const { data: links, isLoading, refetch } = GetLinksByUserQuery()



    return (
        <main className="p-20">
            <div className='flex justify-between items-center content-center mb-10'>

                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold ">My Links</h1>
                <CreateLinkDialog onClose={() => refetch()} />
            </div>
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
                {isLoading ? (
                    <div>Loading...</div>
                ) : links && links.length > 0 ? (
                    links.map((link) => (
                        <LinkCard
                            key={link.id}
                            data={link}
                            count={link.clickCount || 0}
                            onClose={() => refetch()}
                        />
                    ))
                ) : (
                    <div>No links found.</div>
                )}
            </section>
        </main>
    )
}