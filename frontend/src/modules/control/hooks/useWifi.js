import { useState, useEffect } from 'react';
import { GetWifiNetworks, ConnectWifi } from '../../../../wailsjs/go/handlers/ControlHandler.js';

export function useWifi() {
    const [wifiNetworks, setWifiNetworks] = useState([]);
    const [isWifiOpen, setIsWifiOpen] = useState(false);
    const [connectingWifi, setConnectingWifi] = useState(null);

    useEffect(() => {
        if (typeof GetWifiNetworks === 'function') {
            GetWifiNetworks().then(nets => {
                if (nets) setWifiNetworks(nets);
            }).catch(console.error);
        }
    }, []);

    const handleConnectWifi = async (ssid) => {
        setConnectingWifi(ssid);
        if (typeof ConnectWifi === 'function') {
            await ConnectWifi(ssid);
        }
        setConnectingWifi(null);
    };

    return {
        wifiNetworks,
        isWifiOpen,
        setIsWifiOpen,
        connectingWifi,
        handleConnectWifi
    };
}
