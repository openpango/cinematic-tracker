/**
 * Renders the new app identity in a dual-font stacked format:
 * [FIRST] (Bold Sans)
 *    [SECOND] (Editorial Script)
 */
export default function BrandLogo() {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', userSelect: 'none' }}>
            <span style={{
                fontFamily: 'var(--font-logo-bold)',
                fontSize: '24px',
                fontWeight: 700,
                letterSpacing: '-1px',
                color: 'var(--text-primary)',
                lineHeight: 1
            }}>
                CINE
            </span>
            <span style={{
                fontFamily: 'var(--font-logo-script)',
                fontSize: '28px',
                color: 'var(--accent-color)',
                lineHeight: 0.8,
                marginLeft: '28px',
                transform: 'rotate(-4deg)',
                WebkitFontSmoothing: 'antialiased'
            }}>
                track
            </span>
        </div>
    );
}
