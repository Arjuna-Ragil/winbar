import { useState, useEffect } from 'react';
import { GetApps, AddApp, RemoveApp, LaunchApp } from '../../../wailsjs/go/handlers/Launcher';
import { EventsEmit } from '../../../wailsjs/runtime/runtime';

const LauncherModule = () => {
    const [apps, setApps] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchApps();
    }, []);

    const fetchApps = async () => {
        setLoading(true);
        try {
            const result = await GetApps();
            setApps(result || []);
        } catch (err) {
            console.error("Failed to load apps:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleAddApp = async () => {
        try {
            const newApp = await AddApp();
            if (newApp) {
                setApps([...apps, newApp]);
            }
        } catch (err) {
            console.error("Failed to add app:", err);
        }
    };

    const handleRemoveApp = async (path, e) => {
        e.stopPropagation();
        try {
            const success = await RemoveApp(path);
            if (success) {
                setApps(apps.filter(app => app.path !== path));
            }
        } catch (err) {
            console.error("Failed to remove app:", err);
        }
    };

    const handleLaunch = async (path) => {
        try {
            await LaunchApp(path);
            EventsEmit("toggle_dashboard");
        } catch (err) {
            console.error("Failed to launch app:", err);
        }
    };

    return (
        <div className="p-6 bg-[#090b14]/80 backdrop-blur-md rounded-2xl w-full max-w-2xl shadow-2xl border border-white/5 text-white flex flex-col gap-4">
            <div className="flex justify-between items-center mb-2 drag-handle cursor-move">
                <h2 className="text-xs font-bold text-white/50 uppercase tracking-wider flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                    Favorite Apps
                </h2>
                <button 
                    onClick={handleAddApp}
                    className="p-1 hover:bg-white/10 rounded transition-colors text-white/50 hover:text-white flex items-center gap-1 text-xs"
                    title="Add App"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add
                </button>
            </div>

            <div className="flex-1 w-full min-h-32">
                {loading ? (
                    <div className="flex justify-center items-center h-32">
                        <div className="w-6 h-6 border-2 border-[#3b82f6] border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : apps.length === 0 ? (
                    <div className="flex flex-col justify-center items-center h-32 text-white/30 gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2z" />
                        </svg>
                        <span className="text-sm">No apps added yet</span>
                    </div>
                ) : (
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4 p-1">
                        {apps.map((app, i) => (
                            <div 
                                key={i}
                                onClick={() => handleLaunch(app.path)}
                                className="group relative flex flex-col items-center gap-2 p-3 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-[#3b82f6]/50 rounded-xl cursor-pointer transition-all hover:-translate-y-1 hover:shadow-[0_4px_20px_rgba(59,130,246,0.15)]"
                                title={app.path}
                            >
                                <div className="w-12 h-12 flex justify-center items-center bg-black/20 rounded-lg p-1">
                                    {app.icon ? (
                                        <img src={app.icon} alt={app.name} className="max-w-full max-h-full object-contain drop-shadow-md" />
                                    ) : (
                                        <div className="text-xl font-bold text-[#3b82f6]">
                                            {app.name.charAt(0).toUpperCase()}
                                        </div>
                                    )}
                                </div>
                                <span className="text-xs font-medium text-white/80 group-hover:text-white truncate w-full text-center">
                                    {app.name}
                                </span>
                                
                                <button
                                    onClick={(e) => handleRemoveApp(app.path, e)}
                                    className="absolute -top-2 -right-2 bg-red-500/80 hover:bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                                    title="Remove"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default LauncherModule;
