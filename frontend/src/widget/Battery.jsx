import { useState, useEffect } from 'react';
import { Battery, BatteryCharging, BatteryFull, BatteryLow, BatteryMedium } from 'lucide-react';
import { GetBattery } from '../../wailsjs/go/handlers/SystemHandler';

export default function BatteryWidget() {
    const [data, setData] = useState({ percentage: 100, isCharging: false });

    useEffect(() => {
        const fetchBattery = () => {
            GetBattery().then(setData).catch(console.error);
        };
        fetchBattery();
        const timer = setInterval(fetchBattery, 30000); // Update every 30 seconds
        return () => clearInterval(timer);
    }, []);

    let Icon = Battery;
    if (data.isCharging) {
        Icon = BatteryCharging;
    } else if (data.percentage > 90) {
        Icon = BatteryFull;
    } else if (data.percentage > 50) {
        Icon = BatteryMedium;
    } else if (data.percentage > 20) {
        Icon = BatteryLow;
    }

    return (
        <div className="bg-blue-500/50 rounded-md px-3 py-1.5 flex items-center gap-2 text-white">
            <Icon size={18} />
            <span className="text-sm font-medium">{data.percentage}%</span>
        </div>
    );
}
