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
        localStorage.setItem('drawing_elements', JSON.stringify(elements));
        if (appState) {
            localStorage.setItem('drawing_appState', JSON.stringify({
                viewBackgroundColor: appState.viewBackgroundColor
            }));
        }
    };

    return { initialData, handleChange };
}
