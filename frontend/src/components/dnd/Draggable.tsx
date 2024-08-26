'use client'

import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { cn } from '@/lib/utils';


type Props = {
    children?: React.ReactElement | null
    draggableID: string
    className?: string
}
export function Draggable(props: Props) {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id: props.draggableID,
    });
    const style = transform ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    } : undefined;


    return (
        <div ref={setNodeRef} style={style} {...listeners} {...attributes} className={cn(props.className)}>
            {props.children}
        </div>
    );
}