import { useState, useEffect } from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

export default function Folders() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [folders, setFolders] = useState<{ id: string, name: string }[]>([]);
    const [tags, setTags] = useState<{ id: string, name: string, color: string }[]>([]);
    const [schemaError, setSchemaError] = useState(false);

    useEffect(() => {
        async function fetchFoldersAndTags() {
            if (!user) return;
            const [foldersRes, tagsRes] = await Promise.all([
                supabase.from('folders').select('*').eq('user_id', user.id).order('created_at'),
                supabase.from('tags').select('*').eq('user_id', user.id).order('created_at')
            ]);

            if (foldersRes.error?.code === 'PGRST205' || tagsRes.error?.code === 'PGRST205') {
                setSchemaError(true);
            }

            if (foldersRes.data) setFolders(foldersRes.data);
            if (tagsRes.data) setTags(tagsRes.data);
        }
        fetchFoldersAndTags();
    }, [user]);

    const handleCreateFolder = async () => {
        if (!user) return;
        const name = prompt("Folder Name:");
        if (!name) return;
        const { data, error } = await supabase.from('folders').insert([{ user_id: user.id, name }]).select();
        if (error) alert(error.message);
        else if (data) setFolders([...folders, data[0]]);
    };

    const handleCreateTag = async () => {
        if (!user) return;
        const name = prompt("Tag Name:");
        if (!name) return;
        // Generate a random satisfying tag color 
        const colors = ['#ff3b30', '#0a84ff', '#34c759', '#ffcc00', '#af52de', '#ff9500'];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];

        const { data, error } = await supabase.from('tags').insert([{ user_id: user.id, name, color: randomColor }]).select();
        if (error) alert(error.message);
        else if (data) setTags([...tags, data[0]]);
    };

    return (
        <main style={{ padding: '20px calc(20px + var(--safe-right)) 100px calc(20px + var(--safe-left))' }}>
            {schemaError && (
                <div style={{ background: '#ef4444', color: 'white', padding: '20px', borderRadius: '16px', marginBottom: '24px', marginTop: 'calc(20px + var(--safe-top))', boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)' }}>
                    <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '8px' }}>Database Schema Missing</h2>
                    <p style={{ opacity: 0.9, lineHeight: 1.5, fontSize: '15px' }}>
                        The PostgREST service returned a 404 (PGRST205) because the <code>folders</code> table does not exist.
                        Please copy the contents of <code>supabase_schema.sql</code> and execute it within your Supabase SQL Editor.
                    </p>
                </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', marginTop: schemaError ? '0px' : 'calc(20px + var(--safe-top))' }}>
                <h1 style={{ fontSize: '34px', fontWeight: 700 }}>Folders</h1>
                <Button size="sm" variant="ghost" onClick={handleCreateFolder}>+ New</Button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '40px' }}>
                {folders.length === 0 && <p style={{ color: 'var(--text-secondary)' }}>No custom folders created yet.</p>}
                {folders.map(folder => (
                    <Card key={folder.id} className="folder-card" onClick={() => navigate(`/folders/${folder.id}`)} style={{ display: 'flex', alignItems: 'center', padding: '16px 20px', cursor: 'pointer' }}>
                        <span style={{ fontSize: '24px', marginRight: '16px' }}>📁</span>
                        <div style={{ flex: 1 }}>
                            <h3 style={{ fontSize: '16px', fontWeight: 600 }}>{folder.name}</h3>
                        </div>
                        <span style={{ color: 'var(--text-secondary)' }}>›</span>
                    </Card>
                ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h2 style={{ fontSize: '24px', fontWeight: 700 }}>Tags</h2>
                <Button size="sm" variant="ghost" onClick={handleCreateTag}>+ New</Button>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {tags.length === 0 && <p style={{ color: 'var(--text-secondary)', width: '100%' }}>No tags created yet.</p>}
                {tags.map(tag => (
                    <div
                        key={tag.id}
                        style={{
                            padding: '6px 12px',
                            borderRadius: '100px',
                            fontSize: '13px',
                            fontWeight: 600,
                            backgroundColor: `${tag.color}20`,
                            color: tag.color,
                            border: `1px solid ${tag.color}40`
                        }}
                    >
                        # {tag.name}
                    </div>
                ))}
            </div>
        </main>
    );
}
