import { useEffect, useState } from 'react';
import { GetServerStats } from '../../../../wailsjs/go/handlers/Server';

export function useServerStats() {
    const [stats, setStats] = useState({
        cpu_usage: 0,
        ram_usage: 0, ram_used: 0, ram_total: 0,
        disk_usage: 0, disk_used: 0, disk_total: 0
    });
    const [error, setError] = useState(null);
    const [refreshRate, setRefreshRate] = useState(5000);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const data = await GetServerStats();
                setStats(data);
                setError(null);
            } catch (err) {
                setError(err.message || 'Failed to fetch stats');
            }
        };

        fetchStats();
        const interval = setInterval(fetchStats, refreshRate);
        return () => clearInterval(interval);
    }, [refreshRate]);

    const formatBytes = (bytes) => {
        if (!bytes) return '0.0 GB';
        return (bytes / (1024 * 1024 * 1024)).toFixed(1) + ' GB';
    };

    return {
        stats,
        error,
        refreshRate,
        setRefreshRate,
        formatBytes
    };
}
