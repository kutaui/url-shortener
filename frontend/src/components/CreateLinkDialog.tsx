"use client"
import React, { useState } from 'react';
import { CustomDialog } from '@/components/CustomDialog';
import { Button } from '@/components/ui/button';
import { DialogClose } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CreateLinkRequest } from '@/controllers/LinkController';

type Props = {
    onClose: () => void
}

export function CreateLinkDialog({ onClose }: Props) {
    const { toast } = useToast();
    const { register, handleSubmit, formState: { errors }, reset } = useForm();
    const [open, setOpen] = useState(false);

    const createLinkMutation = useMutation({
        mutationFn: CreateLinkRequest,
        onSuccess: () => {
            toast({
                title: 'Success',
                description: 'Link created successfully',
                variant: 'success',
            });
            reset();
            onClose()
            setOpen(false)
            document.querySelector('[data-state="open"]')?.dispatchEvent(new Event('close'));
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

    const handleCreateLink = (data) => {
        createLinkMutation.mutate(data);
    };

    return (
        <CustomDialog
            open={open}
            buttons={{
                Trigger: <Button size="lg" onClick={() => setOpen(true)}>Shorten Link</Button>,
                Submit: <>
                    <DialogClose asChild>
                        <Button type="button" variant="secondary" onClick={() => setOpen(false)} >
                            Cancel
                        </Button>
                    </DialogClose>
                    <Button type="button" variant="default" onClick={handleSubmit(handleCreateLink)}>
                        Shorten
                    </Button>
                </>
            }}
            title="Link Details"
        >
            <form>
                <Label htmlFor="link">URL</Label>
                <Input
                    id="link"
                    placeholder="https://example.com"
                    type="url"
                    {...register('link', { required: 'URL is required' })}
                />
                {errors.link && <p className="text-red-500 text-sm">{errors.link.message}</p>}

                <Label htmlFor="customCode">Custom Code (Optional)</Label>
                <Input
                    id="customCode"
                    placeholder="Enter custom code (max 16 characters)"
                    {...register('customCode')}
                    maxLength={16}
                />
            </form>
        </CustomDialog>
    );
}
