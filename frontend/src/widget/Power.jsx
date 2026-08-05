import { Power, X } from 'lucide-react';

export default function PowerWidget({ activeOverlay, toggleOverlay }) {
    const isOverlay = activeOverlay === 'power';

    return (
        <button
            onClick={() => toggleOverlay('power')}
            className={`widget-btn ${isOverlay ? 'active' : ''}`}
            title="Power Menu"
        >
            {isOverlay ? <X size={20} /> : <Power size={20} />}
        </button>
    );
}
