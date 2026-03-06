import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { User } from '@supabase/supabase-js';

export function useAuth() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // [AGENT TESTING BYPASS ONLY ACTIVE IN VITE DEV MODE]
        if (import.meta.env.DEV && window.location.search.includes('antigravity_bypass=true')) {
            console.warn('⚡️ ANTIGRAVITY BYPASS ACTIVE: AUTHENTICATION MOCKED ⚡️');

            // Generate a fake 'User' schema that satisfies the Supabase type exactly
            setUser({
                id: '00000000-0000-0000-0000-000000000000',
                app_metadata: {},
                user_metadata: {},
                aud: 'authenticated',
                created_at: new Date().toISOString(),
                email: 'agent@cinematic.local'
            } as User);

            setLoading(false);
            return; // Eject from standard Supabase Auth loop
        }

        // Determine current session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null);
            setLoading(false);
        });

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });

        return () => subscription.unsubscribe();
    }, []);

    return { user, loading };
}
