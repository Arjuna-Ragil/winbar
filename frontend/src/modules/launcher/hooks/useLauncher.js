import { useState, useEffect } from 'react';
import { GetApps, AddApp, RemoveApp, LaunchApp } from '../../../../wailsjs/go/handlers/Launcher';
import { EventsEmit } from '../../../../wailsjs/runtime/runtime';

export function useLauncher() {
    const [apps, setApps] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchApps();
    }, []);

    const fetchApps = async () => {
        setLoading(true);
        try {
            const result = await GetApps();
            setApps(result || []);
        } catch (err) {
            console.error("Failed to load apps:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleAddApp = async () => {
        try {
            const newApp = await AddApp();
            if (newApp) {
                setApps([...apps, newApp]);
            }
        } catch (err) {
            console.error("Failed to add app:", err);
        }
    };

    const handleRemoveApp = async (path, e) => {
        if (e) e.stopPropagation();
        try {
            const success = await RemoveApp(path);
            if (success) {
                setApps(apps.filter(app => app.path !== path));
            }
        } catch (err) {
            console.error("Failed to remove app:", err);
        }
    };

    const handleLaunch = async (path) => {
        try {
            await LaunchApp(path);
            EventsEmit("toggle_dashboard");
        } catch (err) {
            console.error("Failed to launch app:", err);
        }
    };

    return {
        apps,
        loading,
        handleAddApp,
        handleRemoveApp,
        handleLaunch
    };
}
