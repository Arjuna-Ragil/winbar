import { Settings2, History, X, Eye, EyeOff } from 'lucide-react';

export default function TopControls({
    hideUI, setHideUI,
    companions, activeCompanionId, setActiveCompanionId,
    showHistory, setShowHistory
}) {
    return (
        <div className={`z-20 flex px-3 mb-2 pointer-events-none transition-all duration-300 ${hideUI ? 'justify-end' : 'justify-between'}`}>
            {!hideUI && (
                <div className="pointer-events-auto bg-black/40 backdrop-blur-md rounded px-2 py-1 flex items-center gap-2 border border-white/10 shadow-md">
                    <Settings2 size={14} className="text-white/70" />
                    <select
                        value={activeCompanionId}
                        onChange={e => setActiveCompanionId(e.target.value)}
                        className="bg-transparent text-sm font-semibold outline-none text-white cursor-pointer"
                    >
                        {companions.map(c => (
                            <option key={c.id} value={c.id} className="bg-slate-800">{c.name}</option>
                        ))}
                        {companions.length === 0 && <option>Loading...</option>}
                    </select>
                </div>
            )}
            
            <div className="flex gap-2">
                {!hideUI && (
                    <button
                        onClick={() => setShowHistory(!showHistory)}
                        className="pointer-events-auto bg-black/40 backdrop-blur-md border border-white/10 p-1.5 rounded hover:bg-black/60 transition-colors shadow-md"
                        title="Conversation Log"
                    >
                        {showHistory ? <X size={16} /> : <History size={16} />}
                    </button>
                )}
                <button
                    onClick={() => setHideUI(!hideUI)}
                    className={`pointer-events-auto bg-black/40 backdrop-blur-md border border-white/10 p-1.5 rounded transition-colors shadow-md ${hideUI ? 'opacity-30 hover:opacity-100 hover:bg-black/60' : 'hover:bg-black/60'}`}
                    title={hideUI ? "Show UI" : "Hide UI"}
                >
                    {hideUI ? <Eye size={16} /> : <EyeOff size={16} />}
                </button>
            </div>
        </div>
    );
}
