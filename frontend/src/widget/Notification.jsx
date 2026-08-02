import { Bell } from 'lucide-react';
import { OpenNotifications } from '../../wailsjs/go/handlers/SystemHandler';

export default function NotificationWidget() {
    const handleClick = () => {
        OpenNotifications().catch(console.error);
    };

    return (
        <button 
            onClick={handleClick}
            className="bg-blue-500/50 hover:bg-blue-500/70 transition-colors rounded-md px-3 py-1 flex items-center justify-center text-white cursor-pointer"
        >
            <Bell size={18} />
        </button>
    );
}
