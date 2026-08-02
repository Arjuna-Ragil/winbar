import Clock from './Clock';
import BatteryWidget from './Battery';
import VolumeWidget from './Volume';
import WifiWidget from './Wifi';
import NotificationWidget from './Notification';
import WorkspaceWidget from './Workspace';
import PowerMenuWidget from './Home';
import PowerWidget from './Power';

export default function WidgetRenderer({ name, activeOverlay, toggleOverlay }) {
    switch (name.toLowerCase()) {
        case 'clock':
            return <Clock />;
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
        default:
            return (
                <div className="bg-red-500/80 backdrop-blur-md rounded-full px-4 py-1 text-white text-sm font-semibold">
                    Unknown Widget: {name}
                </div>
            );
    }
}
