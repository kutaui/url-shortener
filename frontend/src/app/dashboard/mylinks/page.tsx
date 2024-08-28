"use client"
import { CustomDialog } from '@/components/CustomDialog'
import LinkCard from '@/components/LinkCard'
import { Button } from '@/components/ui/button'
import { DialogClose } from '@/components/ui/dialog'
import { useToast } from '@/components/ui/use-toast'
import { useSSE } from '@/controllers/SSEhandler'
import React, { useEffect } from 'react'

export default function Page() {
    const {toast} = useToast()
    useSSE('http://localhost:8080/api/link-clicked-events', (data) => {
        if (data.connected) {
            console.log('Connected to SSE stream');
        } else {
            console.log('Link clicked:', data);
            toast({
                title: 'Link Clicked',
				description: ` Your link with the code: ${data.code} has been clicked.`,
				variant: 'success',
            })
        }
    });

    return (
        <main className="p-20">
            <div className='flex justify-between items-center content-center mb-10'>

                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold ">My Links</h1>
                <CustomDialog
                    buttons={{
                        Trigger: <Button size="lg">Shorten Link</Button>,
                        Submit: <>
                            <DialogClose asChild>
                                <Button type="button" variant="secondary" >
                                    Cancel
                                </Button>
                            </DialogClose>
                            <Button type="button" variant="default" >
                                Shorten
                            </Button>
                        </>

                    }}
                    title="Link Details"
                >
                    <div>
                        asd
                    </div>
                </CustomDialog>
            </div>
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
                <LinkCard link="http://localhost:3001/dashboard/mylink" count="123" />
                <LinkCard link="https://swissmade.host/en/blog/basic-nginx-setup-ubuntu-" count="123" />
                <LinkCard link="https://swissmade.host/en/blog/basic-nginx-setup-ubuntu-" count="123" />
                <LinkCard link="https://swissmade.host/en/blog/basic-nginx-setup-ubuntu-" count="123" />
                <LinkCard link="https://swissmade.host/en/blog/basic-nginx-setup-ubuntu-" count="123" />
                <LinkCard link="https://swissmade.host/en/blog/basic-nginx-setup-ubuntu-" count="123" />
                <LinkCard link="hattps://swissmade.host/en/blog/basic-nginx-setup-ubuntuubuntuubuntuubuntuubuntu-" count="123" />
                <LinkCard link="https://swissmade.host/en/blog/basic-nginx-setup-ubuntu-" count="123" />
                <LinkCard link="https://swissmade.host/en/blog/basic-nginx-setup-ubuntu-" count="123" />
            </section>
        </main>
    )
}