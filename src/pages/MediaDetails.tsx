import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchMediaDetails, TMDBDetail } from '../lib/tmdb';
import Button from '../components/ui/Button';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';

export default function MediaDetails() {
    const { type, id } = useParams<{ type: 'movie' | 'tv', id: string }>();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [detail, setDetail] = useState<TMDBDetail | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadDetails() {
            if (!type || !id) return;
            setLoading(true);
            const data = await fetchMediaDetails(id, type);
            setDetail(data);
            setLoading(false);
        }
        loadDetails();
    }, [type, id]);

    const handleAddToList = async (status: 'to_watch' | 'watched') => {
        if (!user || !detail) return;

        try {
            const { data: existingMedia } = await supabase.from('media').select('*').eq('tmdb_id', detail.id).limit(1);
            let localMediaId;

            if (!existingMedia || existingMedia.length === 0) {
                const title = detail.title || detail.name || 'Unknown';
                const year = detail.release_date ? detail.release_date.split('-')[0] : (detail.first_air_date ? detail.first_air_date.split('-')[0] : undefined);

                const { data: newMedia, error: mediaError } = await supabase.from('media').insert([{
                    tmdb_id: detail.id,
                    title: title,
                    media_type: type,
                    poster_path: detail.poster_path,
                    release_year: year
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
            alert(`Added to your ${status === 'to_watch' ? 'To Watch' : 'Watched'} list!`);
        } catch (e: any) {
            console.error(e);
            alert(e.message);
        }
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: 'var(--bg-primary)' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Loading details...</span>
            </div>
        );
    }

    if (!detail) {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh', gap: '16px' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Failed to load media details.</span>
                <Button variant="secondary" onClick={() => navigate(-1)}>Go Back</Button>
            </div>
        );
    }

    const backdropUrl = detail.backdrop_path ? `https://image.tmdb.org/t/p/w780${detail.backdrop_path}` : '';
    const displayTitle = detail.title || detail.name;
    const year = detail.release_date ? detail.release_date.split('-')[0] : (detail.first_air_date ? detail.first_air_date.split('-')[0] : '');
    const runtimeStr = detail.runtime ? `${Math.floor(detail.runtime / 60)}h ${detail.runtime % 60}m` : (detail.number_of_seasons ? `${detail.number_of_seasons} Seasons` : '');

    return (
        <main style={{
            background: 'var(--bg-primary)',
            minHeight: '100vh',
            paddingBottom: 'calc(100px + var(--safe-bottom))',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            zIndex: 100 // Covers the rest of the application, including BottomNav slightly above
        }}>

            {/* Top Bar with distinct Frosted Glass Back Button */}
            <div style={{
                position: 'fixed',
                top: 'calc(16px + var(--safe-top))',
                left: 'calc(16px + var(--safe-left))',
                zIndex: 110,
                background: 'rgba(0,0,0,0.5)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
            }} onClick={() => navigate(-1)}>
                <span style={{ color: 'white', fontSize: '24px', lineHeight: '24px' }}>‹</span>
            </div>

            {/* Hero Backdrop Img */}
            <div style={{
                width: '100%',
                height: '40vh',
                position: 'relative',
                backgroundImage: `url(${backdropUrl})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundColor: 'var(--bg-secondary)'
            }}>
                {/* Gradient fade into typical bg color */}
                <div style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    width: '100%',
                    height: '50%',
                    background: 'linear-gradient(to top, var(--bg-primary) 0%, transparent 100%)'
                }} />
            </div>

            {/* Content Container spanning full screen width locally */}
            <div style={{ padding: '0 calc(20px + var(--safe-right)) 0 calc(20px + var(--safe-left))', marginTop: '-40px', position: 'relative', zIndex: 10 }}>

                <h1 style={{ fontSize: '32px', fontWeight: 700, lineHeight: 1.1, marginBottom: '8px' }}>
                    {displayTitle}
                </h1>

                <div style={{ display: 'flex', gap: '12px', alignItems: 'center', color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '20px' }}>
                    {year && <span>{year}</span>}
                    {year && runtimeStr && <span>•</span>}
                    {runtimeStr && <span>{runtimeStr}</span>}
                    {detail.vote_average > 0 && <span>• ⭐ {detail.vote_average.toFixed(1)}</span>}
                </div>

                <div style={{ display: 'flex', gap: '8px', marginBottom: '32px' }}>
                    <Button variant="primary" fullWidth onClick={() => handleAddToList('to_watch')} style={{ padding: '16px' }}>Top Watch Queue</Button>
                    <Button variant="secondary" fullWidth onClick={() => handleAddToList('watched')} style={{ padding: '16px' }}>Mark as Seen</Button>
                </div>

                <div style={{ marginBottom: '32px' }}>
                    <h2 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '12px' }}>Synopsis</h2>
                    <p style={{ color: 'rgb(140, 140, 145)', lineHeight: 1.6, fontSize: '15px' }}>
                        {detail.overview || 'No synopsis available.'}
                    </p>
                </div>

                {detail.genres && detail.genres.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '32px' }}>
                        {detail.genres.map(g => (
                            <div key={g.id} style={{
                                padding: '6px 12px',
                                borderRadius: '100px',
                                backgroundColor: 'var(--bg-secondary)',
                                fontSize: '13px',
                                color: 'var(--text-primary)',
                                border: '1px solid var(--border-color)'
                            }}>
                                {g.name}
                            </div>
                        ))}
                    </div>
                )}

                {detail.credits?.cast && detail.credits.cast.length > 0 && (
                    <div>
                        <h2 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '16px' }}>Cast</h2>
                        <div style={{
                            display: 'flex',
                            overflowX: 'auto',
                            gap: '16px',
                            paddingBottom: '20px',
                            WebkitOverflowScrolling: 'touch',
                            margin: '0 calc(-20px - var(--safe-left)) 0 calc(-20px - var(--safe-right))',
                            paddingLeft: 'calc(20px + var(--safe-left))'
                        }}>
                            {detail.credits.cast.slice(0, 10).map(member => (
                                <div key={member.id} style={{ width: '100px', flexShrink: 0 }}>
                                    <div style={{
                                        width: '100px',
                                        height: '100px',
                                        borderRadius: '50%',
                                        backgroundColor: 'var(--bg-secondary)',
                                        backgroundImage: member.profile_path ? `url(https://image.tmdb.org/t/p/w185${member.profile_path})` : 'none',
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center',
                                        marginBottom: '8px'
                                    }} />
                                    <p style={{ fontSize: '13px', fontWeight: 500, lineHeight: 1.2, textAlign: 'center', marginBottom: '2px' }}>{member.name}</p>
                                    <p style={{ fontSize: '12px', color: 'var(--text-secondary)', textAlign: 'center', lineHeight: 1.2 }}>{member.character}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
}
