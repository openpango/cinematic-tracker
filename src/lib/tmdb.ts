const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

export async function searchMedia(query: string) {
    if (!query) return [];
    if (!TMDB_API_KEY || TMDB_API_KEY === 'your_tmdb_api_key_here') {
        console.error('Missing VITE_TMDB_API_KEY in .env');
        return [];
    }

    const response = await fetch(`${TMDB_BASE_URL}/search/multi?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}&language=en-US&page=1&include_adult=false`);
    if (!response.ok) throw new Error('Failed to fetch from TMDB');

    const data = await response.json();

    // Transform TMDB response strictly to our MediaItem interface
    return data.results
        .filter((item: any) => item.media_type === 'movie' || item.media_type === 'tv')
        .map((item: any) => ({
            id: String(item.id), // Our internal local UI ID mapping for now
            tmdb_id: item.id,
            title: item.title || item.name,
            media_type: item.media_type,
            year: item.release_date ? item.release_date.split('-')[0] : (item.first_air_date ? item.first_air_date.split('-')[0] : undefined),
            poster_path: item.poster_path
        }));
}

export interface TMDBDetail {
    id: number;
    title?: string;
    name?: string;
    overview: string;
    backdrop_path: string | null;
    poster_path: string | null;
    runtime?: number;
    number_of_episodes?: number;
    number_of_seasons?: number;
    vote_average: number;
    release_date?: string;
    first_air_date?: string;
    genres: { id: number; name: string }[];
    credits: {
        cast: { id: number; name: string; character: string; profile_path: string | null }[];
    };
}

export async function fetchMediaDetails(id: string | number, media_type: 'movie' | 'tv'): Promise<TMDBDetail | null> {
    if (!TMDB_API_KEY) return null;

    const response = await fetch(`${TMDB_BASE_URL}/${media_type}/${id}?api_key=${TMDB_API_KEY}&language=en-US&append_to_response=credits`);

    if (!response.ok) {
        console.error(`Failed to fetch details for ${media_type} ${id}`);
        return null;
    }

    return await response.json();
}
