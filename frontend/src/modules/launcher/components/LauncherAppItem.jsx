import { X } from 'lucide-react';

export default function LauncherAppItem({ app, onLaunch, onRemove }) {
    return (
        <div
            onClick={() => onLaunch(app.path)}
            className="group relative flex flex-col items-center gap-2 p-3 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-[#3b82f6]/50 rounded-xl cursor-pointer transition-all hover:-translate-y-1 hover:shadow-[0_4px_20px_rgba(59,130,246,0.15)]"
            title={app.path}
        >
            <div className="w-12 h-12 flex justify-center items-center bg-black/20 rounded-lg p-1">
                {app.icon ? (
                    <img src={app.icon} alt={app.name} className="max-w-full max-h-full object-contain drop-shadow-md" />
                ) : (
                    <div className="text-xl font-bold text-[#3b82f6]">
                        {app.name.charAt(0).toUpperCase()}
                    </div>
                )}
            </div>
            <span className="text-xs font-medium text-white/80 group-hover:text-white truncate w-full text-center">
                {app.name}
            </span>

            <button
                onClick={(e) => onRemove(app.path, e)}
                className="absolute -top-2 -right-2 bg-red-500/80 hover:bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                title="Remove"
            >
                <X size={10} />
            </button>
        </div>
    );
}
