import { Square, SquareDashed } from 'lucide-react';

export default function OverlayToggleWidget({ overlayTransparent, toggleOverlayTransparent }) {
    return (
        <button
            onClick={toggleOverlayTransparent}
            className="widget-btn"
            title={overlayTransparent ? "Enable Solid Background" : "Enable Transparent Background"}
        >
            {overlayTransparent ? (
                <SquareDashed size={20} />
            ) : (
                <Square size={20} />
            )}
        </button>
    );
}
