import { useState, useEffect } from 'react';
import { HasConfig } from "../../../../wailsjs/go/main/App";

export const useSettings = (fetchSongs: () => void, setLoading: (l: boolean) => void) => {
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
    }, [fetchSongs, setLoading]);

    const handleSetupSuccess = () => {
        setIsConfigured(true);
        setShowSettings(false);
        fetchSongs();
    };

    return {
        isConfigured, setIsConfigured,
        showSettings, setShowSettings,
        showShutdownModal, setShowShutdownModal,
        currentTheme, setCurrentTheme,
        showThemePicker, setShowThemePicker,
        handleSetupSuccess
    };
};
