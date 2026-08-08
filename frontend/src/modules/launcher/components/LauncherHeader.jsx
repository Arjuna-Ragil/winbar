import { AppWindow, Plus } from 'lucide-react';

export default function LauncherHeader({ onAddApp }) {
    return (
        <div className="flex justify-between items-center mb-2 drag-handle cursor-move gap-10">
            <h2 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <AppWindow />
                Favorite Apps
            </h2>
            <button
                onClick={onAddApp}
                className="p-1 hover:bg-white/10 rounded transition-colors text-white hover:text-white flex items-center justify-end gap-1 text-xs"
                title="Add App"
            >
                <Plus />
                Add
            </button>
        </div>
    );
}
