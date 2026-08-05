import { useState, useEffect } from 'react';
import { Palette } from 'lucide-react';
import { GetThemes, SetTheme, GetConfig } from '../../wailsjs/go/handlers/SystemHandler';

export default function ThemeToggle() {
    const [themes, setThemes] = useState([]);
    const [currentTheme, setCurrentTheme] = useState("default");

    useEffect(() => {
        GetThemes().then(setThemes).catch(console.error);
        GetConfig().then(cfg => {
            if (cfg.theme) setCurrentTheme(cfg.theme);
        }).catch(console.error);
    }, []);

    const toggleTheme = () => {
        if (themes.length === 0) return;
        let currentIndex = themes.indexOf(currentTheme);
        if (currentIndex === -1) currentIndex = 0;
        const nextIndex = (currentIndex + 1) % themes.length;
        const nextTheme = themes[nextIndex];

        SetTheme(nextTheme).then(() => {
            setCurrentTheme(nextTheme);
            window.dispatchEvent(new Event('theme_changed'));
        }).catch(console.error);
    };

    return (
        <button
            onClick={toggleTheme}
            className="widget-btn"
            title={`Toggle Theme (Current: ${currentTheme})`}
        >
            <Palette size={20} />
        </button>
    );
}
