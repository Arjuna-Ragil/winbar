import { useState, useRef, useEffect } from 'react';
import { Prompt } from '../../../wailsjs/go/handlers/Chat';
import { GetCompanions, GetCompanionImageAsBase64 } from '../../../wailsjs/go/handlers/Companion';
import { Send, Settings2, History, X, Loader2, Eye, EyeOff } from 'lucide-react';

export default function AIModule() {
    const [companions, setCompanions] = useState([]);
    const [activeCompanionId, setActiveCompanionId] = useState('');
    const [messages, setMessages] = useState([]); // History of {role, content, expression}
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // VN States
    const [currentExpression, setCurrentExpression] = useState('');
    const [fullMessage, setFullMessage] = useState('');
    const [displayedMessage, setDisplayedMessage] = useState('');
    const [showHistory, setShowHistory] = useState(false);
    const [imageError, setImageError] = useState(false);
    const [currentImageSrc, setCurrentImageSrc] = useState('');
    const [hideUI, setHideUI] = useState(false);

    // Fetch image base64 when companion or expression changes
    useEffect(() => {
        if (!activeCompanionId || !currentExpression) return;

        setImageError(false);
        setCurrentImageSrc(''); // Clear while loading

        GetCompanionImageAsBase64(activeCompanionId, currentExpression)
            .then(base64 => {
                setCurrentImageSrc(base64);
            })
            .catch(err => {
                console.warn("Failed to load image:", err);
                setImageError(true);
            });
    }, [activeCompanionId, currentExpression]);

    // Fetch companions on mount
    useEffect(() => {
        const fetchCompanions = async () => {
            try {
                const data = await GetCompanions();
                if (data && data.length > 0) {
                    setCompanions(data);
                    setActiveCompanionId(data[0].id);
                }
            } catch (err) {
                console.error("Failed to load companions:", err);
            }
        };
        fetchCompanions();
    }, []);

    const activeCompanion = companions.find(c => c.id === activeCompanionId) || null;

    // Set start message and clear history when companion changes
    useEffect(() => {
        if (activeCompanion) {
            setFullMessage(activeCompanion.startMessage || 'Hello there! How can I help you today?');
            setCurrentExpression('happy');
            setMessages([]);
        }
    }, [activeCompanionId, companions]);

    // Typewriter effect
    useEffect(() => {
        if (!fullMessage) {
            setDisplayedMessage('');
            return;
        }

        let i = 0;
        setDisplayedMessage(fullMessage.charAt(0));

        const interval = setInterval(() => {
            i++;
            if (i >= fullMessage.length) {
                clearInterval(interval);
                return;
            }
            setDisplayedMessage(prev => prev + fullMessage.charAt(i));
        }, 30);

        return () => clearInterval(interval);
    }, [fullMessage]);

    // History auto-scroll
    const historyEndRef = useRef(null);
    useEffect(() => {
        if (showHistory) {
            historyEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [showHistory, messages]);

    const handleSend = async () => {
        if (!input.trim() || isLoading || !activeCompanion) return;

        const userText = input.trim();
        setInput('');
        setMessages(prev => [...prev, { role: 'user', content: userText }]);
        setIsLoading(true);
        setFullMessage(''); // Clear current message while thinking

        try {
            // Build the payload
            const payload = [
                { role: 'system', content: activeCompanion.systemPrompt },
                ...messages.map(m => ({ role: m.role, content: m.content })),
                { role: 'user', content: userText }
            ].map(msg => ({
                role: msg.role,
                content: msg.content
            }));

            const response = await Prompt(payload);

            // Try to parse JSON
            let parsedExp = 'normal';
            let parsedMsg = response;

            try {
                // Sometimes AI wraps JSON in markdown blocks
                let cleanJson = response.trim();
                if (cleanJson.startsWith('```json')) cleanJson = cleanJson.replace(/```json\n?/, '');
                if (cleanJson.endsWith('```')) cleanJson = cleanJson.replace(/```$/, '');

                const parsed = JSON.parse(cleanJson);
                if (parsed.expression) parsedExp = parsed.expression.toLowerCase();
                if (parsed.message) parsedMsg = parsed.message;
            } catch (e) {
                console.warn("Failed to parse JSON response:", response);
            }

            // Verify expression exists in companion's expressions
            if (activeCompanion.expressions && activeCompanion.expressions.length > 0) {
                if (!activeCompanion.expressions.includes(parsedExp)) {
                    parsedExp = 'normal'; // Fallback
                }
            }

            setCurrentExpression(parsedExp);
            setFullMessage(parsedMsg);
            setMessages(prev => [...prev, { role: 'assistant', content: parsedMsg, expression: parsedExp }]);

        } catch (error) {
            setFullMessage(`Error: ${error}`);
            setCurrentExpression('normal');
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="flex flex-col rounded-md text-white pointer-events-auto resize overflow-hidden relative"
            style={{ width: '450px', height: '600px', minWidth: '350px', minHeight: '400px' }}>

            <style>{`
                .chat-scrollable::-webkit-scrollbar { width: 6px; }
                .chat-scrollable::-webkit-scrollbar-track { background: transparent; }
                .chat-scrollable::-webkit-scrollbar-thumb { background: var(--color-widget); border-radius: 10px; }
            `}</style>

            {/* Character Sprite Layer (Absolute, fills window behind dialog) */}
            <div className="absolute inset-0 flex items-end justify-center pointer-events-none z-0 overflow-hidden pt-8">
                {activeCompanion && !imageError && currentImageSrc && (
                    <img
                        src={currentImageSrc}
                        alt={`Expression: ${currentExpression}`}
                        className="max-h-full max-w-full object-contain drop-shadow-2xl transition-all duration-300 pointer-events-auto"
                        onError={() => setImageError(true)}
                    />
                )}
                {activeCompanion && imageError && (
                    <div className="flex flex-col items-center justify-center h-full w-full opacity-30 border-2 border-dashed border-white/20 rounded-xl p-4 m-4 pointer-events-none">
                        <span>Missing Image</span>
                        <span className="text-xs font-mono mt-2">{activeCompanion.id}/{currentExpression}.png</span>
                    </div>
                )}
            </div>

            {/* Spacer to push everything else down */}
            <div className="flex-1 pointer-events-none"></div>

            {/* Controls (Just above dialog box) */}
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

            {/* Visual Novel Dialog Box */}
            {!hideUI && (
                <div className="z-10 p-3 flex flex-col gap-2 shrink-0 border-t border-white/10 bg-linear-to-b from-black/60 to-black/90 backdrop-blur-md">

                    {/* Nameplate */}
                <div className="flex justify-between items-end">
                    <div className="bg-widget text-widget-text px-3 py-1 rounded-sm text-sm font-bold uppercase tracking-wider inline-block border border-white/20 shadow-lg">
                        {activeCompanion ? activeCompanion.name : 'System'}
                    </div>
                    {isLoading && <Loader2 size={16} className="animate-spin text-white/50" />}
                </div>

                {/* Speech Area */}
                <div className="bg-black/40 border border-white/10 rounded p-3 min-h-20 cursor-pointer" onClick={() => {
                    // Click to skip typewriter
                    if (displayedMessage.length < fullMessage.length) {
                        setDisplayedMessage(fullMessage);
                    }
                }}>
                    <div className="text-white/90 text-sm md:text-base leading-relaxed wrap-break-word font-serif">
                        {displayedMessage}
                        <span className="animate-pulse ml-1 inline-block w-1.5 h-4 bg-white/70 align-middle"></span>
                    </div>
                </div>

                {/* Input Area */}
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
            )}

            {/* History Modal Overlay */}
            {showHistory && (
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
            )}

            {/* Visual resize indicator */}
            <div className="absolute bottom-1 right-1 w-3 h-3 border-r-2 border-b-2 border-white/20 pointer-events-none rounded-br-sm z-20"></div>
        </div>
    );
}
