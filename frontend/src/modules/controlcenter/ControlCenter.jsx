import { useState, useEffect } from 'react';
import { Volume2, VolumeX, Sun, Wifi, Loader2, ChevronDown, ChevronUp } from 'lucide-react';
import { GetVolume, SetVolume, GetBrightness, SetBrightness, GetWifiNetworks, ConnectWifi } from '../../../wailsjs/go/handlers/ControlCenterHandler.js';

export default function ControlCenter() {
    const [volume, setVolume] = useState(50);
    const [brightness, setBrightness] = useState(50);
    const [wifiNetworks, setWifiNetworks] = useState([]);
    const [isWifiOpen, setIsWifiOpen] = useState(false);
    const [connectingWifi, setConnectingWifi] = useState(null);

    useEffect(() => {
        const syncState = async () => {
            if (typeof GetVolume === 'function') {
                try {
                    const v = await GetVolume();
                    setVolume(v);
                    const b = await GetBrightness();
                    setBrightness(b);
                } catch(e) {
                    // Ignore errors during polling
                }
            }
        };
        syncState();
        
        const timer = setInterval(syncState, 1000);
        
        // Fetch WiFi networks in the background once
        if (typeof GetWifiNetworks === 'function') {
            GetWifiNetworks().then(nets => {
                if (nets) setWifiNetworks(nets);
            }).catch(console.error);
        }

        return () => clearInterval(timer);
    }, []);

    const handleVolumeChange = (e) => {
        const v = parseInt(e.target.value);
        setVolume(v);
        if (typeof SetVolume === 'function') SetVolume(v);
    };

    const handleBrightnessChange = (e) => {
        const b = parseInt(e.target.value);
        setBrightness(b);
        if (typeof SetBrightness === 'function') SetBrightness(b);
    };

    const handleConnectWifi = async (ssid) => {
        setConnectingWifi(ssid);
        if (typeof ConnectWifi === 'function') {
            await ConnectWifi(ssid);
        }
        setConnectingWifi(null);
    };

    return (
        <div className="w-80 relative flex flex-col rounded-2xl mx-auto overflow-hidden bg-slate-950/80 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)] p-4 text-white">
            <h2 className="text-lg font-bold mb-4">Control Center</h2>
            
            {/* Sliders */}
            <div className="flex flex-col gap-4 mb-6">
                {/* Brightness */}
                <div className="flex items-center gap-3 bg-white/5 p-3 rounded-xl border border-white/10">
                    <Sun size={20} className="text-amber-400" />
                    <input 
                        type="range" 
                        min="0" max="100" 
                        value={brightness} 
                        onChange={handleBrightnessChange}
                        className="w-full accent-amber-400 h-1.5 bg-white/20 rounded-lg appearance-none cursor-pointer"
                    />
                    <span className="text-xs font-bold w-8 text-right">{brightness}%</span>
                </div>

                {/* Volume */}
                <div className="flex items-center gap-3 bg-white/5 p-3 rounded-xl border border-white/10">
                    {volume === 0 ? <VolumeX size={20} className="text-white/40" /> : <Volume2 size={20} className="text-cyan-400" />}
                    <input 
                        type="range" 
                        min="0" max="100" 
                        value={volume} 
                        onChange={handleVolumeChange}
                        className="w-full accent-cyan-400 h-1.5 bg-white/20 rounded-lg appearance-none cursor-pointer"
                    />
                    <span className="text-xs font-bold w-8 text-right">{volume}%</span>
                </div>
            </div>

            {/* WiFi Picker */}
            <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden transition-all duration-300">
                <button 
                    onClick={() => setIsWifiOpen(!isWifiOpen)}
                    className="w-full flex items-center justify-between p-3 hover:bg-white/10 transition-colors"
                >
                    <div className="flex items-center gap-3">
                        <Wifi size={20} className="text-blue-400" />
                        <span className="font-semibold text-sm">Wi-Fi Networks</span>
                    </div>
                    {isWifiOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </button>
                
                {isWifiOpen && (
                    <div className="flex flex-col max-h-48 overflow-y-auto bg-black/20 border-t border-white/10 p-2 gap-1 custom-scrollbar">
                        {wifiNetworks.length === 0 ? (
                            <div className="p-3 text-center text-xs text-white/50 flex flex-col items-center gap-2">
                                <Loader2 size={16} className="animate-spin" />
                                Scanning networks...
                            </div>
                        ) : (
                            wifiNetworks.map((net, i) => (
                                <button 
                                    key={i}
                                    onClick={() => handleConnectWifi(net.ssid)}
                                    disabled={connectingWifi === net.ssid}
                                    className="flex items-center justify-between w-full p-2 rounded-lg hover:bg-white/10 transition-colors text-left"
                                >
                                    <div className="flex flex-col">
                                        <span className="text-sm font-medium">{net.ssid}</span>
                                        <span className="text-[10px] text-white/40">{net.security}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs text-white/60 font-medium">{net.signal}%</span>
                                        {connectingWifi === net.ssid ? (
                                            <Loader2 size={14} className="animate-spin text-blue-400" />
                                        ) : (
                                            <Wifi size={14} className={net.signal > 70 ? 'text-blue-400' : 'text-white/40'} />
                                        )}
                                    </div>
                                </button>
                            ))
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
