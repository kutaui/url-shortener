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
}

export function CustomDialog({ children, buttons, title, description }: Props) {
    return (
        <Dialog>
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
