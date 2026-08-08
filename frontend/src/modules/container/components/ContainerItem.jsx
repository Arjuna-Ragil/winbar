export default function ContainerItem({ container }) {
    return (
        <div className="bg-white/5 rounded-xl p-3 border border-white/10 transition-colors hover:bg-white/10">
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
    );
}
