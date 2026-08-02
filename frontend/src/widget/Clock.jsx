import { useState, useEffect } from 'react';

export default function Clock() {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => {
            setTime(new Date());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const timeString = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const dateString = time.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });

    return (
        <div className="bg-blue-500/50 rounded-md px-3 flex items-baseline gap-3">
            <span className="text-2xl font-semibold tracking-wide text-white">{timeString}</span>
            <span className="text-base font-normal text-white/90">{dateString}</span>
        </div>
    );
}
