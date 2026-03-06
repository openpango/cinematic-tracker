import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';
import MediaCard, { MediaItem } from '../components/media/MediaCard';
import Button from '../components/ui/Button';

export default function FolderDetail() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [folderName, setFolderName] = useState<string>('Loading...');
    const [items, setItems] = useState<MediaItem[]>([]);

    useEffect(() => {
        async function fetchFolderData() {
            if (!user || !id) return;

            // Get Folder Name
            const { data: folderData } = await supabase
                .from('folders')
                .select('name')
                .eq('id', id)
                .single();

            if (folderData) setFolderName(folderData.name);

            // Fetch relations: folder_items -> list_items -> media
            const { data: pivotData, error } = await supabase
                .from('folder_items')
                .select(`
                    list_items (
                        media (
                            id, tmdb_id, title, media_type, poster_path, release_year
                        )
                    )
                `)
                .eq('folder_id', id);

            if (error) {
                console.error(error);
                return;
            }

            if (pivotData) {
                const formattedList = pivotData
                    .filter(pivot => pivot.list_items && (pivot.list_items as any).media)
                    .map(pivot => {
                        const media = (pivot.list_items as any).media;
                        return {
                            id: media.id,
                            tmdb_id: media.tmdb_id,
                            title: media.title,
                            media_type: media.media_type,
                            poster_path: media.poster_path,
                            year: media.release_year
                        };
                    });
                setItems(formattedList);
            }
        }

        fetchFolderData();
    }, [user, id]);

    return (
        <main style={{ padding: '20px calc(20px + var(--safe-right)) 100px calc(20px + var(--safe-left))' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px', marginTop: 'calc(20px + var(--safe-top))' }}>
                <Button variant="ghost" size="sm" onClick={() => navigate(-1)} style={{ padding: '8px', minWidth: 'auto', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    ‹
                </Button>
                <h1 style={{ fontSize: '34px', fontWeight: 700, margin: 0 }}>
                    {folderName}
                </h1>
            </div>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
                gap: '16px',
                marginBottom: '40px'
            }}>
                {items.length === 0 && <p style={{ color: 'var(--text-secondary)' }}>This folder is empty.</p>}
                {items.map((item) => (
                    <MediaCard
                        key={item.id}
                        item={item}
                    />
                ))}
            </div>
        </main>
    );
}
