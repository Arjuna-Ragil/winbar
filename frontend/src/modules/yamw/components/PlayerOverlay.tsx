import { useEffect, useRef } from 'react';
import { Shuffle, Repeat, Play, Pause, Repeat1, Volume2, VolumeX, Mic2, SkipBack, SkipForward } from 'lucide-react';
import { dto } from "../../../../wailsjs/go/models";
import { CoverImage } from "./CoverImage";
import { MarqueeText } from "./MarqueeText";
import { formatDuration } from "../utils/time";

interface PlayerOverlayProps {
    t: any;
    activeSong: dto.Song;
    isPlayerOpen: boolean;
    setIsPlayerOpen: (open: boolean) => void;
    showLyrics: boolean;
    isLyricsLoading: boolean;
    lyricsData: { time: number, text: string }[] | null;
    currentTime: number;
    isPlaying: boolean;
    isMix: boolean;
    loopMode: number;
    volume: number;
    showVolume: boolean;
    setShowVolume: (show: boolean) => void;
    setVolume: (v: number) => void;
    setIsMix: (mix: boolean) => void;
    setLoopMode: (callback: (prev: number) => number) => void;
    handleSeek: (e: React.MouseEvent<HTMLDivElement>, duration: number) => void;
    togglePlayPause: (e?: React.MouseEvent) => void;
    playNext: (e?: React.MouseEvent) => void;
    playPrevious: (e?: React.MouseEvent) => void;
    onToggleLyrics: (e?: React.MouseEvent) => void;
}

