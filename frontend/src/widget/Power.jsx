import { Power, X } from 'lucide-react';

export default function PowerWidget({ activeOverlay, toggleOverlay }) {
    const isOverlay = activeOverlay === 'power';
    
    return (
        <button 
            onClick={() => toggleOverlay('power')}
            className={`transition-colors rounded-md px-2 py-1 flex items-center justify-center text-white cursor-pointer ${
                isOverlay ? 'bg-blue-500/80 hover:bg-blue-500/60' : 'bg-blue-500/50 hover:bg-blue-500/70'
            }`}
            title="Power Menu"
        >
            {isOverlay ? <X size={20} /> : <Power size={20} />}
        </button>
    );
}
