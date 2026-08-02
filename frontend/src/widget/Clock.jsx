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
        <div className="widget px-2! py-0! items-baseline gap-3!">
            <span className="text-xl font-semibold tracking-wide">{timeString}</span>
            <span className="text-base font-normal text-white/90">{dateString}</span>
        </div>
    );
}
