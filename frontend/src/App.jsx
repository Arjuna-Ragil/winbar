import { useState, useEffect } from 'react';
import WidgetRenderer from './widget/WidgetRenderer';
import { GetConfig, GetTheme } from '../wailsjs/go/handlers/SystemHandler.js';
import { ExpandWindow, ShrinkWindow } from '../wailsjs/go/main/App.js';
import DraggableOverlay from './overlay/DraggableOverlay';
import PowerOverlay from './overlay/PowerOverlay';

function App() {
    const [config, setConfig] = useState({ left: [], center: [], right: [], modules: {} });
    const [theme, setTheme] = useState(null);
    const [activeOverlay, setActiveOverlay] = useState(null);
    const [overlayTransparent, setOverlayTransparent] = useState(false);

    useEffect(() => {
        // Fetch config and theme from Go backend
        GetConfig().then((cfg) => {
            setConfig({
                left: cfg.left || [],
                center: cfg.center || [],
                right: cfg.right || [],
                modules: cfg.modules || {}
            });
        }).catch((err) => {
            console.error("Failed to load config from Go:", err);
            setConfig({ left: [], center: ["clock"], right: [], modules: {} });
        });

        GetTheme().then(setTheme).catch(console.error);

        const handleThemeChange = () => {
            GetTheme().then(setTheme).catch(console.error);
        };
        window.addEventListener('theme_changed', handleThemeChange);

        return () => window.removeEventListener('theme_changed', handleThemeChange);
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

    const renderZone = (widgets) => {
        return widgets.map((widgetName, index) => (
            <WidgetRenderer 
                key={`${widgetName}-${index}`} 
                name={widgetName} 
                activeOverlay={activeOverlay}
                toggleOverlay={toggleOverlay}
                overlayTransparent={overlayTransparent}
                toggleOverlayTransparent={() => setOverlayTransparent(!overlayTransparent)}
            />
        ));
    };

    const themeStyle = theme ? {
        '--color-widget': theme.colors.widget,
        '--color-widget-hover': theme.colors.widgetHover,
        '--color-widget-active': theme.colors.widgetActive,
        '--color-widget-active-hover': theme.colors.widgetActiveHover,
        '--color-widget-text': theme.colors.widgetText,
        '--color-background': theme.colors.background || 'rgba(30, 58, 138, 0.9)',
    } : {};

    return (
        <div className="w-full h-screen overflow-hidden text-white font-sans relative" style={themeStyle}>
            <div 
                className={`absolute inset-0 transition-all duration-300 ${
                    activeOverlay !== null ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                }`}
                style={{ backgroundColor: overlayTransparent ? 'transparent' : 'var(--color-background)' }}
                onClick={() => { if (activeOverlay) toggleOverlay(activeOverlay) }}
            />

            {/* Widget Section */}

            <div className="absolute inset-0 flex flex-col p-1 px-2 pointer-events-none">
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
                <div style={{ display: activeOverlay === 'home' ? 'contents' : 'none' }}>
                    <DraggableOverlay overlayId="home" title="Home Dashboard" modules={config.modules.home || []} />
                </div>
                <div style={{ display: activeOverlay === 'notes' ? 'contents' : 'none' }}>
                    <DraggableOverlay overlayId="notes" title="Notes & Tasks" modules={config.modules.notes || []} />
                </div>
                <div style={{ display: activeOverlay === 'power' ? 'contents' : 'none' }}>
                    <PowerOverlay />
                </div>
            </div>
        </div>
    )
}

export default App

