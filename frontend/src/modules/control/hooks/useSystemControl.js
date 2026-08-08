import { useState, useEffect, useRef } from 'react';
import { GetVolume, SetVolume, GetBrightness, SetBrightness } from '../../../../wailsjs/go/handlers/ControlHandler.js';

export function useSystemControl() {
    const [volume, setVolume] = useState(50);
    const [brightness, setBrightness] = useState(50);
    const lastInteraction = useRef(0);

    useEffect(() => {
        const syncState = async () => {
            if (typeof GetVolume === 'function') {
                try {
                    const v = await GetVolume();
                    const b = await GetBrightness();
                    if (Date.now() - lastInteraction.current > 2000) {
                        setVolume(v);
                        setBrightness(b);
                    }
                } catch (e) { }
            }
        };
        syncState();

        const timer = setInterval(syncState, 1000);
        return () => clearInterval(timer);
    }, []);

    const handleVolumeChange = (e) => {
        lastInteraction.current = Date.now();
        const v = parseInt(e.target.value);
        setVolume(v);
        if (typeof SetVolume === 'function') SetVolume(v);
    };

    const handleBrightnessChange = (val) => {
        lastInteraction.current = Date.now();
        setBrightness(val);
        if (typeof SetBrightness === 'function') SetBrightness(val);
    };

    return {
        volume,
        brightness,
        handleVolumeChange,
        handleBrightnessChange
    };
}
