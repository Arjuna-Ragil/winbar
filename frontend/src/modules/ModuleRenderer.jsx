import { lazy, Suspense } from 'react';

// Lazy load modules so they are only downloaded/parsed when explicitly requested
const YamwModule = lazy(() => import('./yamw/YamwModule'));
const Notepad = lazy(() => import('./notepad/Notepad'));
const TodoModule = lazy(() => import('./todo/TodoModule'));
const DrawingModule = lazy(() => import('./drawing/DrawingModule'));
const AIModule = lazy(() => import('./ai/AIModule'));

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
            case 'ai':
                return <AIModule />;
            // Future modules can be added here
            default:
                return <div className="p-4 bg-red-500/20 text-red-200 rounded">Unknown module: {name}</div>;
        }
    };

    return (
        <Suspense fallback={<FallbackLoader />}>
            {renderModule()}
        </Suspense>
    );
};

export default ModuleRenderer;
