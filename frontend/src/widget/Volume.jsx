import { useState, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { GetVolume } from '../../wailsjs/go/handlers/SystemHandler';

export default function VolumeWidget() {
    const [data, setData] = useState({ level: 50, muted: false });

    useEffect(() => {
        const fetchVolume = () => {
            GetVolume().then(setData).catch(console.error);
        };
        fetchVolume();
        const timer = setInterval(fetchVolume, 2000); // Update every 2 seconds
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="widget">
            {data.muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
            <span className="widget-text">{data.level}%</span>
        </div>
    );
}
