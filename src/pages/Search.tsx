import { useState, useEffect } from 'react';
import MediaCard, { MediaItem } from '../components/media/MediaCard';
import Button from '../components/ui/Button';
import { searchMedia } from '../lib/tmdb';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';

export default function Search() {
    const { user } = useAuth();
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<MediaItem[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const delayDebounceFn = setTimeout(async () => {
            if (query.trim().length > 2) {
                setLoading(true);
                try {
                    const res = await searchMedia(query);
                    setResults(res);
                } catch (e) {
                    console.error(e);
                } finally {
                    setLoading(false);
                }
            } else if (query.trim().length === 0) {
                setResults([]);
            }
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [query]);

    const handleAddToList = async (item: MediaItem, status: 'to_watch' | 'watched') => {
        if (!user) {
            alert("You must be logged in to add to your list");
            return;
        }

        try {
            const { data: existingMedia } = await supabase.from('media').select('*').eq('tmdb_id', item.tmdb_id).limit(1);
            let localMediaId;

            if (!existingMedia || existingMedia.length === 0) {
                const { data: newMedia, error: mediaError } = await supabase.from('media').insert([{
                    tmdb_id: item.tmdb_id,
                    title: item.title,
                    media_type: item.media_type,
                    poster_path: item.poster_path,
                    release_year: item.year
                }]).select();

                if (mediaError) throw mediaError;
                localMediaId = newMedia[0].id;
            } else {
                localMediaId = existingMedia[0].id;
            }

            const { error: listError } = await supabase.from('list_items').upsert({
                user_id: user.id,
                media_id: localMediaId,
                status: status
            }, { onConflict: 'user_id,media_id' });

            if (listError) throw listError;
            alert(`Added ${item.title} to your ${status === 'to_watch' ? 'To Watch' : 'Watched'} list!`);
        } catch (e: any) {
            console.error(e);
            alert(e.message);
        }
    };

    return (
        <main style={{ padding: '20px calc(20px + var(--safe-right)) 100px calc(20px + var(--safe-left))' }}>
            <h1 style={{ fontSize: '34px', fontWeight: 700, marginBottom: '20px', marginTop: 'calc(20px + var(--safe-top))' }}>
                Search
            </h1>

            <div style={{
                background: 'var(--bg-secondary)',
                padding: '12px 16px',
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                border: '1px solid var(--border-color)',
                marginBottom: '24px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
            }}>
                <span style={{ color: 'var(--text-secondary)' }}>🔍</span>
                <input
                    type="text"
                    placeholder="Movies, Series, Actors..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    style={{ width: '100%', outline: 'none', background: 'transparent', border: 'none', color: 'var(--text-primary)' }}
                />
            </div>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
                gap: '16px'
            }}>
                {loading ? <p style={{ color: 'var(--text-secondary)' }}>Searching...</p> : results.map((item) => (
                    <MediaCard
                        key={`${item.media_type}-${item.tmdb_id}`}
                        item={item}
                        actionNode={
                            <div style={{ display: 'flex', gap: '4px', width: '100%' }}>
                                <Button size="sm" variant="primary" fullWidth onClick={(e) => { e.stopPropagation(); handleAddToList(item, 'to_watch'); }}>Queue</Button>
                                <Button size="sm" variant="secondary" fullWidth onClick={(e) => { e.stopPropagation(); handleAddToList(item, 'watched'); }}>Seen</Button>
                            </div>
                        }
                    />
                ))}
            </div>
        </main>
    );
}
