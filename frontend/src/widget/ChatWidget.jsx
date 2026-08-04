import { Sparkles, X } from 'lucide-react';

export default function ChatWidget({ activeOverlay, toggleOverlay }) {
    const isOverlay = activeOverlay === 'chat';
    
    return (
        <button 
            onClick={() => toggleOverlay('chat')}
            className={`widget-btn ${isOverlay ? 'active' : ''}`}
            title="AI Chat"
        >
            {isOverlay ? <X size={20} /> : <Sparkles size={20} />}
        </button>
    );
}
