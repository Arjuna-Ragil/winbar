export default function StatCard({ icon, label, value, subtext, color }) {
    return (
        <div className="bg-[#111827] border border-white/5 rounded-2xl relative overflow-hidden flex flex-col items-center p-5 shadow-lg flex-1 min-w-35">
            <div className={`absolute top-0 left-6 h-1 w-12 rounded-full`} style={{ backgroundColor: color }}></div>
            <div className="mb-2 mt-1">
                {icon}
            </div>
            <span className="text-sm font-semibold text-white/50 tracking-wider mb-1 uppercase">{label}</span>
            <span className="text-2xl font-bold text-white mb-1">{(value || 0).toFixed(1)}<span className="text-base text-white/40 ml-1">%</span></span>
            {subtext ? (
                <span className="text-xs text-white/40 font-medium">{subtext}</span>
            ) : (
                <span className="text-xs text-transparent select-none">placeholder</span>
            )}
        </div>
    );
}
