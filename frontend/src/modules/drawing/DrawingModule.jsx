import { Excalidraw } from '@excalidraw/excalidraw';
import '@excalidraw/excalidraw/index.css';
import useDrawing from './hooks/useDrawing';
import { Palette } from 'lucide-react';

export default function DrawingModule() {
    const { initialData, handleChange } = useDrawing();

    if (!initialData) {
        return (
            <div className="flex flex-col rounded-md shadow-[5px_5px_15px_rgba(0,0,0,0.6)] border-2 border-widget text-black pointer-events-auto overflow-hidden relative items-center justify-center"
                style={{ width: '500px', height: '400px', backgroundColor: 'var(--color-background)' }}>
                <span className="font-['Caveat'] text-2xl text-white/50">Loading canvas...</span>
            </div>
        );
    }

    return (
        <div className="flex flex-col rounded-md shadow-[5px_5px_15px_rgba(0,0,0,0.6)] border-2 border-widget text-black pointer-events-auto resize overflow-hidden relative"
            style={{ width: '500px', height: '400px', minWidth: '400px', minHeight: '300px', backgroundColor: 'var(--color-background)' }}>

            <style>{`
                /* Target Excalidraw's internal UI if we want to theme it slightly */
                .excalidraw {
                    --color-primary: var(--color-widget);
                    --color-primary-darker: var(--color-widget-hover);
                }
            `}</style>

            {/* Leather cover top padding (drag handle) */}
            <div className="drag-handle cursor-move h-4 shrink-0 w-full flex items-center justify-center">
                <div className="w-12 h-1 bg-widget-text rounded-full opacity-50"></div>
            </div>

            {/* Toolbar Area */}
            <div className="flex items-center justify-between p-2 mx-1 mt-0 bg-[#f4ecd8] border-b border-black/10 rounded-t-sm shadow-[inset_4px_0_10px_rgba(0,0,0,0.1),inset_-1px_0_2px_rgba(0,0,0,0.05)] border-l">
                <div className="flex items-center gap-2">
                    <Palette size={18} className="text-[#3e2723]" />
                    <div className="font-serif font-bold text-xl text-[#3e2723]">Drawing Board</div>
                </div>
            </div>

            {/* Excalidraw Canvas Area */}
            <div className="flex-1 m-1 mt-0 rounded-b-sm shadow-[inset_4px_0_10px_rgba(0,0,0,0.1),inset_-1px_0_2px_rgba(0,0,0,0.05)] overflow-hidden relative border-l border-black/10">
                <Excalidraw
                    initialData={{
                        ...initialData,
                        appState: {
                            ...initialData.appState,
                            viewBackgroundColor: '#f4ecd8',
                            currentItemFontFamily: 3,
                        }
                    }}
                    onChange={handleChange}
                    theme={theme}
                    UIOptions={{
                        canvasActions: {
                            changeViewBackgroundColor: false,
                            clearCanvas: true,
                            export: false,
                            loadScene: false,
                            saveToActiveFile: false,
                            theme: false,
                            saveAsImage: false
                        }
                    }}
                />
            </div>

            {/* Visual resize indicator */}
            <div className="absolute bottom-1 right-1 w-3 h-3 border-r-2 border-b-2 border-widget-text/50 pointer-events-none rounded-br-sm z-50"></div>
        </div>
    );
}
