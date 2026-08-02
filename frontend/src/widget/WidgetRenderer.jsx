import Clock from './Clock';
import BatteryWidget from './Battery';
import VolumeWidget from './Volume';
import WifiWidget from './Wifi';
import NotificationWidget from './Notification';
import WorkspaceWidget from './Workspace';

export default function WidgetRenderer({ name }) {
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
        default:
            return (
                <div className="bg-red-500/80 backdrop-blur-md rounded-full px-4 py-1 text-white text-sm font-semibold">
                    Unknown Widget: {name}
                </div>
            );
    }
}