export const PlayerOverlay = ({
    t, activeSong, isPlayerOpen, setIsPlayerOpen, showLyrics, isLyricsLoading, lyricsData,
    currentTime, isPlaying, isMix, loopMode, volume, showVolume, setShowVolume, setVolume,
    setIsMix, setLoopMode, handleSeek, togglePlayPause, playNext, playPrevious, onToggleLyrics
}: PlayerOverlayProps) => {

    const activeLyricRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (activeLyricRef.current && showLyrics && isPlayerOpen) {
            activeLyricRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }, [currentTime, showLyrics, isPlayerOpen]);

    return (
        <div className={`absolute bottom-0 left-0 w-full h-85 bg-black/95 backdrop-blur-xl border-t ${t.borderLight} z-40 transition-transform duration-300 flex flex-col p-4 [--wails-draggable:no-drag] ${isPlayerOpen ? 'translate-y-0' : 'translate-y-full'}`}>

            <button
                className={`absolute top-2 right-3 ${t.muted} hover:${t.accent} text-[1.5rem] transition-colors cursor-pointer p-1`}
                onClick={() => setIsPlayerOpen(false)}
                title="Close Player"
            >
                ▼
            </button>

            <div className="flex flex-col flex-1 w-full min-h-0 items-center mt-6">
                {showLyrics ? (
                    <div className="flex-1 w-full overflow-y-auto hide-scrollbar mb-4 flex flex-col items-center pt-2 relative min-h-0 mask-[linear-gradient(to_bottom,transparent,black_15%,black_85%,transparent)]">
                        {isLyricsLoading ? (
                            <div className={`mt-20 animate-pulse ${t.muted}`}>Loading Lyrics...</div>
                        ) : lyricsData ? (
                            <div className="w-full space-y-4 px-2 text-center pb-32 pt-20">
                                {lyricsData.map((l, i) => {
                                    const nextTime = lyricsData[i + 1]?.time ?? Infinity;
                                    const isActive = l.time >= 0 && currentTime >= l.time && currentTime < nextTime;
                                    return (
                                        <div
                                            key={i}
                                            ref={isActive ? activeLyricRef : null}
                                            className={`transition-all duration-300 origin-center ${isActive ? `${t.accent} text-base font-bold scale-105 drop-shadow-lg` : `${t.muted} text-base opacity-70`}`}
                                        >
                                            {l.text || "♪"}
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className={`mt-20 ${t.muted}`}>No Lyrics Found</div>
                        )}
                    </div>
                ) : (
                    <>
                        <CoverImage id={activeSong.id} className={`w-25 h-25 object-cover rounded-md ${t.shadow} mb-6 border-2 ${t.border}`} t={t} />

                        <div className="text-center w-full min-w-0 mb-6 px-4 shrink-0">
                            <MarqueeText text={activeSong.title || "Unknown"} className={`text-2xl font-bold ${t.accent} mb-2`} />
                            <div className={`truncate text-xl ${t.muted}`}>{activeSong.artist || "Unknown"}</div>
                        </div>
                    </>
                )}

                <div className={`w-full flex items-center gap-3 text-sm ${t.muted} mb-6 px-1`}>
                    <span>{formatDuration(currentTime)}</span>
                    <div
                        className="flex-1 py-2 -my-2 cursor-pointer flex items-center group"
                        onClick={(e) => handleSeek(e, activeSong.duration)}
                    >
                        <div className={`w-full h-1.5 ${t.bgDark} rounded-full overflow-hidden transition-all group-hover:h-2`}>
                            <div
                                className={`h-full ${t.dot} rounded-full transition-all duration-100`}
                                style={{ width: `${activeSong.duration ? (currentTime / activeSong.duration) * 100 : 0}%` }}
                            ></div>
                        </div>
                    </div>
                    <span>{formatDuration(activeSong.duration)}</span>
                </div>

                <div className={`flex items-center justify-between w-full px-1 ${t.accent} mt-auto mb-2 relative`}>
                    <button
                        className={`transition-colors cursor-pointer ${showLyrics ? t.accent : `${t.dark} hover:${t.muted}`}`}
                        onClick={onToggleLyrics}
                    >
                        <Mic2 size={24} />
                    </button>
                    <button
                        className={`transition-colors cursor-pointer ${isMix ? t.accent : `${t.dark} hover:${t.muted}`}`}
                        onClick={(e) => { e.stopPropagation(); setIsMix(!isMix); }}
                    >
                        <Shuffle size={24} />
                    </button>
                    <button
                        className={`transition-transform hover:scale-110 cursor-pointer ${t.dark} hover:${t.muted}`}
                        onClick={playPrevious}
                    >
                        <SkipBack size={24} />
                    </button>
                    <button
                        className={`hover:scale-110 transition-transform ${t.base} hover:${t.accent} flex items-center justify-center w-12 h-12 cursor-pointer`}
                        onClick={togglePlayPause}
                    >
                        {isPlaying ? <Pause size={36} /> : <Play size={36} className="ml-1" />}
                    </button>
                    <button
                        className={`transition-transform hover:scale-110 cursor-pointer ${t.dark} hover:${t.muted}`}
                        onClick={playNext}
                    >
                        <SkipForward size={24} />
                    </button>
                    <button
                        className={`transition-colors cursor-pointer ${loopMode !== 0 ? t.accent : `${t.dark} hover:${t.muted}`}`}
                        onClick={(e) => { e.stopPropagation(); setLoopMode((prev) => (prev + 1) % 3); }}
                    >
                        {loopMode === 2 ? <Repeat1 size={24} /> : <Repeat size={24} />}
                    </button>
                    <div className="relative flex items-center">
                        <button
                            className={`transition-colors cursor-pointer ${showVolume ? t.base : `${t.dark} hover:${t.muted}`}`}
                            onClick={(e) => { e.stopPropagation(); setShowVolume(!showVolume); }}
                        >
                            {volume === 0 ? <VolumeX size={24} /> : <Volume2 size={24} />}
                        </button>
                        {showVolume && (
                            <div
                                className={`absolute bottom-full -right-2.5 mb-3 p-3 bg-slate-950 border ${t.border} rounded-lg shadow-2xl z-50 flex flex-col items-center gap-2`}
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div className={`text-xs ${t.muted} font-bold`}>{Math.round(volume * 100)}%</div>
                                <input
                                    type="range"
                                    min="0" max="1" step="0.01"
                                    value={volume}
                                    onChange={(e) => setVolume(parseFloat(e.target.value))}
                                    className={`w-24 h-1.5 ${t.bgDark} rounded-lg appearance-none cursor-pointer ${t.accentColor}`}
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
