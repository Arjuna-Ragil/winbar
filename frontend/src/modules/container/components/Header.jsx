export default function Header({ count }) {
    return (
        <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">Containers</h2>
            <span className="bg-white/10 text-white/80 text-xs px-2 py-1 rounded-full font-medium">
                {count} running
            </span>
        </div>
    );
}
