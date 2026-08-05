import { useState, useEffect } from 'react';
import { EventsOn } from '../../wailsjs/runtime/runtime';
import { SwitchWorkspace } from '../../wailsjs/go/handlers/SystemHandler';

export default function WorkspaceWidget() {
    const [activeWs, setActiveWs] = useState(1);

    useEffect(() => {
        EventsOn("workspace_changed", (numStr) => {
            setActiveWs(parseInt(numStr, 10));
        });
    }, []);

    const workspaces = [1, 2, 3, 4, 5, 6, 7, 8, 9];

    return (
        <div className="widget p-1! py-1.5! gap-1!">
            {workspaces.map((ws) => (
                <div
                    key={ws}
                    onClick={() => SwitchWorkspace(ws)}
                    className={`cursor-pointer w-5 h-5 flex items-center justify-center rounded-sm text-sm font-bold transition-all duration-300 ${activeWs === ws
                            ? 'bg-white text-blue-600 shadow-sm'
                            : 'text-white/60 hover:bg-white/20 hover:text-white'
                        }`}
                >
                    {ws}
                </div>
            ))}
        </div>
    );
}
