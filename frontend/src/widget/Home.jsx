import { House, X } from 'lucide-react';

export default function HomeWidget({ activeOverlay, toggleOverlay }) {
    const isOverlay = activeOverlay === 'home';

    return (
        <button
            onClick={() => toggleOverlay('home')}
            className={`widget-btn ${isOverlay ? 'active' : ''}`}
            title="Home Menu"
        >
            {isOverlay ? <X size={20} /> : <House size={20} />}
        </button>
    );
}
