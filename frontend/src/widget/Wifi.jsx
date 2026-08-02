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
        <div className="widget">
            {data.isConnected ? <Wifi size={18} /> : <WifiOff size={18} />}
            {data.isConnected && <span className="widget-text">{data.signal}</span>}
        </div>
    );
}
