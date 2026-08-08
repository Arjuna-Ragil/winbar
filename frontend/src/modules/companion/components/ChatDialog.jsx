import { Send, Loader2 } from 'lucide-react';

export default function ChatDialog({
    activeCompanion, isLoading,
    displayedMessage, fullMessage, setDisplayedMessage,
    input, setInput, handleSend
}) {
    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="z-10 p-3 flex flex-col gap-2 shrink-0 border-t border-white/10 bg-linear-to-b from-black/60 to-black/90 backdrop-blur-md">
            <div className="flex justify-between items-end">
                <div className="bg-widget text-widget-text px-3 py-1 rounded-sm text-sm font-bold uppercase tracking-wider inline-block border border-white/20 shadow-lg">
                    {activeCompanion ? activeCompanion.name : 'System'}
                </div>
                {isLoading && <Loader2 size={16} className="animate-spin text-white/50" />}
            </div>

            <div className="bg-black/40 border border-white/10 rounded p-3 min-h-20 cursor-pointer" onClick={() => {
                if (displayedMessage.length < fullMessage.length) {
                    setDisplayedMessage(fullMessage);
                }
            }}>
                <div className="text-white/90 text-sm md:text-base leading-relaxed wrap-break-word font-serif">
                    {displayedMessage}
                    <span className="animate-pulse ml-1 inline-block w-1.5 h-4 bg-white/70 align-middle"></span>
                </div>
            </div>

            <div className="flex gap-2 mt-1">
                <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Say something..."
                    className="flex-1 bg-black/60 border border-white/20 rounded p-2 text-sm text-white resize-none h-10.5 min-h-10.5 max-h-30 focus:outline-none focus:border-widget-text transition-colors chat-scrollable placeholder-white/30 font-sans"
                    rows={1}
                    disabled={isLoading}
                />
                <button
                    onClick={handleSend}
                    disabled={!input.trim() || isLoading}
                    className="bg-widget text-widget-text px-4 rounded h-10.5 flex items-center justify-center hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-semibold"
                >
                    <Send size={16} />
                </button>
            </div>
        </div>
    );
}
