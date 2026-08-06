import { useEffect, useState } from 'react';
import { GetServerStats } from '../../../wailsjs/go/handlers/Server';

const CpuIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#3b82f6]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
    </svg>
);

const RamIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#a855f7]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
    </svg>
);

const DiskIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#f97316]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
    </svg>
);

const StatCard = ({ icon, label, value, subtext, color }) => (
    <div className="bg-[#111827] border border-white/5 rounded-2xl relative overflow-hidden flex flex-col items-center p-5 shadow-lg flex-1 min-w-35">
        <div className={`absolute top-0 left-6 h-1 w-12 rounded-full`} style={{ backgroundColor: color }}></div>
        <div className="mb-2 mt-1">
            {icon}
        </div>
        <span className="text-sm font-semibold text-white/50 tracking-wider mb-1 uppercase">{label}</span>
        <span className="text-2xl font-bold text-white mb-1">{(value || 0).toFixed(1)}<span className="text-base text-white/40 ml-1">%</span></span>
        {subtext ? (
            <span className="text-xs text-white/40 font-medium">{subtext}</span>
        ) : (
            <span className="text-xs text-transparent select-none">placeholder</span>
        )}
    </div>
);

const ServerModule = () => {
    const [stats, setStats] = useState({ cpu_usage: 0, ram_usage: 0, disk_usage: 0 });
    const [error, setError] = useState(null);

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
        const interval = setInterval(fetchStats, 5000);
        return () => clearInterval(interval);
    }, []);

    const formatBytes = (bytes) => {
        if (!bytes) return '0.0 GB';
        return (bytes / (1024 * 1024 * 1024)).toFixed(1) + ' GB';
    };

    return (
        <div className="p-6 bg-[#090b14] backdrop-blur-md rounded-2xl w-90 shadow-2xl border border-white/5 text-white font-sans flex flex-col gap-4">
            <h2 className="text-xl font-bold flex items-center justify-between mb-2">
                System Monitor
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white/40 cursor-pointer hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
            </h2>
            {error && <div className="text-red-400 text-sm mb-2">{error}</div>}
            
            <div className="flex flex-wrap gap-4">
                <StatCard 
                    label="CPU" 
                    value={stats.cpu_usage} 
                    color="#3b82f6" 
                    icon={CpuIcon} 
                />
                <StatCard 
                    label="RAM" 
                    value={stats.ram_usage} 
                    subtext={`${formatBytes(stats.ram_used)} / ${formatBytes(stats.ram_total)}`} 
                    color="#a855f7" 
                    icon={RamIcon} 
                />
                <StatCard 
                    label="Storage" 
                    value={stats.disk_usage} 
                    subtext={`${formatBytes(stats.disk_used)} / ${formatBytes(stats.disk_total)}`} 
                    color="#f97316" 
                    icon={DiskIcon} 
                />
            </div>
        </div>
    );
};

export default ServerModule;
