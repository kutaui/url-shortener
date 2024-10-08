import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog'

type Props = {
  children: React.ReactNode
  buttons: {
    Trigger: React.ReactElement
    Submit: React.ReactElement
  }
  title: string
  description?: string
}

export function CustomDialog({
  children,
  buttons,
  title,
  description,
}: Props) {
  return (
    <Dialog>
      <DialogTrigger asChild>{buttons.Trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        {children}
        <DialogFooter>
          <DialogClose asChild>
            {buttons.Submit}
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}