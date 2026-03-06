import React from 'react';

interface GlassPaneProps {
    children: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
}

export default function GlassPane({ children, className = '', style }: GlassPaneProps) {
    return (
        <div
            className={`glass ${className}`}
            style={{
                borderRadius: '16px',
                padding: '16px',
                ...style
            }}
        >
            {children}
        </div>
    );
}
