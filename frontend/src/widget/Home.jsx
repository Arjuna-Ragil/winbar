import { House, X } from 'lucide-react';

export default function PowerMenuWidget({ isOverlay, toggleOverlay }) {
    return (
        <button 
            onClick={toggleOverlay}
            className={`transition-colors rounded-md px-2 py-1 flex items-center justify-center text-white cursor-pointer ${
                isOverlay ? 'bg-purple-500/80 hover:bg-purple-500/60' : 'bg-blue-500/50 hover:bg-blue-500/70'
            }`}
            title="Power Menu"
        >
            {isOverlay ? <X size={20} /> : <House size={20} />}
        </button>
    );
}
