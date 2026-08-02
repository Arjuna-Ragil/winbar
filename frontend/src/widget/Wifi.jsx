import { useState, useEffect } from 'react';
import { Wifi, WifiOff } from 'lucide-react';
import { GetWifi } from '../../wailsjs/go/handlers/SystemHandler';

export default function WifiWidget() {
    const [data, setData] = useState({ isConnected: false, signal: '0%' });

    useEffect(() => {
        const fetchWifi = () => {
            GetWifi().then(setData).catch(console.error);
        };
        fetchWifi();
        const timer = setInterval(fetchWifi, 10000); // Update every 10 seconds
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="bg-blue-500/50 rounded-md px-3 py-1.5 flex items-center gap-2 text-white">
            {data.isConnected ? <Wifi size={18} /> : <WifiOff size={18} />}
            {data.isConnected && <span className="text-sm font-medium">{data.signal}</span>}
        </div>
    );
}
