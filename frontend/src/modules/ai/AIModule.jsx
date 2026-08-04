import { useState, useRef, useEffect } from 'react';
import { Prompt } from '../../../wailsjs/go/handlers/Chat';
import { Send, Bot, User, Loader2 } from 'lucide-react';

export default function AIModule() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage = input.trim();
        setInput('');
        setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
        setIsLoading(true);

        try {
            const response = await Prompt(userMessage);
            setMessages(prev => [...prev, { role: 'ai', content: response }]);
        } catch (error) {
            setMessages(prev => [...prev, { role: 'error', content: `Error: ${error}` }]);
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
        <div className="flex flex-col rounded-md shadow-[5px_5px_15px_rgba(0,0,0,0.6)] border-2 border-widget text-white pointer-events-auto resize overflow-hidden relative" 
             style={{ width: '400px', height: '500px', minWidth: '300px', minHeight: '300px', backgroundColor: 'var(--color-background)' }}>
            
            <style>{`
                .chat-scrollable::-webkit-scrollbar { width: 6px; }
                .chat-scrollable::-webkit-scrollbar-track { background: transparent; }
                .chat-scrollable::-webkit-scrollbar-thumb { background: var(--color-widget); border-radius: 10px; }
            `}</style>
            
            {/* Drag Handle */}
            <div className="drag-handle cursor-move h-4 shrink-0 w-full flex items-center justify-center">
                <div className="w-12 h-1 bg-widget-text rounded-full opacity-50"></div>
            </div>

            {/* Header */}
            <div className="flex items-center p-3 border-b border-white/10 bg-black/20">
                <Bot className="w-5 h-5 mr-2 text-widget-text" />
                <h2 className="font-semibold tracking-wide text-widget-text">Local AI Assistant</h2>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto chat-scrollable p-4 flex flex-col gap-4">
                {messages.length === 0 && (
                    <div className="flex-1 flex items-center justify-center text-white/40 text-sm italic">
                        Start a conversation...
                    </div>
                )}
                
                {messages.map((msg, index) => (
                    <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[85%] rounded-lg p-3 text-sm leading-relaxed ${
                            msg.role === 'user' 
                                ? 'bg-widget text-widget-text' 
                                : msg.role === 'error'
                                    ? 'bg-red-500/20 text-red-200 border border-red-500/50'
                                    : 'bg-black/40 text-white/90 border border-white/10'
                        }`}>
                            <div className="flex items-center gap-2 mb-1 opacity-70 text-xs">
                                {msg.role === 'user' ? <User size={12} /> : <Bot size={12} />}
                                <span>{msg.role === 'user' ? 'You' : 'AI'}</span>
                            </div>
                            <div className="wrap-break-word">{msg.content}</div>
                        </div>
                    </div>
                ))}
                
                {isLoading && (
                    <div className="flex justify-start">
                        <div className="bg-black/40 border border-white/10 rounded-lg p-3 flex items-center gap-2 text-sm text-white/70">
                            <Loader2 size={14} className="animate-spin" />
                            Thinking...
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>
            
            {/* Input Area */}
            <div className="p-3 bg-black/30 border-t border-white/10 flex gap-2">
                <textarea 
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Message AI..."
                    className="flex-1 bg-black/40 border border-white/20 rounded-md p-2 text-sm text-white resize-none h-10.5 min-h-10.5 max-h-30 focus:outline-none focus:border-widget-text transition-colors chat-scrollable placeholder-white/40"
                    rows={1}
                />
                <button 
                    onClick={handleSend}
                    disabled={!input.trim() || isLoading}
                    className="bg-widget text-widget-text p-2 rounded-md h-10.5 w-10.5 flex items-center justify-center hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                    <Send size={18} />
                </button>
            </div>
            
            {/* Visual resize indicator */}
            <div className="absolute bottom-1 right-1 w-3 h-3 border-r-2 border-b-2 border-white/20 pointer-events-none rounded-br-sm"></div>
        </div>
    );
}
