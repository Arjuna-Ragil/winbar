import { useState, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward } from 'lucide-react';
import { CoverImage } from '../modules/yamw/components/CoverImage';

export default function MusicWidget({ toggleOverlay }) {
    const [activeSong, setActiveSong] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);

    const t = { bgMuted: 'bg-black/20' };

    useEffect(() => {
        const handleState = (e) => {
            setActiveSong(e.detail.activeSong);
            setIsPlaying(e.detail.isPlaying);
        };

        window.addEventListener('yamw-state', handleState);

        return () => {
            window.removeEventListener('yamw-state', handleState);
        };
    }, []);

    const handlePlayPause = (e) => {
        e.stopPropagation();
        window.dispatchEvent(new CustomEvent('yamw-cmd-toggle'));
    };

    const handleNext = (e) => {
        e.stopPropagation();
        window.dispatchEvent(new CustomEvent('yamw-cmd-next'));
    };

    const handlePrev = (e) => {
        e.stopPropagation();
        window.dispatchEvent(new CustomEvent('yamw-cmd-prev'));
    };

    if (!activeSong) {
        return (
            <div
                className="widget cursor-pointer hover:bg-widget-hover px-2"
                onClick={() => toggleOverlay('home')}
                title="Open Music Player"
            >
                <div className="w-5 h-5 bg-black/20 rounded flex items-center justify-center shrink-0">
                    <Play size={12} className="ml-0.5 opacity-50" />
                </div>
                <span className="text-xs font-semibold opacity-50">Not Playing</span>
            </div>
        );
    }

    return (
        <div
            className="widget cursor-pointer hover:bg-widget-hover p-1! gap-2!"
            onClick={() => toggleOverlay('home')}
        >
            <CoverImage
                id={activeSong.id}
                className="w-6 h-6 rounded-sm object-cover shrink-0"
                t={t}
            />

            <div className="flex items-center gap-1 shrink-0 px-1 border-l border-widget-text/20">
                <button onClick={handlePrev} className="hover:text-white transition-colors">
                    <SkipBack size={14} />
                </button>
                <button onClick={handlePlayPause} className="hover:text-white transition-colors">
                    {isPlaying ? <Pause size={14} /> : <Play size={14} className="ml-0.5" />}
                </button>
                <button onClick={handleNext} className="hover:text-white transition-colors">
                    <SkipForward size={14} />
                </button>
            </div>
        </div>
    );
}
