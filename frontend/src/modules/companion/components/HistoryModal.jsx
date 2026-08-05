import { History, X } from 'lucide-react';
import { useRef, useEffect } from 'react';

export default function HistoryModal({
    showHistory, setShowHistory, messages, activeCompanion
}) {
    const historyEndRef = useRef(null);
    useEffect(() => {
        if (showHistory) {
            historyEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [showHistory, messages]);

    if (!showHistory) return null;

    return (
        <div className="absolute inset-0 z-30 bg-black/95 backdrop-blur-xl flex flex-col">
            <div className="flex justify-between items-center p-3 border-b border-white/10 bg-black/50">
                <div className="font-semibold tracking-wide flex items-center gap-2">
                    <History size={16} /> Log
                </div>
                <button onClick={() => setShowHistory(false)} className="hover:bg-white/10 p-1 rounded">
                    <X size={18} />
                </button>
            </div>
            <div className="flex-1 overflow-y-auto chat-scrollable p-4 flex flex-col gap-4">
                {messages.length === 0 && (
                    <div className="text-center text-white/40 italic mt-10">No conversation history yet.</div>
                )}
                {messages.map((msg, idx) => (
                    <div key={idx} className="flex flex-col gap-1 border-b border-white/5 pb-3">
                        <span className={`text-xs font-bold uppercase tracking-wider ${msg.role === 'user' ? 'text-blue-400' : 'text-widget-text'}`}>
                            {msg.role === 'user' ? 'You' : (activeCompanion?.name || 'AI')}
                            {msg.expression && <span className="text-white/30 ml-2 lowercase font-normal">({msg.expression})</span>}
                        </span>
                        <span className="text-sm text-white/90 wrap-break-word font-serif leading-relaxed">{msg.content}</span>
                    </div>
                ))}
                <div ref={historyEndRef} />
            </div>
        </div>
    );
}
