import { useEffect, useState, useMemo } from 'react';
import { GetContainers } from '../../../wailsjs/go/handlers/Docker';

const DockerModule = () => {
    const [containers, setContainers] = useState([]);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('name'); // 'name', 'ram', 'cpu'

    useEffect(() => {
        const fetchContainers = async () => {
            try {
                const data = await GetContainers();
                setContainers(data || []);
                setError(null);
            } catch (err) {
                setError(err.message || 'Failed to fetch containers');
            }
        };

        fetchContainers();
        const interval = setInterval(fetchContainers, 5000);
        return () => clearInterval(interval);
    }, []);

    const filteredAndSorted = useMemo(() => {
        let result = containers;
        
        if (searchQuery) {
            result = result.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()));
        }
        
        result = [...result].sort((a, b) => {
            if (sortBy === 'name') return a.name.localeCompare(b.name);
            if (sortBy === 'ram') return b.ram_usage - a.ram_usage;
            if (sortBy === 'cpu') return b.cpu_usage - a.cpu_usage;
            return 0;
        });
        
        return result;
    }, [containers, searchQuery, sortBy]);

    return (
        <div className="p-6 bg-[#090b14] backdrop-blur-md rounded-2xl min-w-[320px] shadow-2xl border border-white/5 text-white font-sans flex flex-col gap-4 min-h-75 resize overflow-hidden" style={{ maxHeight: '80vh', maxWidth: '90vw' }}>
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">Docker Containers</h2>
                <span className="bg-white/10 text-white/80 text-xs px-2 py-1 rounded-full font-medium">
                    {containers.length} running
                </span>
            </div>

            <div className="flex flex-col gap-2">
                <input 
                    type="text" 
                    placeholder="Search containers..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white placeholder-white/40 focus:outline-none focus:border-blue-500/50"
                />
                <div className="flex gap-2 text-xs">
                    <button 
                        onClick={() => setSortBy('name')} 
                        className={`px-2 py-1 rounded transition-colors ${sortBy === 'name' ? 'bg-blue-500/30 text-blue-300' : 'bg-white/5 hover:bg-white/10 text-white/60'}`}
                    >
                        Name
                    </button>
                    <button 
                        onClick={() => setSortBy('ram')} 
                        className={`px-2 py-1 rounded transition-colors ${sortBy === 'ram' ? 'bg-blue-500/30 text-blue-300' : 'bg-white/5 hover:bg-white/10 text-white/60'}`}
                    >
                        RAM
                    </button>
                    <button 
                        onClick={() => setSortBy('cpu')} 
                        className={`px-2 py-1 rounded transition-colors ${sortBy === 'cpu' ? 'bg-blue-500/30 text-blue-300' : 'bg-white/5 hover:bg-white/10 text-white/60'}`}
                    >
                        CPU
                    </button>
                </div>
            </div>

            {error && <div className="text-red-400 text-sm">{error}</div>}
            
            <div className="flex-1 overflow-y-auto space-y-3 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] scrollbar-none">
                {filteredAndSorted.length === 0 && !error && (
                    <div className="text-white/50 text-sm text-center mt-4 flex flex-col items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                        <span>No running containers found</span>
                    </div>
                )}
                {filteredAndSorted.map(container => (
                    <div key={container.name} className="bg-white/5 rounded-xl p-3 border border-white/10 transition-colors hover:bg-white/10">
                        <div className="flex justify-between items-center mb-2">
                            <span className="font-medium truncate max-w-37.5" title={container.name}>{container.name}</span>
                            <span className="text-xs px-2 py-1 rounded-full bg-green-500/20 text-green-400 border border-green-500/30">
                                {container.state}
                            </span>
                        </div>
                        <div className="flex justify-between text-xs text-white/60 bg-black/20 p-2 rounded-lg">
                            <span className="flex items-center gap-1 font-medium">
                                <span className="text-white/40">CPU:</span>
                                {container.cpu_usage.toFixed(1)}%
                            </span>
                            <span className="flex items-center gap-1 font-medium">
                                <span className="text-white/40">RAM:</span>
                                {(container.ram_usage / 1024 / 1024).toFixed(0)} MB
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DockerModule;
