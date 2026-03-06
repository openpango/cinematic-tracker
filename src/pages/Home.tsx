import { useState, useEffect } from 'react';
import MediaCard, { MediaItem } from '../components/media/MediaCard';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';
import BrandLogo from '../components/ui/BrandLogo';

export default function Home() {
    const { user } = useAuth();
    const [toWatch, setToWatch] = useState<(MediaItem & { list_item_id: string })[]>([]);
    const [watched, setWatched] = useState<(MediaItem & { list_item_id: string })[]>([]);

    // Tag Filtering State
    const [tags, setTags] = useState<{ id: string, name: string, color: string }[]>([]);
    const [itemTags, setItemTags] = useState<{ list_item_id: string, tag_id: string }[]>([]);
    const [selectedTag, setSelectedTag] = useState<string | null>(null);
    const [schemaError, setSchemaError] = useState(false);

    useEffect(() => {
        async function fetchLists() {
            if (!user) return;
            const [listRes, tagsRes, itemTagsRes] = await Promise.all([
                supabase
                    .from('list_items')
                    .select('id, status, media (id, tmdb_id, title, media_type, poster_path, release_year)')
                    .eq('user_id', user.id),
                supabase
                    .from('tags')
                    .select('*')
                    .eq('user_id', user.id),
                supabase
                    .from('item_tags')
                    .select('list_item_id, tag_id')
            ]);

            if (listRes.error) {
                if (listRes.error.code === 'PGRST205') {
                    setSchemaError(true);
                } else {
                    console.error(listRes.error);
                }
                return;
            }

            if (tagsRes.data) setTags(tagsRes.data);
            if (itemTagsRes.data) setItemTags(itemTagsRes.data);

            if (listRes.data) {
                const formattedToWatch = listRes.data
                    .filter(item => item.status === 'to_watch' && item.media)
                    .map(item => ({
                        list_item_id: item.id,
                        id: (item.media as any).id,
                        tmdb_id: (item.media as any).tmdb_id,
                        title: (item.media as any).title,
                        media_type: (item.media as any).media_type,
                        poster_path: (item.media as any).poster_path,
                        year: (item.media as any).release_year
                    }));

                const formattedWatched = listRes.data
                    .filter(item => item.status === 'watched' && item.media)
                    .map(item => ({
                        list_item_id: item.id,
                        id: (item.media as any).id,
                        tmdb_id: (item.media as any).tmdb_id,
                        title: (item.media as any).title,
                        media_type: (item.media as any).media_type,
                        poster_path: (item.media as any).poster_path,
                        year: (item.media as any).release_year
                    }));

                setToWatch(formattedToWatch);
                setWatched(formattedWatched);
            }
        }

        fetchLists();
    }, [user]);

    return (
        <main style={{ padding: '20px calc(20px + var(--safe-right)) 100px calc(20px + var(--safe-left))' }}>
            {schemaError && (
                <div style={{ background: '#ef4444', color: 'white', padding: '20px', borderRadius: '16px', marginBottom: '24px', marginTop: 'calc(20px + var(--safe-top))', boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)' }}>
                    <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '8px' }}>Database Schema Missing</h2>
                    <p style={{ opacity: 0.9, lineHeight: 1.5, fontSize: '15px' }}>
                        The PostgREST service returned a 404 (PGRST205) because the <code>list_items</code> table does not exist.
                        Please copy the contents of <code>supabase_schema.sql</code> and execute it within your Supabase SQL Editor.
                    </p>
                </div>
            )}

            <div style={{ marginBottom: '24px', marginTop: schemaError ? '0px' : 'calc(20px + var(--safe-top))' }}>
                <BrandLogo />
            </div>

            <h1 style={{ fontSize: '34px', fontWeight: 700, marginBottom: '20px' }}>
                Up Next
            </h1>

            {/* Tag Filtering Rail */}
            {tags.length > 0 && (
                <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', marginBottom: '24px', paddingBottom: '8px', WebkitOverflowScrolling: 'touch' }}>
                    <button
                        onClick={() => setSelectedTag(null)}
                        style={{
                            padding: '6px 14px',
                            borderRadius: '100px',
                            border: 'none',
                            background: selectedTag === null ? 'var(--text-primary)' : 'var(--bg-secondary)',
                            color: selectedTag === null ? 'var(--bg-primary)' : 'var(--text-primary)',
                            cursor: 'pointer',
                            fontWeight: 600,
                            fontSize: '13px',
                            whiteSpace: 'nowrap',
                            transition: 'all 0.2s ease'
                        }}
                    >
                        All
                    </button>
                    {tags.map(tag => (
                        <button
                            key={tag.id}
                            onClick={() => setSelectedTag(tag.id)}
                            style={{
                                padding: '6px 14px',
                                borderRadius: '100px',
                                border: selectedTag === tag.id ? `1px solid ${tag.color}` : '1px solid transparent',
                                background: selectedTag === tag.id ? `${tag.color}20` : 'var(--bg-secondary)',
                                color: selectedTag === tag.id ? tag.color : 'var(--text-primary)',
                                cursor: 'pointer',
                                fontWeight: 600,
                                fontSize: '13px',
                                whiteSpace: 'nowrap',
                                transition: 'all 0.2s ease'
                            }}
                        >
                            # {tag.name}
                        </button>
                    ))}
                </div>
            )}

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
                gap: '16px',
                marginBottom: '40px'
            }}>
                {(() => {
                    const displayToWatch = selectedTag
                        ? toWatch.filter(item => itemTags.some(it => it.list_item_id === item.list_item_id && it.tag_id === selectedTag))
                        : toWatch;

                    if (displayToWatch.length === 0) {
                        return <p style={{ color: 'var(--text-secondary)' }}>{selectedTag ? 'No items found with this tag.' : 'Nothing in your queue yet.'}</p>;
                    }

                    return displayToWatch.map((item) => (
                        <MediaCard
                            key={item.list_item_id}
                            item={item}
                        />
                    ));
                })()}
            </div>

            <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '16px' }}>Recently Watched</h2>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
                gap: '16px',
                marginBottom: '40px'
            }}>
                {watched.length === 0 && <p style={{ color: 'var(--text-secondary)' }}>Your watched history will appear here.</p>}
                {watched.map((item) => (
                    <MediaCard
                        key={item.id}
                        item={item}
                    />
                ))}
            </div>
        </main>
    );
}
