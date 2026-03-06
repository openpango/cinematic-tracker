import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';

export default function Profile() {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);

    // Form state
    const [fullName, setFullName] = useState('');
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

    useEffect(() => {
        if (user) {
            setFullName(user.user_metadata?.full_name || '');
            setAvatarUrl(user.user_metadata?.avatar_url || null);
        }
    }, [user]);

    const handleProfileUpdate = async () => {
        if (!user) return;
        setLoading(true);
        const { error } = await supabase.auth.updateUser({
            data: { full_name: fullName, avatar_url: avatarUrl }
        });
        if (error) {
            alert(error.message);
        } else {
            alert('Profile updated successfully!');
        }
        setLoading(false);
    };

    const handleSignOut = async () => {
        await supabase.auth.signOut();
    };

    const uploadAvatar = async (event: React.ChangeEvent<HTMLInputElement>) => {
        try {
            setUploading(true);
            if (!event.target.files || event.target.files.length === 0) {
                throw new Error('You must select an image to upload.');
            }

            const file = event.target.files[0];
            const fileExt = file.name.split('.').pop();
            const fileName = `${user?.id}-${Math.random()}.${fileExt}`;
            const filePath = `${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(filePath, file);

            if (uploadError) {
                throw uploadError;
            }

            // Get Public URL
            const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);

            // Immediately apply to local state
            setAvatarUrl(data.publicUrl);

            // Immediately sync to auth metadata
            await supabase.auth.updateUser({
                data: { avatar_url: data.publicUrl }
            });

        } catch (error: any) {
            alert(error.message);
        } finally {
            setUploading(false);
        }
    };

    return (
        <main style={{ padding: '20px calc(20px + var(--safe-right)) 100px calc(20px + var(--safe-left))', display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <h1 style={{ fontSize: '34px', fontWeight: 700, marginTop: 'calc(20px + var(--safe-top))' }}>Profile</h1>

            <Card style={{ padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
                <div style={{ position: 'relative' }}>
                    <div
                        style={{
                            width: '120px',
                            height: '120px',
                            borderRadius: '50%',
                            backgroundColor: 'var(--bg-primary)',
                            backgroundImage: avatarUrl ? `url(${avatarUrl})` : 'none',
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            border: '4px solid var(--border-color)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '40px',
                            color: 'var(--text-secondary)'
                        }}
                    >
                        {!avatarUrl && user?.email?.charAt(0).toUpperCase()}
                    </div>

                    <label
                        style={{
                            position: 'absolute',
                            bottom: 0,
                            right: 0,
                            backgroundColor: 'var(--accent)',
                            color: 'white',
                            width: '36px',
                            height: '36px',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                        }}
                    >
                        <input
                            type="file"
                            accept="image/*"
                            onChange={uploadAvatar}
                            disabled={uploading}
                            style={{ display: 'none' }}
                        />
                        {uploading ? '...' : '📷'}
                    </label>
                </div>

                <h2 style={{ fontSize: '20px', fontWeight: 600, margin: 0 }}>
                    {fullName || 'Anonymous User'}
                </h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '14px', margin: 0 }}>
                    {user?.email}
                </p>
            </Card>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <Input
                    label="Display Name"
                    placeholder="Enter your name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                />

                <Button
                    variant="primary"
                    onClick={handleProfileUpdate}
                    disabled={loading || uploading}
                >
                    {loading ? 'Saving...' : 'Save Changes'}
                </Button>
            </div>

            <div style={{ marginTop: 'auto', paddingTop: '40px' }}>
                <Button variant="ghost" onClick={handleSignOut} style={{ color: 'var(--accent)' }}>
                    Sign Out
                </Button>
            </div>
        </main>
    );
}
