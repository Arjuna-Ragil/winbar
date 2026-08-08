import { useLauncher } from './hooks/useLauncher';
import LauncherHeader from './components/LauncherHeader';
import LauncherAppGrid from './components/LauncherAppGrid';

const LauncherModule = () => {
    const { apps, loading, handleAddApp, handleRemoveApp, handleLaunch } = useLauncher();

    return (
        <div className="p-6 w-full max-w-2xl text-white flex flex-col gap-4">
            <LauncherHeader onAddApp={handleAddApp} />
            <LauncherAppGrid
                apps={apps}
                loading={loading}
                onLaunch={handleLaunch}
                onRemove={handleRemoveApp}
            />
        </div>
    );
};

export default LauncherModule;
