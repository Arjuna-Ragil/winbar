import { Bell } from 'lucide-react';
import { OpenNotifications } from '../../wailsjs/go/handlers/SystemHandler';

export default function NotificationWidget() {
    const handleClick = () => {
        OpenNotifications().catch(console.error);
    };

    return (
        <button
            onClick={handleClick}
            className="widget-btn"
        >
            <Bell size={18} />
        </button>
    );
}
