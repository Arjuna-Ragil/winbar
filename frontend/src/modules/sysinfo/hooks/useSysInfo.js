import { useState, useEffect } from 'react';
import { GetSysInfo } from '../../../../wailsjs/go/handlers/SystemHandler';

export function useSysInfo() {
    const [sysInfo, setSysInfo] = useState({ cpuUsage: 0, gpuUsage: 0, ramUsage: 0, storageUsage: 0, storageUsedGb: 0, storageTotalGb: 0, gpuUsedGb: 0, gpuTotalGb: 0, ramUsedGb: 0, ramTotalGb: 0, netDownload: 0, netUpload: 0 });
    const [refreshRate, setRefreshRate] = useState(1000);

    useEffect(() => {
        const fetchInfo = () => {
            if (typeof GetSysInfo === 'function') {
                GetSysInfo().then(data => {
                    if (data) setSysInfo(data);
                }).catch(console.error);
            }
        };

        fetchInfo();
        const timer = setInterval(fetchInfo, refreshRate);
        return () => clearInterval(timer);
    }, [refreshRate]);

    return {
        sysInfo,
        refreshRate,
        setRefreshRate
    };
}
