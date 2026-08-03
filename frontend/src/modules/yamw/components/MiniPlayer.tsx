import { Play, Pause } from 'lucide-react';
import { dto } from "../../../../wailsjs/go/models";
import { CoverImage } from "./CoverImage";

interface MiniPlayerProps {
    activeSong: dto.Song;
    t: any;
    isPlayerOpen: boolean;
    isPlaying: boolean;
    setIsPlayerOpen: (open: boolean) => void;
    togglePlayPause: (e?: React.MouseEvent) => void;
}

export const MiniPlayer = ({ activeSong, t, isPlayerOpen, isPlaying, setIsPlayerOpen, togglePlayPause }: MiniPlayerProps) => {
    return (
        <div 
            className={`absolute bottom-0 left-0 w-full p-2 bg-slate-950/95 backdrop-blur-xl border-t ${t.borderLight} z-30 cursor-pointer flex items-center gap-3 shadow-[0_-5px_15px_rgba(0,0,0,0.5)] transition-transform duration-300 [--wails-draggable:no-drag] ${isPlayerOpen ? 'translate-y-full' : 'translate-y-0'}`}
            onClick={() => setIsPlayerOpen(true)}
        >
            <CoverImage id={activeSong.id} className="w-10 h-10 rounded-sm object-cover shrink-0" t={t} />
            <div className="flex flex-col min-w-0 flex-1">
                <div className={`truncate text-sm font-bold ${t.accent}`}>{activeSong.title || "Unknown"}</div>
                <div className={`truncate text-xs ${t.muted}`}>{activeSong.artist || "Unknown"}</div>
            </div>
            <button 
                className={`mr-2 shrink-0 ${t.base} hover:${t.accent} transition-transform hover:scale-110 cursor-pointer`}
                onClick={(e) => { e.stopPropagation(); togglePlayPause(e); }}
            >
                {isPlaying ? <Pause size={20} /> : <Play size={20} className="ml-0.5" />}
            </button>
        </div>
    );
};
