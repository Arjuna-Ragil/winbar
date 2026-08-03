import { useState, useEffect } from 'react';

export default function useDrawing() {
    const [initialData, setInitialData] = useState(null);

    useEffect(() => {
        const savedElements = localStorage.getItem('drawing_elements');
        const savedAppState = localStorage.getItem('drawing_appState');
        
        if (savedElements) {
            try {
                setInitialData({
                    elements: JSON.parse(savedElements),
                    appState: savedAppState ? JSON.parse(savedAppState) : undefined
                });
            } catch (e) {
                console.error("Failed to parse drawing data", e);
                setInitialData({ elements: [] });
            }
        } else {
            setInitialData({ elements: [] });
        }
    }, []);

    const handleChange = (elements, appState) => {
        // Debounce or save directly. Excalidraw calls onChange very frequently.
        // For a simple setup, we just save to local storage.
        localStorage.setItem('drawing_elements', JSON.stringify(elements));
        
        // We only save important appState things if we want, like viewBackgroundColor
        if (appState) {
            localStorage.setItem('drawing_appState', JSON.stringify({
                viewBackgroundColor: appState.viewBackgroundColor
            }));
        }
    };

    return { initialData, handleChange };
}
