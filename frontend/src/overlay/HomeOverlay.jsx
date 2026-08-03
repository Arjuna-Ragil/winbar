import { useState, useEffect, useRef } from 'react';
import Draggable from 'react-draggable';
import { GripHorizontal } from 'lucide-react';
import ModuleRenderer from '../modules/ModuleRenderer';

const DraggableModule = ({ id, modName, position, onStop }) => {
    const nodeRef = useRef(null);

    return (
        <Draggable
            nodeRef={nodeRef}
            position={position}
            onStop={(e, data) => onStop(id, data)}
            bounds="parent"
            handle=".drag-handle"
        >
            <div ref={nodeRef} className="absolute flex flex-row group items-start">
                <div className="drag-handle opacity-0 group-hover:opacity-100 cursor-move p-1 bg-black/40 hover:bg-black/60 text-white/80 hover:text-white rounded-l-md transition-all duration-200 backdrop-blur-sm z-50 shadow-md">
                    <GripHorizontal size={20} />
                </div>
                <div className="relative -mt-1 w-full">
                    <ModuleRenderer name={modName} />
                </div>
            </div>
        </Draggable>
    );
};

export default function HomeOverlay({ modules = [] }) {
    const [positions, setPositions] = useState({});
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        const saved = localStorage.getItem('modulePositions');
        if (saved) {
            try {
                setPositions(JSON.parse(saved));
            } catch (e) {
                console.error("Failed to parse modulePositions", e);
            }
        }
        setLoaded(true);
    }, []);

    const handleDragStop = (id, data) => {
        const newPositions = {
            ...positions,
            [id]: { x: data.x, y: data.y }
        };
        setPositions(newPositions);
        localStorage.setItem('modulePositions', JSON.stringify(newPositions));
    };

    // Don't render draggable items until we've loaded positions from localStorage
    // to prevent them jumping from 0,0 to their saved position.
    if (!loaded) return null;

    return (
        <div className="flex-1 w-full relative p-4 animate-in fade-in duration-300 pointer-events-auto overflow-hidden">
            {modules.length === 0 ? (
                <div className="w-full h-full flex flex-col items-center justify-center">
                    <h1 className="text-6xl font-bold mb-4 bg-linear-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent drop-shadow-lg">
                        Home Dashboard
                    </h1>
                    <p className="text-white/60 mb-12 text-lg">No modules configured in config.yaml.</p>
                </div>
            ) : (
                modules.map((modName, index) => {
                    const id = `${modName}-${index}`;
                    const pos = positions[id] || { x: index * 20, y: index * 20 };
                    return (
                        <DraggableModule
                            key={id}
                            id={id}
                            modName={modName}
                            position={pos}
                            onStop={handleDragStop}
                        />
                    );
                })
            )}
        </div>
    );
}

