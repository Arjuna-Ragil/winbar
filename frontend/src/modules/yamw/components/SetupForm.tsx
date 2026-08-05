import { useState } from 'react';
import { X } from 'lucide-react';
import { PingTest } from "../../../../wailsjs/go/handlers/Health";
import { SaveConfig } from "../../../../wailsjs/go/main/App";

interface SetupFormProps {
    t: any;
    isOverlay?: boolean;
    onClose?: () => void;
    onSuccess: () => void;
}

export const SetupForm = ({ t, isOverlay = false, onClose, onSuccess }: SetupFormProps) => {
    const [serverUrl, setServerUrl] = useState<string>('');
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [setupError, setSetupError] = useState<string>('');
    const [isTesting, setIsTesting] = useState<boolean>(false);

    const handleSetup = async (e: React.FormEvent) => {
        e.preventDefault();
        setSetupError('');
        setIsTesting(true);
        try {
            const resStr = await PingTest(serverUrl, username, password);
            const res = JSON.parse(resStr);
            if (res["subsonic-response"] && res["subsonic-response"].status === "ok") {
                await SaveConfig(serverUrl, username, password);
                onSuccess();
            } else {
                setSetupError(res["subsonic-response"]?.error?.message || "Failed to connect.");
            }
        } catch (err: any) {
            setSetupError(err.toString() || "Connection error.");
        } finally {
            setIsTesting(false);
        }
    };

    return (
        <div className={`flex flex-col h-full ${isOverlay ? 'p-6 bg-black/95 backdrop-blur-xl absolute inset-0 z-60' : 'p-4 flex-1'}`}>
            {isOverlay && onClose && (
                <button
                    onClick={onClose}
                    className={`absolute top-4 right-4 ${t.muted} hover:${t.base} transition-colors`}
                >
                    <X size={24} />
                </button>
            )}
            <h2 className={`text-xl font-bold mb-4 text-center ${t.accent}`}>SERVER CONFIG</h2>
            <form onSubmit={handleSetup} className="flex flex-col gap-3">
                <div className="flex flex-col gap-1">
                    <label className="text-sm">Subsonic Server URL</label>
                    <input
                        type="url"
                        required
                        value={serverUrl}
                        onChange={e => setServerUrl(e.target.value)}
                        className={`bg-black/50 border ${t.border} rounded px-2 py-1 ${t.base} focus:outline-none focus:${t.borderActive} transition-colors placeholder:opacity-30`}
                        placeholder="http://192.168.1.10:4533"
                    />
                </div>
                <div className="flex flex-col gap-1">
                    <label className="text-sm">Username</label>
                    <input
                        type="text"
                        required
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                        className={`bg-black/50 border ${t.border} rounded px-2 py-1 ${t.base} focus:outline-none focus:${t.borderActive} transition-colors`}
                    />
                </div>
                <div className="flex flex-col gap-1">
                    <label className="text-sm">Password</label>
                    <input
                        type="password"
                        required
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        className={`bg-black/50 border ${t.border} rounded px-2 py-1 ${t.base} focus:outline-none focus:${t.borderActive} transition-colors`}
                    />
                </div>
                {setupError && <div className="text-red-400 text-sm mt-1 text-center bg-red-900/20 p-1 rounded border border-red-900/50">{setupError}</div>}
                <button
                    type="submit"
                    disabled={isTesting}
                    className={`mt-3 ${t.bgMuted} ${t.bgHover} border ${t.border} rounded py-2 text-center font-bold transition-colors disabled:opacity-50`}
                >
                    {isTesting ? "CONNECTING..." : "CONNECT & SAVE"}
                </button>
            </form>
        </div>
    );
};
