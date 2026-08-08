import { LayoutGrid } from 'lucide-react';
import LauncherAppItem from './LauncherAppItem';

export default function LauncherAppGrid({ apps, loading, onLaunch, onRemove }) {
    return (
        <div className="flex-1 w-full min-h-32">
            {loading ? (
                <div className="flex justify-center items-center h-32">
                    <div className="w-6 h-6 border-2 border-[#3b82f6] border-t-transparent rounded-full animate-spin"></div>
                </div>
            ) : apps.length === 0 ? (
                <div className="flex flex-col justify-center items-center h-32 text-white/30 gap-2">
                    <LayoutGrid />
                    <span className="text-sm">No apps added yet</span>
                </div>
            ) : (
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4 p-1">
                    {apps.map((app, i) => (
                        <LauncherAppItem
                            key={i}
                            app={app}
                            onLaunch={onLaunch}
                            onRemove={onRemove}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
