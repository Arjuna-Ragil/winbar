import { useState, useEffect } from 'react';
import { Cpu, HardDrive, Monitor, Settings, Check, ArrowDown, ArrowUp } from 'lucide-react';
import { GetSysInfo } from '../../../wailsjs/go/handlers/SystemHandler';

const REFRESH_OPTIONS = [
    { label: 'Realtime (1s)', value: 1000 },
    { label: '5s', value: 5000 },
    { label: '10s', value: 10000 },
    { label: '30s', value: 30000 },
    { label: '1m', value: 60000 },
    { label: '5m', value: 300000 },
];

export default function SysInfoModule() {
    const [sysInfo, setSysInfo] = useState({ cpuUsage: 0, gpuUsage: 0, ramUsage: 0, storageUsage: 0 });
    const [refreshRate, setRefreshRate] = useState(1000);
    const [showSettings, setShowSettings] = useState(false);

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

    const Metric = ({ icon: Icon, label, percent, mainText, subText, color }) => {
        return (
            <div className="flex flex-col items-center justify-center bg-white/5 border border-white/10 rounded-xl p-3 flex-1 relative overflow-hidden group hover:bg-white/10 transition-all duration-300 hover:-translate-y-1">
                <div className="absolute top-0 left-0 w-full h-1 bg-white/10">
                    <div
                        className={`h-full ${color} transition-all duration-1000`}
                        style={{ width: `${percent}%` }}
                    />
                </div>
                <Icon size={24} className={`mb-1.5 ${color.replace('bg-', 'text-')}`} />
                <span className="text-white/60 text-xs font-semibold tracking-wider uppercase mb-0.5">{label}</span>
                <span className="text-white font-bold text-lg drop-shadow-md">
                    {mainText}
                </span>
                {subText && (
                    <span className="text-white/40 text-[10px] font-medium tracking-wide mt-0.5">
                        {subText}
                    </span>
                )}
            </div>
        );
    };

    return (
        <div className="w-80 relative flex flex-col p-4 text-white">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold ">System Resources</h2>
                <div className="relative">
                    <button
                        onClick={() => setShowSettings(!showSettings)}
                        className="p-1.5 rounded-full hover:bg-white/10 text-white/60 hover:text-white transition-colors"
                    >
                        <Settings size={18} />
                    </button>
                    {showSettings && (
                        <div className="absolute right-0 top-full mt-2 w-40 bg-black/40 backdrop-blur-xl border border-white/10 rounded-xl shadow-xl overflow-hidden z-50 animate-in slide-in-from-top-2">
                            {REFRESH_OPTIONS.map(opt => (
                                <button
                                    key={opt.value}
                                    onClick={() => {
                                        setRefreshRate(opt.value);
                                        setShowSettings(false);
                                    }}
                                    className="w-full text-left px-4 py-2 text-sm flex items-center justify-between hover:bg-white/10 transition-colors"
                                >
                                    <span className={refreshRate === opt.value ? "text-cyan-400 font-medium" : "text-white/80"}>
                                        {opt.label}
                                    </span>
                                    {refreshRate === opt.value && <Check size={14} className="text-cyan-400" />}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
                <Metric
                    icon={Cpu} label="CPU" color="bg-blue-400"
                    percent={sysInfo.cpuUsage}
                    mainText={<>{sysInfo.cpuUsage?.toFixed(1) || 0}<span className="text-sm text-white/60 ml-0.5">%</span></>}
                />
                <Metric
                    icon={Monitor} label="GPU" color="bg-green-400"
                    percent={sysInfo.gpuUsage}
                    mainText={<>{sysInfo.gpuUsage?.toFixed(1) || 0}<span className="text-sm text-white/60 ml-0.5">%</span></>}
                    subText={sysInfo.gpuTotalGb ? `${sysInfo.gpuUsedGb?.toFixed(1)} / ${sysInfo.gpuTotalGb?.toFixed(1)} GB` : null}
                />
                <Metric
                    icon={Cpu} label="RAM" color="bg-purple-400"
                    percent={sysInfo.ramUsage}
                    mainText={<>{sysInfo.ramUsage?.toFixed(1) || 0}<span className="text-sm text-white/60 ml-0.5">%</span></>}
                    subText={`${sysInfo.ramUsedGb?.toFixed(1) || 0} / ${sysInfo.ramTotalGb?.toFixed(1) || 0} GB`}
                />
                <Metric
                    icon={HardDrive} label="Storage" color="bg-orange-400"
                    percent={sysInfo.storageUsage}
                    mainText={<>{sysInfo.storageUsage?.toFixed(1) || 0}<span className="text-sm text-white/60 ml-0.5">%</span></>}
                    subText={`${sysInfo.storageUsedGb?.toFixed(0) || 0} / ${sysInfo.storageTotalGb?.toFixed(0) || 0} GB`}
                />
            </div>

            <div className="mt-3 flex gap-3">
                <div className="flex-1 bg-white/5 border border-white/10 rounded-xl p-3 flex items-center gap-3">
                    <div className="p-2 bg-cyan-500/20 rounded-lg text-cyan-400">
                        <ArrowDown size={18} />
                    </div>
                    <div>
                        <div className="text-white/60 text-[10px] font-semibold uppercase tracking-wider">Download</div>
                        <div className="text-white font-bold">{sysInfo.netDownload?.toFixed(2) || '0.00'} <span className="text-xs text-white/60 font-medium">MB/s</span></div>
                    </div>
                </div>
                <div className="flex-1 bg-white/5 border border-white/10 rounded-xl p-3 flex items-center gap-3">
                    <div className="p-2 bg-pink-500/20 rounded-lg text-pink-400">
                        <ArrowUp size={18} />
                    </div>
                    <div>
                        <div className="text-white/60 text-[10px] font-semibold uppercase tracking-wider">Upload</div>
                        <div className="text-white font-bold">{sysInfo.netUpload?.toFixed(2) || '0.00'} <span className="text-xs text-white/60 font-medium">MB/s</span></div>
                    </div>
                </div>
            </div>

            {showSettings && (
                <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowSettings(false)}
                />
            )}
        </div>
    );
}
