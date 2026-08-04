import Day from './day';
import BatteryWidget from './Battery';
import VolumeWidget from './Volume';
import WifiWidget from './Wifi';
import NotificationWidget from './Notification';
import WorkspaceWidget from './Workspace';
import PowerMenuWidget from './Home';
import PowerWidget from './Power';
import ThemeToggle from './ThemeToggle';
import OverlayToggleWidget from './OverlayToggle';
import NotesWidget from './NotesWidget';
import MusicWidget from './Music';
import ChatWidget from './ChatWidget';

export default function WidgetRenderer({ name, activeOverlay, toggleOverlay, overlayTransparent, toggleOverlayTransparent }) {
    switch (name.toLowerCase()) {
        case 'day':
            return <Day />;
        case 'battery':
            return <BatteryWidget />;
        case 'volume':
            return <VolumeWidget />;
        case 'wifi':
            return <WifiWidget />;
        case 'notification':
            return <NotificationWidget />;
        case 'workspace':
            return <WorkspaceWidget />;
        case 'home':
            return <PowerMenuWidget activeOverlay={activeOverlay} toggleOverlay={toggleOverlay} />;
        case 'power':
            return <PowerWidget activeOverlay={activeOverlay} toggleOverlay={toggleOverlay} />;
        case 'theme_toggle':
            return <ThemeToggle />;
        case 'overlay_toggle':
            return <OverlayToggleWidget overlayTransparent={overlayTransparent} toggleOverlayTransparent={toggleOverlayTransparent} />;
        case 'notes':
            return <NotesWidget activeOverlay={activeOverlay} toggleOverlay={toggleOverlay} />;
        case 'music':
            return <MusicWidget toggleOverlay={toggleOverlay} />;
        case 'chat':
            return <ChatWidget activeOverlay={activeOverlay} toggleOverlay={toggleOverlay} />;
        default:
            return (
                <div className="bg-red-500/80 backdrop-blur-md rounded-full px-4 py-1 text-white text-sm font-semibold">
                    Unknown Widget: {name}
                </div>
            );
    }
}

