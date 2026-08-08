import { useState, useCallback } from 'react';
import { GetRandomSongs } from "../../../../wailsjs/go/handlers/List";
import { dto } from "../../../../wailsjs/go/models";

export const useSongs = () => {
    const [songs, setSongs] = useState<dto.Song[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchSongs = useCallback(async () => {
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
    }, []);

    return { songs, setSongs, loading, setLoading, fetchSongs };
};
