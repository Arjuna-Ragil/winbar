export default function SysInfoMetric({ icon: Icon, label, percent, mainText, subText, color }) {
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
}
