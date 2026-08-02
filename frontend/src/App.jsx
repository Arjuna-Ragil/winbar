import { useState, useEffect } from 'react';
import WidgetRenderer from './widget/WidgetRenderer';
import { GetConfig } from '../wailsjs/go/handlers/SystemHandler.js';
import { ExpandWindow, ShrinkWindow } from '../wailsjs/go/main/App.js';

function App() {
    const [config, setConfig] = useState({ left: [], center: [], right: [] });
    const [isOverlay, setIsOverlay] = useState(false);

    useEffect(() => {
        // Fetch config from Go backend
        GetConfig().then((cfg) => {
            setConfig({
                left: cfg.left || [],
                center: cfg.center || [],
                right: cfg.right || []
            });
        }).catch((err) => {
            console.error("Failed to load config from Go:", err);
            // Fallback for development if Wails hasn't recompiled yet
            setConfig({ left: [], center: ["clock"], right: [] });
        });
    }, []);

    const toggleOverlay = () => {
        if (isOverlay) {
            ShrinkWindow();
            setIsOverlay(false);
        } else {
            ExpandWindow();
            setIsOverlay(true);
        }
    };

    // Helper to render an array of widgets
    const renderZone = (widgets) => {
        return widgets.map((widgetName, index) => (
            <WidgetRenderer 
                key={`${widgetName}-${index}`} 
                name={widgetName} 
                isOverlay={isOverlay}
                toggleOverlay={toggleOverlay}
            />
        ));
    };

    return (
        <div className="w-full h-screen overflow-hidden text-white font-sans relative">
            {/* Absolute Full-Screen Background */}
            <div 
                className={`absolute inset-0 transition-all duration-300 ${
                    isOverlay ? 'bg-black/60 backdrop-blur-2xl opacity-100 pointer-events-auto' : 'bg-transparent opacity-0 pointer-events-none'
                }`}
            />

            <div className="absolute inset-0 flex flex-col p-2 pointer-events-none">
                {/* The Top Bar Section */}
                <div className="flex justify-between items-center select-none pointer-events-auto">
                    {/* Left Zone */}
                    <div className="flex items-center gap-1 flex-1">
                        {renderZone(config.left)}
                    </div>

                    {/* Center Zone */}
                    <div className="flex items-center gap-1 flex-1 justify-center">
                        {renderZone(config.center)}
                    </div>

                    {/* Right Zone */}
                    <div className="flex items-center gap-1 flex-1 justify-end">
                        {renderZone(config.right)}
                    </div>
                </div>

                {/* The Full Screen Overlay Section */}
                {isOverlay && (
                    <div className="flex-1 w-full flex flex-col items-center justify-center animate-in fade-in duration-300 pointer-events-auto">
                        <h1 className="text-6xl font-bold mb-4 bg-linear-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent drop-shadow-lg">
                            Power Menu
                        </h1>
                        <p className="text-white/60 mb-12 text-lg">This is rendering natively over your desktop!</p>
                        
                        <div className="flex gap-8">
                            <button className="w-40 h-40 rounded-3xl bg-white/3 hover:bg-white/8 border border-white/10 flex flex-col items-center justify-center gap-4 cursor-pointer transition-all hover:scale-105 hover:border-red-500/50 hover:shadow-[0_0_32px_rgba(239,68,68,0.2)]">
                                <div className="w-10 h-10 rounded-full border-4 border-red-400" />
                                <span className="font-semibold tracking-wide">Shut Down</span>
                            </button>
                            <button className="w-40 h-40 rounded-3xl bg-white/3 hover:bg-white/8 border border-white/10 flex flex-col items-center justify-center gap-4 cursor-pointer transition-all hover:scale-105 hover:border-orange-500/50 hover:shadow-[0_0_32px_rgba(249,115,22,0.2)]">
                                <div className="w-10 h-10 rounded-full border-4 border-orange-400 border-t-transparent animate-spin" />
                                <span className="font-semibold tracking-wide">Restart</span>
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default App
