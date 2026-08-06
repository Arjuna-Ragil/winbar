import { lazy, Suspense } from 'react';

const YamwModule = lazy(() => import('./yamw/YamwModule'));
const Notepad = lazy(() => import('./notepad/Notepad'));
const TodoModule = lazy(() => import('./todo/TodoModule'));
const DrawingModule = lazy(() => import('./drawing/DrawingModule'));
const Companion = lazy(() => import('./companion/Companion'))
const SysInfoModule = lazy(() => import('./sysinfo/SysInfoModule'));
const ControlCenter = lazy(() => import('./controlcenter/ControlCenter'));
const ServerModule = lazy(() => import('./server/ServerModule'));
const DockerModule = lazy(() => import('./docker/DockerModule'));

const FallbackLoader = () => (
    <div className="flex items-center justify-center p-4">
        <span className="font-serif italic text-black/50">Loading module...</span>
    </div>
);

const ModuleRenderer = ({ name }) => {
    const renderModule = () => {
        switch (name) {
            case 'yamw':
                return <YamwModule />;
            case 'notepad':
                return <Notepad />;
            case 'todo':
                return <TodoModule />;
            case 'drawing':
                return <DrawingModule />;
            case 'companion':
                return <Companion />;
            case 'sysinfo':
                return <SysInfoModule />;
            case 'controlcenter':
                return <ControlCenter />;
            case 'server':
                return <ServerModule />;
            case 'docker':
                return <DockerModule />;
            default:
                return <div className="p-4 bg-red-500/20 text-red-500 rounded-lg">Unknown Module: {name}</div>;
        }
    };

    return (
        <Suspense fallback={<FallbackLoader />}>
            {renderModule()}
        </Suspense>
    );
};

export default ModuleRenderer;
