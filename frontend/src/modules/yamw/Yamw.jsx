import { Settings } from 'lucide-react';
import { SetupForm } from './components/SetupForm';
import { SongList } from './components/SongList';
import { MiniPlayer } from './components/MiniPlayer';
import { PlayerOverlay } from './components/PlayerOverlay';
import { useAppLogic } from './hooks/useAppLogic';
import { themes } from './constants/themes';

export default function YamwModule() {
    const appLogic = useAppLogic();
    const {
        isConfigured, currentTheme, isPlayerOpen,
        songs, loading, activeSong, activeSongId, isPlaying, loopMode,
        isMix, volume, showVolume, showLyrics, isLyricsLoading, lyricsData,
        audioRef, currentTime, showSettings, setShowSettings
    } = appLogic;

    const t = themes[currentTheme] || themes.emerald;

    if (isConfigured === false) {
        return (
            <div className={`w-76.5 h-96 flex flex-col relative text-lg pointer-events-auto ${t.base} ${t.selection}`}>
                <div className="absolute inset-0 pointer-events-none opacity-10 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.8)_50%)] bg-size-[100%_4px] z-50"></div>
                <header className={`px-3 py-2 border-b ${t.border} flex justify-between items-center bg-black/40 shrink-0 select-none`}>
                    <span className="text-xl font-bold tracking-wider">YAMW</span>
                    <span className="text-sm tracking-widest opacity-70">SETUP</span>
                </header>
                <div className="flex-1 overflow-auto relative z-10 hide-scrollbar">
                    <SetupForm
                        t={t}
                        onSuccess={appLogic.handleSetupSuccess}
                    />
                </div>
            </div>
        );
    }

    return (
        <div className={`w-76.5 h-96 flex flex-col relative text-lg pointer-events-auto ${t.base} ${t.selection}`}>
            <div className="absolute inset-0 pointer-events-none opacity-10 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.8)_50%)] bg-size-[100%_4px] z-50" />

            <header className={`px-3 py-2 flex justify-between items-center bg-black/40 shrink-0 select-none z-10 relative`}>
                <span className="text-xl font-bold tracking-wider">YAMW.exe</span>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setShowSettings(!showSettings)}
                        className={`p-1 rounded ${t.bgHover} transition-colors`}
                    >
                        <Settings size={18} />
                    </button>
                </div>
            </header>

            {showSettings && (
                <div className="absolute inset-0 z-50 bg-black/40 backdrop-blur-xl flex flex-col">
                    <header className={`px-3 py-2 border-b ${t.border} flex justify-between items-center bg-black/40 shrink-0 select-none`}>
                        <span className="text-xl font-bold tracking-wider">YAMW.exe</span>
                        <span className="text-sm tracking-widest opacity-70">SETTINGS</span>
                    </header>
                    <div className="flex-1 overflow-auto hide-scrollbar">
                        <SetupForm
                            t={t}
                            onSuccess={() => setShowSettings(false)}
                            onClose={() => setShowSettings(false)}
                            isOverlay={true}
                        />
                    </div>
                </div>
            )}

            <div className="flex-1 overflow-auto hide-scrollbar relative z-10">
                <SongList
                    songs={songs}
                    setSongs={appLogic.setSongs}
                    activeSongId={activeSongId}
                    isPlaying={isPlaying}
                    loading={loading}
                    t={t}
                    onPlaySong={appLogic.handlePlaySong}
                    onLoadMore={appLogic.fetchSongs}
                />
            </div>

            <audio
                ref={audioRef}
                onTimeUpdate={appLogic.handleTimeUpdate}
                onEnded={appLogic.handleEnded}
            />

            {activeSong && (
                <MiniPlayer
                    activeSong={activeSong}
                    t={t}
                    isPlayerOpen={isPlayerOpen}
                    isPlaying={isPlaying}
                    setIsPlayerOpen={appLogic.setIsPlayerOpen}
                    togglePlayPause={appLogic.togglePlayPause}
                />
            )}

            {activeSong && (
                <PlayerOverlay
                    t={t}
                    activeSong={activeSong}
                    isPlayerOpen={isPlayerOpen}
                    setIsPlayerOpen={appLogic.setIsPlayerOpen}
                    showLyrics={showLyrics}
                    isLyricsLoading={isLyricsLoading}
                    lyricsData={lyricsData}
                    currentTime={currentTime}
                    isPlaying={isPlaying}
                    isMix={isMix}
                    loopMode={loopMode}
                    volume={volume}
                    showVolume={showVolume}
                    setShowVolume={appLogic.setShowVolume}
                    setVolume={appLogic.setVolume}
                    setIsMix={appLogic.setIsMix}
                    setLoopMode={appLogic.setLoopMode}
                    handleSeek={appLogic.handleSeek}
                    togglePlayPause={appLogic.togglePlayPause}
                    playNext={appLogic.playNext}
                    playPrevious={appLogic.playPrevious}
                    onToggleLyrics={appLogic.handleToggleLyrics}
                />
            )}
        </div>
    );
}
