import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import React from "react"

type Props = {
    children: React.ReactElement
    buttons: {
        Trigger: React.ReactElement
        Submit: React.ReactElement
    }
    title: string
    description?: string
    open?: boolean
    setOpen?: () => void
}

export function CustomDialog({ children, buttons, title, description, open, setOpen }: Props) {

    return (
        <Dialog {...(open !== undefined && { open })} {...(setOpen && { onOpenChange: setOpen })}>
            <DialogTrigger asChild>
                {buttons.Trigger}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>
                        {description}
                    </DialogDescription>
                </DialogHeader>
                {children}
                <DialogFooter>
                    {buttons.Submit}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
