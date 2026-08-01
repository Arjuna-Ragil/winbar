import { useState, useEffect } from 'react';

function App() {
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
        <div className="h-screen w-full flex items-center justify-center overflow-hidden select-none text-white font-sans">
            <div className="flex items-baseline gap-3">
                <span className="text-2xl font-semibold tracking-wide">{timeString}</span>
                <span className="text-base font-normal opacity-90">{dateString}</span>
            </div>
        </div>
    )
}

export default App
