import { useSongs } from './useSongs';
import { useLyrics } from './useLyrics';
import { useAudioPlayer } from './useAudioPlayer';
import { useSettings } from './useSettings';

export const useAppLogic = () => {
    const { songs, setSongs, loading, setLoading, fetchSongs } = useSongs();

    const {
        isConfigured, setIsConfigured,
        showSettings, setShowSettings,
        showShutdownModal, setShowShutdownModal,
        currentTheme, setCurrentTheme,
        showThemePicker, setShowThemePicker,
        handleSetupSuccess
    } = useSettings(fetchSongs, setLoading);

    const {
        showLyrics,
        lyricsData, setLyricsData,
        isLyricsLoading,
        setLyricsSongId,
        fetchLyricsData, handleToggleLyrics
    } = useLyrics();

    const player = useAudioPlayer(
        songs,
        showLyrics,
        setLyricsSongId,
        setLyricsData,
        fetchLyricsData
    );

    return {
        isConfigured, setIsConfigured,
        showSettings, setShowSettings,
        showShutdownModal, setShowShutdownModal,
        currentTheme, setCurrentTheme,
        showThemePicker, setShowThemePicker,
        songs, setSongs, loading,

        activeSongId: player.activeSongId,
        currentTime: player.currentTime,
        isPlaying: player.isPlaying, setIsPlaying: player.setIsPlaying,
        isPlayerOpen: player.isPlayerOpen, setIsPlayerOpen: player.setIsPlayerOpen,
        loopMode: player.loopMode, setLoopMode: player.setLoopMode,
        isMix: player.isMix, setIsMix: player.setIsMix,
        volume: player.volume, setVolume: player.setVolume,
        showVolume: player.showVolume, setShowVolume: player.setShowVolume,
        audioRef: player.audioRef, activeSong: player.activeSong,
        handlePlaySong: player.handlePlaySong,
        playNext: player.playNext, playPrevious: player.playPrevious,
        togglePlayPause: player.togglePlayPause,
        handleTimeUpdate: player.handleTimeUpdate, handleEnded: player.handleEnded, handleSeek: player.handleSeek,

        showLyrics, isLyricsLoading, lyricsData,
        handleToggleLyrics: (e?: React.MouseEvent) => handleToggleLyrics(player.activeSong, e),

        handleSetupSuccess, fetchSongs
    };
};
