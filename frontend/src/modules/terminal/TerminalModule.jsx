import { LaunchTerminal } from '../../../wailsjs/go/terminal/Terminal';
import { EventsEmit } from '../../../wailsjs/runtime/runtime';

const TerminalModule = () => {
    return (
        <div className="p-6 bg-[#090b14]/80 backdrop-blur-md rounded-2xl shadow-2xl border border-white/5 text-white flex flex-col justify-center items-center text-center gap-4 min-w-80">
            <div className="flex justify-between items-center w-full mb-2 drag-handle cursor-move absolute top-0 left-0 p-4">
                <h2 className="text-xs font-bold text-white/50 uppercase tracking-wider flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Command Line
                </h2>
            </div>

            <div className="bg-white/5 p-4 rounded-full mb-2 mt-8">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#3b82f6]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
            </div>
            
            <div>
                <h2 className="text-xl font-bold mb-1">Windows Terminal</h2>
                <p className="text-xs text-white/50">Launch a native shell instance</p>
            </div>

            <button 
                onClick={() => {
                    LaunchTerminal();
                    EventsEmit("toggle_dashboard");
                }}
                className="mt-2 w-full py-2.5 bg-[#3b82f6]/20 hover:bg-[#3b82f6]/40 border border-[#3b82f6]/50 transition-all rounded-lg font-medium text-sm flex items-center justify-center gap-2 text-[#60a5fa]"
            >
                Launch Terminal
            </button>
        </div>
    );
};

export default TerminalModule;
