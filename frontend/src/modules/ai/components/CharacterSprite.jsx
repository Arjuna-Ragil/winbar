export default function CharacterSprite({ activeCompanion, imageError, currentImageSrc, currentExpression }) {
    return (
        <div className="absolute inset-0 flex items-end justify-center pointer-events-none z-0 overflow-hidden pt-8">
            {activeCompanion && !imageError && currentImageSrc && (
                <img
                    src={currentImageSrc}
                    alt={`Expression: ${currentExpression}`}
                    className="max-h-full max-w-full object-contain drop-shadow-2xl transition-all duration-300 pointer-events-auto"
                />
            )}
            {activeCompanion && imageError && (
                <div className="flex flex-col items-center justify-center h-full w-full opacity-30 border-2 border-dashed border-white/20 rounded-xl p-4 m-4 pointer-events-none">
                    <span>Missing Image</span>
                    <span className="text-xs font-mono mt-2">{activeCompanion.id}/{currentExpression}.png</span>
                </div>
            )}
        </div>
    );
}
