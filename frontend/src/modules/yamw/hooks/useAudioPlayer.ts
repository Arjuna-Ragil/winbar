import { useState, useEffect, useRef, useCallback } from 'react';
import { GetStreamURL } from "../../../../wailsjs/go/handlers/Stream";
import { dto } from "../../../../wailsjs/go/models";

export const useAudioPlayer = (
    songs: dto.Song[],
    showLyrics: boolean,
    setLyricsSongId: (id: string | null) => void,
    setLyricsData: (data: any) => void,
    fetchLyricsData: (song: dto.Song) => void
) => {
    const [activeSong, setActiveSong] = useState<dto.Song | null>(null);
    const activeSongId = activeSong?.id || null;
    const [currentTime, setCurrentTime] = useState<number>(0);
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const [isPlayerOpen, setIsPlayerOpen] = useState<boolean>(false);
    const [loopMode, setLoopMode] = useState<number>(0);
    const [isMix, setIsMix] = useState<boolean>(false);
    const [volume, setVolume] = useState<number>(1);
    const [showVolume, setShowVolume] = useState<boolean>(false);

    const audioRef = useRef<HTMLAudioElement>(null);

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = volume;
        }
    }, [volume]);

    const handlePlaySong = useCallback(async (song: dto.Song) => {
        setIsPlayerOpen(true);
        if (activeSongId === song.id) return;

        setLyricsData(null);
        if (showLyrics) {
            setLyricsSongId(song.id);
            fetchLyricsData(song);
        } else {
            setLyricsSongId(null);
        }

        try {
            const url = await GetStreamURL(song.id);
            if (audioRef.current) {
                audioRef.current.src = url;
                audioRef.current.play();
                setActiveSong(song);
                setIsPlaying(true);
            }
        } catch (err) {
            console.error("Failed to play song:", err);
        }
    }, [activeSongId, showLyrics, setLyricsData, setLyricsSongId, fetchLyricsData]);

    const playNext = useCallback((e?: React.MouseEvent) => {
        if (e) e.stopPropagation();
        if (isMix && songs.length > 0) {
            const randomIndex = Math.floor(Math.random() * songs.length);
            handlePlaySong(songs[randomIndex]);
            return;
        }
        if (songs.length > 0 && activeSongId) {
            const currentIndex = songs.findIndex(s => s.id === activeSongId);
            if (currentIndex !== -1) {
                const isLast = currentIndex === songs.length - 1;
                if (!isLast) {
                    handlePlaySong(songs[currentIndex + 1]);
                } else {
                    handlePlaySong(songs[0]);
                }
            } else {
                handlePlaySong(songs[0]);
            }
        }
    }, [isMix, songs, activeSongId, handlePlaySong]);

    const playPrevious = useCallback((e?: React.MouseEvent) => {
        if (e) e.stopPropagation();
        if (audioRef.current && audioRef.current.currentTime > 3) {
            audioRef.current.currentTime = 0;
            return;
        }
        if (songs.length > 0 && activeSongId) {
            const currentIndex = songs.findIndex(s => s.id === activeSongId);
            if (currentIndex > 0) {
                handlePlaySong(songs[currentIndex - 1]);
            } else {
                handlePlaySong(songs[songs.length - 1]);
            }
        }
    }, [songs, activeSongId, handlePlaySong]);

    const togglePlayPause = useCallback((e?: React.MouseEvent) => {
        if (e) e.stopPropagation();
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
                setIsPlaying(false);
            } else {
                audioRef.current.play();
                setIsPlaying(true);
            }
        }
    }, [isPlaying]);

    const handleTimeUpdate = useCallback(() => {
        if (audioRef.current) setCurrentTime(audioRef.current.currentTime);
    }, []);

    const handleEnded = useCallback(() => {
        if (loopMode === 2 && audioRef.current) {
            audioRef.current.play();
            return;
        }
        if (isMix && songs.length > 0) {
            const randomIndex = Math.floor(Math.random() * songs.length);
            handlePlaySong(songs[randomIndex]);
            return;
        }
        if (songs.length > 0 && activeSongId) {
            const currentIndex = songs.findIndex(s => s.id === activeSongId);
            if (currentIndex !== -1) {
                const isLast = currentIndex === songs.length - 1;
                if (!isLast) {
                    handlePlaySong(songs[currentIndex + 1]);
                    return;
                } else if (loopMode === 1) {
                    handlePlaySong(songs[0]);
                    return;
                }
            } else {
                handlePlaySong(songs[0]);
                return;
            }
        }
        setIsPlaying(false);
        setCurrentTime(0);
    }, [loopMode, isMix, songs, activeSongId, handlePlaySong]);

    const handleSeek = useCallback((e: React.MouseEvent<HTMLDivElement>, duration: number) => {
        if (audioRef.current) {
            const bounds = e.currentTarget.getBoundingClientRect();
            const percent = Math.max(0, Math.min(1, (e.clientX - bounds.left) / bounds.width));
            const newTime = percent * duration;
            audioRef.current.currentTime = newTime;
            setCurrentTime(newTime);
        }
    }, []);

    useEffect(() => {
        window.dispatchEvent(new CustomEvent('yamw-state', {
            detail: { activeSong, isPlaying }
        }));
    }, [activeSong, isPlaying]);

    useEffect(() => {
        const handlePlayPauseEvent = () => togglePlayPause();
        const handleNextEvent = () => playNext();
        const handlePrevEvent = () => playPrevious();

        window.addEventListener('yamw-cmd-toggle', handlePlayPauseEvent);
        window.addEventListener('yamw-cmd-next', handleNextEvent);
        window.addEventListener('yamw-cmd-prev', handlePrevEvent);

        return () => {
            window.removeEventListener('yamw-cmd-toggle', handlePlayPauseEvent);
            window.removeEventListener('yamw-cmd-next', handleNextEvent);
            window.removeEventListener('yamw-cmd-prev', handlePrevEvent);
        };
    }, [togglePlayPause, playNext, playPrevious]);

    return {
        activeSong, activeSongId, setActiveSong,
        currentTime, isPlaying, setIsPlaying,
        isPlayerOpen, setIsPlayerOpen,
        loopMode, setLoopMode,
        isMix, setIsMix,
        volume, setVolume,
        showVolume, setShowVolume,
        audioRef,
        handlePlaySong,
        playNext, playPrevious,
        togglePlayPause,
        handleTimeUpdate, handleEnded, handleSeek
    };
};
