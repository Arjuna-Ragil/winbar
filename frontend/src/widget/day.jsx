import { useState, useEffect } from 'react';
import { GetWeather } from '../../wailsjs/go/handlers/SystemHandler';
import { Sun, Cloud, Moon } from 'lucide-react';

export default function Day() {
    const [time, setTime] = useState(new Date());
    const [weather, setWeather] = useState(null);

    useEffect(() => {
        const fetchWeather = () => {
            GetWeather().then(data => {
                if (data && data.temperature !== 0) {
                    setWeather(data);
                }
            }).catch(console.error);
        };
        fetchWeather();
        const weatherTimer = setInterval(fetchWeather, 15 * 60 * 1000);

        const timer = setInterval(() => {
            setTime(new Date());
        }, 1000);
        
        return () => {
            clearInterval(timer);
            clearInterval(weatherTimer);
        };
    }, []);

    const timeString = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const dateString = time.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });

    let bgType = 'clear';
    if (weather) {
        const w = weather.weatherCode;
        if (w >= 1 && w <= 3) bgType = 'cloudy';
        if (w >= 50) bgType = 'rain';
    }

    return (
        <div className="widget px-5! py-0.5! items-center justify-center relative overflow-hidden group">
            
            {bgType === 'clear' && weather?.isDay && (
                <div className="absolute -top-4 -right-4 text-yellow-400/20 group-hover:text-yellow-400/30 transition-colors">
                    <Sun size={64} fill="currentColor" />
                </div>
            )}
            {bgType === 'clear' && !weather?.isDay && (
                <div className="absolute -top-4 -right-4 text-blue-300/20 group-hover:text-blue-300/30 transition-colors">
                    <Moon size={64} fill="currentColor" />
                </div>
            )}
            {bgType === 'cloudy' && (
                <div className="absolute -top-2 -right-4 text-white/10 group-hover:text-white/20 transition-colors flex gap-1">
                    <Cloud size={48} fill="currentColor" />
                    <Cloud size={32} fill="currentColor" className="mt-4 -ml-4" />
                </div>
            )}
            {bgType === 'rain' && (
                <div className="absolute inset-0 opacity-20 pointer-events-none" style={{
                    backgroundImage: 'repeating-linear-gradient(20deg, transparent, transparent 10px, rgba(255,255,255,0.4) 10px, rgba(255,255,255,0.4) 11px)'
                }}></div>
            )}

            <div className="relative z-10 flex items-baseline gap-3">
                <span className="text-lg font-semibold tracking-wide drop-shadow-md">{timeString}</span>
                <span className="w-px h-4 bg-white/20 rounded-full"></span>
                <span className="text-base font-normal text-white/90 drop-shadow-md">{dateString}</span>
                
                {weather && (
                    <>
                        <span className="w-px h-4 bg-white/20 rounded-full"></span>
                        <span className="text-base font-medium text-white drop-shadow-md">
                            {Math.round(weather.temperature)}°
                        </span>
                    </>
                )}
            </div>
        </div>
    );
}
