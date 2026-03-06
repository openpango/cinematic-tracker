import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

export default function Input({ label, error, className, style, ...props }: InputProps) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%', marginBottom: '16px', ...style }}>
            {label && <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)' }}>{label}</label>}
            <input
                className={className}
                style={{
                    backgroundColor: 'var(--bg-secondary)',
                    border: error ? '1px solid var(--accent)' : '1px solid transparent',
                    borderRadius: '12px',
                    padding: '14px 16px',
                    color: 'var(--text-primary)',
                    fontSize: '16px',
                    outline: 'none',
                    transition: 'border 0.2s ease',
                    width: '100%',
                    boxSizing: 'border-box'
                }}
                {...props}
            />
            {error && <span style={{ color: 'var(--accent)', fontSize: '12px', marginTop: '-4px' }}>{error}</span>}
        </div>
    );
}
