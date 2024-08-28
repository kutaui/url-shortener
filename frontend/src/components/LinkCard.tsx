"use client"
import React, { useState } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Check, Copy, MousePointerClick } from "lucide-react"
import { CustomDialog } from './CustomDialog'
import { DialogClose } from './ui/dialog'
import { useToast } from './ui/use-toast'

type Props = {
    data: Link
    count: number
}

export default function Component({ data, count }: Props) {
    const { toast } = useToast()
    const [copied, setCopied] = useState(false)

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(data.link)
            setCopied(true)
            setTimeout(() => setCopied(false), 1500)
        } catch (err: any) {
            toast({
                title: 'Failed to copy text',
                description: err.message,
                variant: 'destructive',
            })
            console.error('Failed to copy text: ', err)
        }
    }

    return (
        <Card className="w-full h-full">
            <CardContent className="flex flex-col justify-between h-full p-4">
                <div className="flex items-start justify-between mb-4">
                    <h3 className="text-sm font-medium truncate mr-2 flex-grow">{data?.link}</h3>
                    <Button variant="ghost" size="icon" onClick={handleCopy} className="flex-shrink-0">
                        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        <span className="sr-only">Copy link</span>
                    </Button>
                </div>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <MousePointerClick className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground text-sm">{count}</span>
                    </div>
                    <CustomDialog
                        buttons={{
                            Trigger: <Button size="sm">Detail</Button>,
                            Submit: <>
                                <DialogClose asChild>
                                    <Button type="button" variant="secondary" >
                                        Close
                                    </Button>
                                </DialogClose>
                                <Button type="button" variant="destructive" >
                                    Delete
                                </Button>
                            </>
                        }}
                        title="Link Details"
                    >
                        <div className='flex flex-col gap-4'>
                            <p>Original Url: <a className='hover:underline' href={data?.link}>{data?.link}</a> </p>
                            <p>Created Date: <span className='font-bold'>{data?.created_at} </span></p>
                        </div>
                    </CustomDialog>
                </div>
            </CardContent>
        </Card>
    )
}