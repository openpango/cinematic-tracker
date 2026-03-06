import { useState } from 'react';
import { supabase } from '../lib/supabase';
import GlassPane from '../components/ui/GlassPane';
import Button from '../components/ui/Button';

export default function Auth() {
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [isLogin, setIsLogin] = useState(true);

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // Fallback simple magic link for now
        const { error } = isLogin
            ? await supabase.auth.signInWithOtp({ email })
            : await supabase.auth.signInWithOtp({ email });

        if (error) {
            alert(error.message);
        } else {
            alert('Check your email for the login link!');
        }
        setLoading(false);
    };

    return (
        <main style={{ padding: '20px calc(20px + var(--safe-right)) 100px calc(20px + var(--safe-left))' }}>
            <h1 style={{ fontSize: '34px', fontWeight: 700, marginBottom: '20px', marginTop: 'calc(20px + var(--safe-top))' }}>
                {isLogin ? 'Welcome Back' : 'Get Started'}
            </h1>

            <GlassPane style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <p style={{ color: 'var(--text-secondary)' }}>
                    Sign in to sync your movies and series across all your devices.
                </p>

                <form onSubmit={handleAuth} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <input
                        type="email"
                        placeholder="Your email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        style={{
                            padding: '16px',
                            borderRadius: '12px',
                            border: '1px solid var(--border-color)',
                            background: 'var(--bg-secondary)',
                            color: 'var(--text-primary)',
                            fontSize: '16px',
                            outline: 'none'
                        }}
                    />
                    <Button type="submit" fullWidth disabled={loading}>
                        {loading ? 'Sending link...' : (isLogin ? 'Log In via Magic Link' : 'Sign Up')}
                    </Button>
                </form>

                <div style={{ textAlign: 'center', marginTop: '16px' }}>
                    <button
                        type="button"
                        onClick={() => setIsLogin(!isLogin)}
                        style={{ color: 'var(--accent-color)', fontWeight: 500, background: 'none', border: 'none', cursor: 'pointer' }}
                    >
                        {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Log In"}
                    </button>
                </div>
            </GlassPane>
        </main>
    );
}
