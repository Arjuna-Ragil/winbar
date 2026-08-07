import { useState, useEffect, useRef } from 'react';
import Draggable from 'react-draggable';
import ModuleRenderer from '../modules/ModuleRenderer';

const DraggableModule = ({ id, modName, position, onStop, isVisible }) => {
    const nodeRef = useRef(null);

    return (
        <Draggable
            nodeRef={nodeRef}
            position={position}
            onStop={(e, data) => onStop(id, data)}
            bounds="parent"
            handle=".drag-handle"
        >
            <div
                ref={nodeRef}
                className="absolute flex flex-col group items-center pointer-events-auto rounded-xl overflow-hidden bg-background/90 border border-border shadow-[0_8px_32px_rgba(0,0,0,0.7)]"
                style={{ display: isVisible ? 'flex' : 'none' }}
            >
                <div className="drag-handle w-full h-5 cursor-move bg-black/20 hover:bg-black/40 border-b border-white/5 transition-all duration-200 z-50 flex items-center justify-center">
                    <div className="w-12 h-1 bg-white/30 rounded-full group-hover:bg-white/50 transition-colors"></div>
                </div>
                <div className="relative w-full h-full">
                    <ModuleRenderer name={modName} />
                </div>
            </div>
        </Draggable>
    );
};

const CATEGORY_MAP = {
    yamw: 'Home',
    sysinfo: 'Home',
    controlcenter: 'Home',
    launcher: 'Home',
    todo: 'Notes',
    notepad: 'Notes',
    drawing: 'Notes',
    companion: 'AI',
    server: 'Server',
    docker: 'Server',
    terminal: 'Server'
};

