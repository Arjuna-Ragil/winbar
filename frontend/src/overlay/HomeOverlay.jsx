import ModuleRenderer from '../modules/ModuleRenderer';

export default function HomeOverlay({ modules = [] }) {
    return (
        <div className="flex-1 w-full flex p-4 gap-4 animate-in fade-in duration-300 pointer-events-auto overflow-y-auto">
            {modules.length === 0 ? (
                <div className="w-full flex flex-col items-center justify-center">
                    <h1 className="text-6xl font-bold mb-4 bg-linear-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent drop-shadow-lg">
                        Home Dashboard
                    </h1>
                    <p className="text-white/60 mb-12 text-lg">No modules configured in config.yaml.</p>
                </div>
            ) : (
                modules.map((modName, index) => (
                    <ModuleRenderer key={`${modName}-${index}`} name={modName} />
                ))
            )}
        </div>
    );
}
