import { useState, useEffect } from 'react';
import WidgetRenderer from './widget/WidgetRenderer';
import { GetConfig } from '../wailsjs/go/handlers/SystemHandler';

function App() {
    const [config, setConfig] = useState({ left: [], center: [], right: [] });

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

    // Helper to render an array of widgets
    const renderZone = (widgets) => {
        return widgets.map((widgetName, index) => (
            <WidgetRenderer key={`${widgetName}-${index}`} name={widgetName} />
        ));
    };

    return (
        <div className="h-screen w-full flex justify-between items-center px-1 overflow-hidden select-none font-sans">
            {/* Left Zone */}
            <div className="flex items-center gap-4 flex-1">
                {renderZone(config.left)}
            </div>

            {/* Center Zone */}
            <div className="flex items-center gap-4 flex-1 justify-center">
                {renderZone(config.center)}
            </div>

            {/* Right Zone */}
            <div className="flex items-center gap-1 flex-1 justify-end">
                {renderZone(config.right)}
            </div>
        </div>
    )
}

export default App
