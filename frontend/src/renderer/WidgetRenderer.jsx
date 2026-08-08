import DayWidget from '../widget/day'; 
import BatteryWidget from '../widget/Battery';
import VolumeWidget from '../widget/Volume';
import WifiWidget from '../widget/Wifi';
import NotificationWidget from '../widget/Notification';
import WorkspaceWidget from '../widget/Workspace';
import OverlayWidget from '../widget/Overlay';
import PowerWidget from '../widget/Power';
import ThemeToggle from '../widget/ThemeToggle';
import OverlayToggleWidget from '../widget/OverlayToggle';
import MusicWidget from '../widget/Music';

export default function WidgetRenderer({ name, activeOverlay, toggleOverlay, overlayTransparent, toggleOverlayTransparent }) {
    switch (name.toLowerCase()) {
        case 'day':
            return <DayWidget />;
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
        case 'overlay':
            return <OverlayWidget activeOverlay={activeOverlay} toggleOverlay={toggleOverlay} />;
        case 'power':
            return <PowerWidget activeOverlay={activeOverlay} toggleOverlay={toggleOverlay} />;
        case 'theme_toggle':
            return <ThemeToggle />;
        case 'overlay_toggle':
            return <OverlayToggleWidget overlayTransparent={overlayTransparent} toggleOverlayTransparent={toggleOverlayTransparent} />;
        case 'music':
            return <MusicWidget toggleOverlay={toggleOverlay} />;
        default:
            return (
                <div className="bg-red-500/80 backdrop-blur-md rounded-md px-4 py-1 text-white text-sm font-semibold">
                    Unknown Widget: {name}
                </div>
            );
    }
}

