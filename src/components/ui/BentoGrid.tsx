'use client';

import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface BentoGridProps {
    children: ReactNode;
    className?: string;
}

export function BentoGrid({ children, className }: BentoGridProps) {
    return (
        <div
            className={cn(
                'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6',
                'auto-rows-[minmax(200px,auto)]',
                className
            )}
        >
            {children}
        </div>
    );
}

interface BentoCardProps {
    children: ReactNode;
    className?: string;
    size?: 'default' | 'large' | 'tall' | 'wide';
    highlight?: boolean;
}

export function BentoCard({
    children,
    className,
    size = 'default',
    highlight = false,
}: BentoCardProps) {
    const sizeClasses = {
        default: '',
        large: 'md:col-span-2 md:row-span-2',
        tall: 'md:row-span-2',
        wide: 'md:col-span-2',
    };

    return (
        <div
            className={cn(
                // Base styles
                'group relative overflow-hidden rounded-2xl',
                'bg-card border border-border',
                'p-6 md:p-8',
                // Depth & glassmorphism
                'depth-2 glow-hover',
                // Size variant
                sizeClasses[size],
                // Highlight variant
                highlight && 'bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20',
                className
            )}
        >
            {/* Subtle gradient overlay on hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/0 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

            {/* Content */}
            <div className="relative z-10">
                {children}
            </div>
        </div>
    );
}
