"use client"
import React, { useState } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Check, Copy, MousePointerClick } from "lucide-react"
import { CustomDialog } from './CustomDialog'
import { DialogClose } from './ui/dialog'
import { useToast } from './ui/use-toast'
import { ExternalLink } from "lucide-react"
import { useMutation } from '@tanstack/react-query'
import { DeleteLink } from '@/controllers/LinkController'

type Props = {
    data: Link
    count: number
    onClose: () => void
}

export default function Component({ data, count, onClose }: Props) {
    const { toast } = useToast()
    const [copied, setCopied] = useState(false)
    const [open, setOpen] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(data.longUrl)
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

    const deleteLinkMutation = useMutation({
        mutationFn: DeleteLink,
        onSuccess: () => {
            toast({
                title: 'Success',
                description: 'Link deleted successfully',
                variant: 'success',
            });
            onClose()
            setOpen(false);
        },
        onError: (error) => {
            const errorMessage = error.response.data || error.message || "Something Went Wrong";
            toast({
                title: 'Error',
                description: errorMessage,
                variant: 'destructive',
            });
        },
    });

    const handleDeleteLink = () => {
        deleteLinkMutation.mutate(data.id);
    };

    return (
        <Card className="w-full h-full hover:shadow-md transition-shadow duration-300">
            <CardContent className="flex flex-col justify-between h-full p-6">
                <div className="mb-4">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-2">{data?.code}</h2>
                    <div className="flex items-center justify-between">
                        <h3 className="text-sm text-gray-600 dark:text-gray-400 truncate mr-2 flex-grow">
                            <a className='text-blue-500 hover:underline flex items-center gap-1' href={data?.longUrl} target="_blank" rel="noopener noreferrer">
                                {data?.longUrl}
                            </a>
                        </h3>
                        <Button variant="outline" size="icon" onClick={handleCopy} className="flex-shrink-0">
                            {copied ? <Check className="h-5 w-5 text-green-500" /> : <Copy className="h-5 w-5" />}
                            <span className="sr-only">Copy link</span>
                        </Button>
                    </div>
                </div>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 rounded-full px-3 py-1">
                        <MousePointerClick className="h-4 w-4 text-blue-500" />
                        <span className="text-sm font-medium">{count} clicks</span>
                    </div>
                    <CustomDialog
                        open={open}
                        buttons={{
                            Trigger: <Button size="sm" variant="outline" onClick={() => setOpen(true)}>View Details</Button>,
                            Submit: <>
                                <DialogClose asChild>
                                    <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                                        Close
                                    </Button>
                                </DialogClose>
                                <Button type="button" variant="destructive" onClick={handleDeleteLink}>
                                    Delete
                                </Button>
                            </>
                        }}
                        title="Link Details"
                    >
                        <div className='space-y-4'>
                            <div>
                                <p className="text-sm text-gray-500 mb-1">Original URL</p>
                                <a className='text-blue-500 hover:underline flex items-center gap-1' href={data?.longUrl} target="_blank" rel="noopener noreferrer">
                                    {data?.longUrl}
                                    <ExternalLink className="h-4 w-4" />
                                </a>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 mb-1">Shortened Url</p>
                                <a className='text-blue-500 hover:underline flex items-center gap-1' href={process.env.NEXT_PUBLIC_API_URL + "/" + data?.code} target="_blank" rel="noopener noreferrer">
                                    {process.env.NEXT_PUBLIC_API_URL}/{data?.code}                                    <ExternalLink className="h-4 w-4" />
                                </a>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 mb-1">Created Date</p>
                                <p className='font-semibold'>{new Date(data?.createdAt).toLocaleDateString()}</p>
                            </div>
                        </div>
                    </CustomDialog>
                </div>
            </CardContent>
        </Card>
    )
}