import React from 'react';
import './Card.css';

interface CardProps {
    children: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
    onClick?: () => void;
}

export default function Card({ children, className = '', style, onClick }: CardProps) {
    return (
        <div
            className={`apple-card ${onClick ? 'interactive' : ''} ${className}`}
            style={style}
            onClick={onClick}
        >
            {children}
        </div>
    );
}
