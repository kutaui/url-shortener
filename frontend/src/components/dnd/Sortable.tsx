'use client'
import { CSS } from '@dnd-kit/utilities';
import { cn } from '@/lib/utils';
import { useSortable } from '@dnd-kit/sortable';
import React from 'react';

type Props = {
    children?: React.ReactElement | string
    className?: string
    id: string
}

export function Sortable({ id, children, className }: Props) {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners} className={cn(className)}>
            {children}
        </div>
    );
}
