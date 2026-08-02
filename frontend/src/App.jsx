import { useState, useEffect } from 'react';
import WidgetRenderer from './widget/WidgetRenderer';
import { GetConfig } from '../wailsjs/go/handlers/SystemHandler.js';
import { ExpandWindow, ShrinkWindow } from '../wailsjs/go/main/App.js';
import HomeOverlay from './overlay/HomeOverlay';
import PowerOverlay from './overlay/PowerOverlay';

function App() {
    const [config, setConfig] = useState({ left: [], center: [], right: [] });
    const [activeOverlay, setActiveOverlay] = useState(null);

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

    const toggleOverlay = (overlayName) => {
        if (activeOverlay === overlayName) {
            ShrinkWindow();
            setActiveOverlay(null);
        } else {
            if (!activeOverlay) {
                ExpandWindow();
            }
            setActiveOverlay(overlayName);
        }
    };

    // Helper to render an array of widgets
    const renderZone = (widgets) => {
        return widgets.map((widgetName, index) => (
            <WidgetRenderer 
                key={`${widgetName}-${index}`} 
                name={widgetName} 
                activeOverlay={activeOverlay}
                toggleOverlay={toggleOverlay}
            />
        ));
    };

    return (
        <div className="w-full h-screen overflow-hidden text-white font-sans relative">
            <div 
                className={`absolute inset-0 transition-all duration-300 ${
                    activeOverlay !== null ? 'bg-blue-900/90 opacity-100 pointer-events-auto' : 'bg-transparent opacity-0 pointer-events-none'
                }`}
            />

            {/* Widget Section */}

            <div className="absolute inset-0 flex flex-col p-2 pointer-events-none">
                <div className="flex justify-between items-center select-none pointer-events-auto">
                    {/* Left */}
                    <div className="flex items-center gap-1 flex-1">
                        {renderZone(config.left)}
                    </div>

                    {/* Center */}
                    <div className="flex items-center gap-1 flex-1 justify-center">
                        {renderZone(config.center)}
                    </div>

                    {/* Right */}
                    <div className="flex items-center gap-1 flex-1 justify-end">
                        {renderZone(config.right)}
                    </div>
                </div>

                {/* Overlay Section */}

                {activeOverlay === 'home' && <HomeOverlay />}
                {activeOverlay === 'power' && <PowerOverlay />}
            </div>
        </div>
    )
}

export default App
