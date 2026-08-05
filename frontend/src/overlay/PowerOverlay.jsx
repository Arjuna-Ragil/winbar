import { LogOut, RefreshCcw, Moon } from 'lucide-react';
import { Shutdown, Restart, Sleep } from '../../wailsjs/go/handlers/SystemHandler.js';

export default function PowerOverlay() {
    return (
        <div className="flex-1 w-full flex flex-col items-center justify-center animate-in fade-in duration-300 pointer-events-none">
            <h1 className="text-6xl font-bold mb-4 drop-shadow-lg pointer-events-auto">
                Power Options
            </h1>
            <p className="text-white/60 mb-12 text-lg pointer-events-auto">Select an action to perform on your system.</p>

            <div className="flex gap-8 pointer-events-auto">
                <button
                    onClick={() => Sleep()}
                    className="w-40 h-40 rounded-3xl bg-white/3 hover:bg-white/8 border border-white/10 flex flex-col items-center justify-center gap-4 cursor-pointer transition-all hover:scale-105 hover:border-blue-500/50 hover:shadow-[0_0_32px_rgba(59,130,246,0.2)]"
                >
                    <div className="w-12 h-12 rounded-full border-4 border-blue-400 flex items-center justify-center text-blue-400">
                        <Moon size={24} />
                    </div>
                    <span className="font-semibold tracking-wide">Sleep</span>
                </button>

                <button
                    onClick={() => Restart()}
                    className="w-40 h-40 rounded-3xl bg-white/3 hover:bg-white/8 border border-white/10 flex flex-col items-center justify-center gap-4 cursor-pointer transition-all hover:scale-105 hover:border-orange-500/50 hover:shadow-[0_0_32px_rgba(249,115,22,0.2)]"
                >
                    <div className="w-12 h-12 rounded-full border-4 border-orange-400 flex items-center justify-center text-orange-400">
                        <RefreshCcw size={24} />
                    </div>
                    <span className="font-semibold tracking-wide">Restart</span>
                </button>

                <button
                    onClick={() => Shutdown()}
                    className="w-40 h-40 rounded-3xl bg-white/3 hover:bg-white/8 border border-white/10 flex flex-col items-center justify-center gap-4 cursor-pointer transition-all hover:scale-105 hover:border-red-500/50 hover:shadow-[0_0_32px_rgba(239,68,68,0.2)]"
                >
                    <div className="w-12 h-12 rounded-full border-4 border-red-400 flex items-center justify-center text-red-400">
                        <LogOut size={24} />
                    </div>
                    <span className="font-semibold tracking-wide">Shut Down</span>
                </button>
            </div>
        </div>
    );
}
