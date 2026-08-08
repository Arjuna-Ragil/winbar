export default function Controls({ searchQuery, setSearchQuery, sortBy, setSortBy }) {
    return (
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
    );
}
