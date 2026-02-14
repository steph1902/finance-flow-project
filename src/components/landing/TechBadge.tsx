import React from 'react';

export function TechBadge({ children }: { children: React.ReactNode }) {
    return (
        <span className="inline-flex items-center px-3 py-1.5 rounded-full bg-cream text-sumi text-sm font-medium border border-border/50">
            {children}
        </span>
    );
}
