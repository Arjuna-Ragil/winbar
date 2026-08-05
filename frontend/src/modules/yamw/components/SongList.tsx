import { RefreshCw, GripVertical } from 'lucide-react';
import { useState } from 'react';
import { dto } from "../../../../wailsjs/go/models";
import { CoverImage } from "./CoverImage";
import { MarqueeText } from "./MarqueeText";
import { formatDuration } from "../utils/time";

interface SongListProps {
    songs: dto.Song[];
    setSongs: React.Dispatch<React.SetStateAction<dto.Song[]>>;
    activeSongId: string | null;
    isPlaying: boolean;
    loading: boolean;
    t: any;
    onPlaySong: (song: dto.Song) => void;
    onLoadMore: () => void;
}

export const SongList = ({ songs, setSongs, activeSongId, isPlaying, loading, t, onPlaySong, onLoadMore }: SongListProps) => {
    const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

    const handleDragStart = (e: React.DragEvent, index: number) => {
        setDraggedIndex(index);
        e.dataTransfer.effectAllowed = "move";
        const img = new Image();
        img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
        e.dataTransfer.setDragImage(img, 0, 0);
    };

    const handleDragOver = (e: React.DragEvent, index: number) => {
        e.preventDefault();
        if (draggedIndex === null || draggedIndex === index) return;

        const newSongs = [...songs];
        const draggedSong = newSongs[draggedIndex];

        newSongs.splice(draggedIndex, 1);
        newSongs.splice(index, 0, draggedSong);

        setDraggedIndex(index);
        setSongs(newSongs);
    };

    const handleDragEnd = () => {
        setDraggedIndex(null);
    };

    if (loading && songs.length === 0) {
        return (
            <div className={`flex flex-col items-center justify-center h-full gap-3 ${t.muted} animate-pulse`}>
                <p className="text-xl">LOADING...</p>
            </div>
        );
    }

    if (songs.length === 0) {
        return (
            <div className={`flex flex-col items-center justify-center h-full ${t.muted}`}>NO SONGS FOUND</div>
        );
    }

    return (
        <>
            {songs.map((song, index) => {
                const isActive = song.id === activeSongId;
                const isDragging = draggedIndex === index;
                return (
                    <div
                        key={song.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, index)}
                        onDragOver={(e) => handleDragOver(e, index)}
                        onDragEnd={handleDragEnd}
                        className={`flex gap-3 p-1.5 rounded cursor-pointer transition-all ${isActive ? `${t.bgActive} ${t.borderActive}` : `${t.bgHover} border-transparent`
                            } border ${isDragging ? 'opacity-30 scale-95' : ''}`}
                        onClick={() => onPlaySong(song)}
                    >
                        <div className={`cursor-grab flex self-center shrink-0 ${t.muted} hover:${t.base} active:cursor-grabbing`}>
                            <GripVertical size={16} />
                        </div>
                        <CoverImage id={song.id} className="w-10 h-10 object-cover shrink-0 rounded-sm shadow-sm pointer-events-none" t={t} />
                        <div className="flex flex-col min-w-0 flex-1 items-start pointer-events-none pr-2 overflow-hidden">
                            <MarqueeText
                                text={`${isPlaying && isActive ? "▶ " : ""}${song.title || "Unknown"}`}
                                className="text-lg flex items-start leading-tight mb-0.5"
                            />
                            <div className={`truncate text-sm opacity-70 leading-tight ${t.muted}`}>
                                {song.artist || "Unknown"}
                            </div>
                        </div>
                        <span className="text-sm shrink-0 opacity-80 px-1 pointer-events-none">
                            {formatDuration(song.duration)}
                        </span>
                    </div>
                );
            })}

            <div className="w-full pt-4 pb-16 flex justify-center">
                <button
                    onClick={(e) => { e.stopPropagation(); onLoadMore(); }}
                    disabled={loading}
                    className={`flex items-center gap-2 px-6 py-2 rounded-full border ${t.border} ${t.muted} hover:${t.base} ${t.bgHover} transition-colors cursor-pointer text-sm font-bold disabled:opacity-50`}
                >
                    <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
                    {loading ? "LOADING..." : "Reload Music List"}
                </button>
            </div>
        </>
    );
};
