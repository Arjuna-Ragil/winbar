export default function HomeOverlay() {
    return (
        <div className="flex-1 w-full flex flex-col items-center justify-center animate-in fade-in duration-300 pointer-events-auto">
            <h1 className="text-6xl font-bold mb-4 bg-linear-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent drop-shadow-lg">
                Home Dashboard
            </h1>
            <p className="text-white/60 mb-12 text-lg">This is the home overlay placeholder.</p>
        </div>
    );
}
