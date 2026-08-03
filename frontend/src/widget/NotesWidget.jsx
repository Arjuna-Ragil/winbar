import { StickyNote, X } from 'lucide-react';

export default function NotesWidget({ activeOverlay, toggleOverlay }) {
    const isOverlay = activeOverlay === 'notes';
    
    return (
        <button 
            onClick={() => toggleOverlay('notes')}
            className={`widget-btn ${isOverlay ? 'active' : ''}`}
            title="Notes & Tasks"
        >
            {isOverlay ? <X size={20} /> : <StickyNote size={20} />}
        </button>
    );
}