export default function DraggableOverlay({ overlayId, title, modules = [], overlayTransparent = false }) {
    const [positions, setPositions] = useState({});
    const [hiddenModules, setHiddenModules] = useState([]);

    const availableCategories = Array.from(new Set(modules.map(m => CATEGORY_MAP[m] || 'Other')));
    const [activeTab, setActiveTab] = useState(availableCategories[0] || 'Home');

    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        if (!availableCategories.includes(activeTab) && availableCategories.length > 0) {
            setActiveTab(availableCategories[0]);
        }
    }, [modules]);

    useEffect(() => {
        const posKey = `modulePositions_${overlayId}`;
        const hidKey = `hiddenModules_${overlayId}`;

        const savedPos = localStorage.getItem(posKey);
        if (savedPos) {
            try { setPositions(JSON.parse(savedPos)); } catch (e) { }
        }

        const savedHid = localStorage.getItem(hidKey);
        if (savedHid) {
            try { setHiddenModules(JSON.parse(savedHid)); } catch (e) { }
        }

        setLoaded(true);
    }, [overlayId]);

    const handleDragStop = (id, data) => {
        const storageKey = `modulePositions_${overlayId}`;
        const newPositions = {
            ...positions,
            [id]: { x: data.x, y: data.y }
        };
        setPositions(newPositions);
        localStorage.setItem(storageKey, JSON.stringify(newPositions));
    };

    const toggleModule = (modName) => {
        const hidKey = `hiddenModules_${overlayId}`;
        let newHidden;
        if (hiddenModules.includes(modName)) {
            newHidden = hiddenModules.filter(m => m !== modName);
        } else {
            newHidden = [...hiddenModules, modName];
        }
        setHiddenModules(newHidden);
        localStorage.setItem(hidKey, JSON.stringify(newHidden));
    };

    const cleanLayout = () => {
        const storageKey = `modulePositions_${overlayId}`;
        const newPositions = { ...positions };
        
        const activeModules = modules.filter(m => (CATEGORY_MAP[m] || 'Other') === activeTab);
        
        activeModules.forEach((modName) => {
            const globalIndex = modules.indexOf(modName);
            const id = `${modName}-${globalIndex}`;
            
            const localIdx = activeModules.indexOf(modName);
            const row = Math.floor(localIdx / 3);
            const col = localIdx % 3;
            
            newPositions[id] = { x: 50 + (col * 420), y: 150 + (row * 420) };
        });

        setPositions(newPositions);
        localStorage.setItem(storageKey, JSON.stringify(newPositions));
    };

    if (!loaded) return null;

    return (
        <div className="flex-1 w-full relative p-4 animate-in fade-in duration-300 pointer-events-none overflow-hidden">
            {/* Docks */}
            {!overlayTransparent && modules.length > 0 && (
                <>
                    {/* Top Dock: Categories */}
                    <div
                        className="absolute top-0 left-1/2 -translate-x-1/2 flex items-center justify-center flex-row gap-8 backdrop-blur-xl border-b px-12 pt-6 z-50 pointer-events-auto"
                        style={{ borderColor: 'var(--color-widget-hover)' }}
                    >
                        {availableCategories.map(cat => {
                            const isActive = activeTab === cat;
                            return (
                                <button
                                    key={`tab-${cat}`}
                                    onClick={() => setActiveTab(cat)}
                                    className="relative text-sm font-bold uppercase tracking-[0.2em] transition-all px-6 pt-5 pb-4 overflow-hidden"
                                    style={{
                                        color: 'var(--color-widget-text)',
                                        opacity: isActive ? 1 : 0.5
                                    }}
                                >
                                    {cat}

                                    {isActive && (
                                        <div
                                            className="absolute bottom-0 left-0 w-full h-full pointer-events-none"
                                            style={{
                                                background: 'linear-gradient(to top, var(--color-widget-active) 0%, transparent 100%)',
                                                opacity: 0.7
                                            }}
                                        />
                                    )}

                                    {isActive && (
                                        <div
                                            className="absolute bottom-0 left-0 w-full h-0.75"
                                            style={{ backgroundColor: 'var(--color-widget-active)' }}
                                        />
                                    )}
                                </button>
                            );
                        })}
                    </div>

                    {/* Bottom Dock: Module Toggles */}
                    <div
                        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center justify-center flex-row gap-1.5 backdrop-blur-xl border rounded-md px-5 py-2.5 z-50 shadow-2xl pointer-events-auto"
                        style={{
                            backgroundColor: 'var(--color-widget)',
                            borderColor: 'var(--color-widget-hover)'
                        }}
                    >
                        <button
                            onClick={cleanLayout}
                            className="px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-300 hover:scale-105 mr-2 flex items-center gap-2"
                            style={{
                                backgroundColor: 'var(--color-widget-active)',
                                color: 'var(--color-widget-text)',
                                border: '1px solid var(--color-widget-active-hover)',
                                boxShadow: '0 0 10px rgba(0,0,0,0.2)'
                            }}
                            title="Auto-arrange layout"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
                            Clean Layout
                        </button>
                        
                        <div className="w-px h-6 bg-white/20 mx-1"></div>

                        {modules.filter(m => (CATEGORY_MAP[m] || 'Other') === activeTab).map((modName) => {
                            const isHidden = hiddenModules.includes(modName);
                            return (
                                <button
                                    key={`toggle-${modName}`}
                                    onClick={() => toggleModule(modName)}
                                    className="px-3 py-1 rounded-md text-sm font-medium transition-all duration-300 hover:scale-105"
                                    style={{
                                        backgroundColor: isHidden ? 'transparent' : 'var(--color-widget-active)',
                                        color: 'var(--color-widget-text)',
                                        opacity: isHidden ? 0.5 : 1,
                                        border: `1px solid ${isHidden ? 'transparent' : 'var(--color-widget-active-hover)'}`,
                                        boxShadow: isHidden ? 'none' : '0 0 10px rgba(0,0,0,0.2)'
                                    }}
                                >
                                    {modName}
                                </button>
                            )
                        })}
                    </div>
                </>
            )}

            {modules.length === 0 ? (
                <div className="w-full h-full flex flex-col items-center justify-center">
                    <h1 className="text-6xl font-bold mb-4 bg-linear-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent drop-shadow-lg">
                        {title}
                    </h1>
                    <p className="text-white/60 mb-12 text-lg">No modules configured in config.yaml for {overlayId}.</p>
                </div>
            ) : (
                modules.map((modName, index) => {
                    const cat = CATEGORY_MAP[modName] || 'Other';
                    const isVisible = (cat === activeTab) && !hiddenModules.includes(modName);

                    const id = `${modName}-${index}`;
                    const pos = positions[id] || { x: index * 40, y: (index * 40) + 80 };
                    return (
                        <DraggableModule
                            key={id}
                            id={id}
                            overlayId={overlayId}
                            modName={modName}
                            position={pos}
                            onStop={handleDragStop}
                            isVisible={isVisible}
                        />
                    );
                })
            )}
        </div>
    );
}
