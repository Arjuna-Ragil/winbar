import { useState, useCallback } from 'react';
import { GetLyrics } from "../../../../wailsjs/go/handlers/Lyrics";
import { dto } from "../../../../wailsjs/go/models";

export const useLyrics = () => {
    const [showLyrics, setShowLyrics] = useState<boolean>(false);
    const [lyricsData, setLyricsData] = useState<{ time: number, text: string }[] | null>(null);
    const [isLyricsLoading, setIsLyricsLoading] = useState<boolean>(false);
    const [lyricsSongId, setLyricsSongId] = useState<string | null>(null);

    const fetchLyricsData = useCallback(async (song: dto.Song) => {
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
                const lines = res.plainLyrics.split('\n').map((text: string) => ({ time: -1, text }));
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
    }, []);

    const handleToggleLyrics = useCallback((activeSong: dto.Song | null, e?: React.MouseEvent) => {
        if (e) e.stopPropagation();
        const next = !showLyrics;
        setShowLyrics(next);
        if (next && activeSong && lyricsSongId !== activeSong.id) {
            setLyricsSongId(activeSong.id);
            fetchLyricsData(activeSong);
        }
    }, [showLyrics, lyricsSongId, fetchLyricsData]);

    return {
        showLyrics, setShowLyrics,
        lyricsData, setLyricsData,
        isLyricsLoading,
        lyricsSongId, setLyricsSongId,
        fetchLyricsData, handleToggleLyrics
    };
};
