import { useState, useEffect, useRef } from 'react';
import { GetRandomSongs } from "../../../../wailsjs/go/handlers/List";
import { GetStreamURL } from "../../../../wailsjs/go/handlers/Stream";
import { GetLyrics } from "../../../../wailsjs/go/handlers/Lyrics";
import { HasConfig } from "../../../../wailsjs/go/main/App";
import { dto } from "../../../../wailsjs/go/models";

export const useAppLogic = () => {
    const [isConfigured, setIsConfigured] = useState<boolean | null>(null);
    const [showSettings, setShowSettings] = useState<boolean>(false);
    const [showShutdownModal, setShowShutdownModal] = useState<boolean>(false);

    const [currentTheme, setCurrentTheme] = useState<string>(() => {
        return localStorage.getItem('yamw-theme') || 'emerald';
    });
    const [showThemePicker, setShowThemePicker] = useState<boolean>(false);

    useEffect(() => {
        localStorage.setItem('yamw-theme', currentTheme);
    }, [currentTheme]);

    const [songs, setSongs] = useState<dto.Song[]>([]);
    const [loading, setLoading] = useState(true);
    
    // Player state
    const [activeSong, setActiveSong] = useState<dto.Song | null>(null);
    const activeSongId = activeSong?.id || null;
    const [currentTime, setCurrentTime] = useState<number>(0);
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const [isPlayerOpen, setIsPlayerOpen] = useState<boolean>(false);
    const [loopMode, setLoopMode] = useState<number>(0); // 0 = off, 1 = all, 2 = one
    const [isMix, setIsMix] = useState<boolean>(false);
    const [volume, setVolume] = useState<number>(1);
    const [showVolume, setShowVolume] = useState<boolean>(false);
    
    // Lyrics State
    const [showLyrics, setShowLyrics] = useState<boolean>(false);
    const [lyricsData, setLyricsData] = useState<{time: number, text: string}[] | null>(null);
    const [isLyricsLoading, setIsLyricsLoading] = useState<boolean>(false);
    const [lyricsSongId, setLyricsSongId] = useState<string | null>(null);
    
    const audioRef = useRef<HTMLAudioElement>(null);

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = volume;
        }
    }, [volume]);

    useEffect(() => {
        HasConfig().then(has => {
            if (has) {
                setIsConfigured(true);
                fetchSongs();
            } else {
                setIsConfigured(false);
                setLoading(false);
            }
        }).catch(err => {
            console.error("Config check failed:", err);
            setIsConfigured(false);
            setLoading(false);
        });
    }, []);

    const fetchSongs = async () => {
        setLoading(true);
        try {
            const results = await GetRandomSongs();
            if (results) {
                setSongs(results);
            }
        } catch (err) {
            console.error("Error fetching songs:", err);
        } finally {
            setLoading(false);
        }
    };



    const fetchLyricsData = async (song: dto.Song) => {
        setIsLyricsLoading(true);
        try {
            const res = await GetLyrics(song.artist || "", song.title || "");
            if (res.syncedLyrics) {
                const lines = res.syncedLyrics.split('\n');
                const parsed = [];
                const timeRegex = /\[(\d+):(\d+\.\d+)\]/;
                for (const line of lines) {
                    const match = timeRegex.exec(line);
                    if (match) {
                        const mins = parseInt(match[1]);
                        const secs = parseFloat(match[2]);
                        const text = line.replace(timeRegex, '').trim();
                        parsed.push({ time: mins * 60 + secs, text });
                    }
                }
                setLyricsData(parsed);
            } else if (res.plainLyrics) {
                const lines = res.plainLyrics.split('\n').map(text => ({ time: -1, text }));
                setLyricsData([{ time: -1, text: "Lyrics not synced" }, ...lines]);
            } else if (res.instrumental) {
                setLyricsData([{ time: -1, text: "Instrumental" }]);
            } else {
                setLyricsData(null);
            }
        } catch (e) {
            console.error("Lyrics fetch error:", e);
            setLyricsData(null);
        }
        setIsLyricsLoading(false);
    };

    const handlePlaySong = async (song: dto.Song) => {
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
    };

    const handleToggleLyrics = (e?: React.MouseEvent) => {
        if (e) e.stopPropagation();
        const next = !showLyrics;
        setShowLyrics(next);
        if (next && activeSong && lyricsSongId !== activeSong.id) {
            setLyricsSongId(activeSong.id);
            fetchLyricsData(activeSong);
        }
    };

    const playNext = (e?: React.MouseEvent) => {
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
    };

    const playPrevious = (e?: React.MouseEvent) => {
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
    };

    const togglePlayPause = (e?: React.MouseEvent) => {
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
    };

    const handleTimeUpdate = () => {
        if (audioRef.current) setCurrentTime(audioRef.current.currentTime);
    };

    const handleEnded = () => {
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
    };

    const handleSeek = (e: React.MouseEvent<HTMLDivElement>, duration: number) => {
        if (audioRef.current) {
            const bounds = e.currentTarget.getBoundingClientRect();
            const percent = Math.max(0, Math.min(1, (e.clientX - bounds.left) / bounds.width));
            const newTime = percent * duration;
            audioRef.current.currentTime = newTime;
            setCurrentTime(newTime);
        }
    };



    const handleSetupSuccess = () => {
        setIsConfigured(true);
        setShowSettings(false);
        fetchSongs();
    };

    // --- Global Event Broadcasters & Listeners for Music Widget ---
    useEffect(() => {
        window.dispatchEvent(new CustomEvent('yamw-state', { 
            detail: { activeSong, isPlaying } 
        }));
    }, [activeSong, isPlaying]);

    useEffect(() => {
        const handlePlayPause = () => togglePlayPause();
        const handleNext = () => playNext();
        const handlePrev = () => playPrevious();

        window.addEventListener('yamw-cmd-toggle', handlePlayPause);
        window.addEventListener('yamw-cmd-next', handleNext);
        window.addEventListener('yamw-cmd-prev', handlePrev);

        return () => {
            window.removeEventListener('yamw-cmd-toggle', handlePlayPause);
            window.removeEventListener('yamw-cmd-next', handleNext);
            window.removeEventListener('yamw-cmd-prev', handlePrev);
        };
    }, [togglePlayPause, playNext, playPrevious]);
    // -------------------------------------------------------------

    return {
        isConfigured, setIsConfigured,
        showSettings, setShowSettings,
        showShutdownModal, setShowShutdownModal,
        currentTheme, setCurrentTheme,
        showThemePicker, setShowThemePicker,
        songs, setSongs, loading,
        activeSongId,
        currentTime, isPlaying, setIsPlaying,
        isPlayerOpen, setIsPlayerOpen,
        loopMode, setLoopMode,
        isMix, setIsMix,
        volume, setVolume,
        showVolume, setShowVolume,
        showLyrics, isLyricsLoading, lyricsData,
        audioRef, activeSong,
        handlePlaySong,
        handleToggleLyrics,
        playNext, playPrevious,
        togglePlayPause,
        handleTimeUpdate, handleEnded, handleSeek,
        handleSetupSuccess, fetchSongs
    };
};
