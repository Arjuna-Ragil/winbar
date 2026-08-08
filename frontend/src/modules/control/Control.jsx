import { useSystemControl } from './hooks/useSystemControl';
import { useWifi } from './hooks/useWifi';
import BrightnessControl from './components/BrightnessControl';
import VolumeControl from './components/VolumeControl';
import WifiMenu from './components/WifiMenu';

export default function Control() {
    const { volume, brightness, handleVolumeChange, handleBrightnessChange } = useSystemControl();
    const { wifiNetworks, isWifiOpen, setIsWifiOpen, connectingWifi, handleConnectWifi } = useWifi();

    return (
        <div className="w-80 relative flex flex-col p-4 text-white">
            <h2 className="text-lg font-bold mb-4">Control</h2>
            <div className="flex flex-col gap-4 mb-6">
                <BrightnessControl brightness={brightness} onBrightnessChange={handleBrightnessChange} />
                <VolumeControl volume={volume} onVolumeChange={handleVolumeChange} />
            </div>
            <WifiMenu 
                wifiNetworks={wifiNetworks} 
                isWifiOpen={isWifiOpen} 
                setIsWifiOpen={setIsWifiOpen} 
                connectingWifi={connectingWifi} 
                onConnectWifi={handleConnectWifi} 
            />
        </div>
    );
}
