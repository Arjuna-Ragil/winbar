import { Excalidraw } from '@excalidraw/excalidraw';
import '@excalidraw/excalidraw/index.css';
import useDrawing from './hooks/useDrawing';
import { Palette } from 'lucide-react';

export default function DrawingModule() {
    const { initialData, handleChange } = useDrawing();

    if (!initialData) {
        return (
            <div className="flex flex-col text-white pointer-events-auto overflow-hidden relative items-center justify-center"
                style={{ width: '500px', height: '400px' }}>
                <span className="font-['Caveat'] text-2xl text-white/50">Loading canvas...</span>
            </div>
        );
    }

    return (
        <div className="flex flex-col text-white pointer-events-auto resize overflow-hidden relative"
            style={{ width: '500px', height: '400px', minWidth: '400px', minHeight: '300px' }}>

            <style>{`
                /* Target Excalidraw's internal UI if we want to theme it slightly */
                .excalidraw {
                    --color-primary: var(--color-widget);
                    --color-primary-darker: var(--color-widget-hover);
                }
            `}</style>



            {/* Toolbar Area */}
            <div className="flex items-center justify-between p-2 mx-1 mt-0 bg-white/5 border-b border-white/10 rounded-t-sm border-l">
                <div className="flex items-center gap-2">
                    <Palette size={18} className="text-white" />
                    <div className="font-serif font-bold text-xl text-white">Drawing Board</div>
                </div>
            </div>

            {/* Excalidraw Canvas Area */}
            <div className="flex-1 m-1 mt-0 rounded-b-sm overflow-hidden relative border-l border-white/10 bg-transparent">
                <Excalidraw
                    initialData={{
                        ...initialData,
                        appState: {
                            ...initialData.appState,
                            viewBackgroundColor: 'transparent',
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
