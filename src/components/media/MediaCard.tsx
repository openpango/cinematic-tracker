import React from 'react';
import Card from '../ui/Card';
import { useNavigate } from 'react-router-dom';
import './MediaCard.css';

export interface MediaItem {
    id: string;
    tmdb_id: number;
    title: string;
    poster_path: string | null;
    media_type: 'movie' | 'tv';
    year?: string;
}

interface MediaCardProps {
    item: MediaItem;
    onSelect?: (item: MediaItem) => void;
    actionNode?: React.ReactNode;
}

export default function MediaCard({ item, onSelect, actionNode }: MediaCardProps) {
    const navigate = useNavigate();

    const handleClick = () => {
        if (onSelect) {
            onSelect(item);
        } else {
            navigate(`/media/${item.media_type}/${item.tmdb_id}`);
        }
    };

    return (
        <Card
            className="media-card"
            onClick={handleClick}
        >
            <div
                className="media-poster"
                style={{
                    backgroundImage: item.poster_path
                        ? `url(https://image.tmdb.org/t/p/w342${item.poster_path})`
                        : 'linear-gradient(45deg, var(--border-color), transparent)'
                }}
            >
                {!item.poster_path && <span className="no-poster">No Image</span>}
            </div>

            <div className="media-info">
                <h3 className="media-title">{item.title}</h3>
                <p className="media-meta">
                    <span className="media-type">{item.media_type === 'movie' ? 'Movie' : 'TV Series'}</span>
                    {item.year && <span className="media-year">• {item.year}</span>}
                </p>
                {actionNode && <div className="media-actions">{actionNode}</div>}
            </div>
        </Card>
    );
}
