import useAIChat from './hooks/useAIChat';
import CharacterSprite from './components/CharacterSprite';
import TopControls from './components/TopControls';
import ChatDialog from './components/ChatDialog';
import HistoryModal from './components/HistoryModal';

export default function Companion() {
    const {
        companions, activeCompanion, activeCompanionId, setActiveCompanionId,
        messages, input, setInput, isLoading,
        currentExpression, fullMessage, displayedMessage, setDisplayedMessage,
        showHistory, setShowHistory, imageError, currentImageSrc, hideUI, setHideUI,
        handleSend
    } = useAIChat();

    return (
        <div className="flex flex-col rounded-md text-white pointer-events-auto resize overflow-hidden relative"
            style={{ width: '450px', height: '600px', minWidth: '350px', minHeight: '400px' }}>

            <style>{`
                .chat-scrollable::-webkit-scrollbar { width: 6px; }
                .chat-scrollable::-webkit-scrollbar-track { background: transparent; }
                .chat-scrollable::-webkit-scrollbar-thumb { background: var(--color-widget); border-radius: 10px; }
            `}</style>

            <CharacterSprite 
                activeCompanion={activeCompanion} 
                imageError={imageError} 
                currentImageSrc={currentImageSrc} 
                currentExpression={currentExpression} 
            />

            <div className="flex-1 pointer-events-none"></div>

            <TopControls 
                hideUI={hideUI} 
                setHideUI={setHideUI}
                companions={companions} 
                activeCompanionId={activeCompanionId} 
                setActiveCompanionId={setActiveCompanionId}
                showHistory={showHistory} 
                setShowHistory={setShowHistory} 
            />

            {!hideUI && (
                <ChatDialog 
                    activeCompanion={activeCompanion} 
                    isLoading={isLoading}
                    displayedMessage={displayedMessage} 
                    fullMessage={fullMessage} 
                    setDisplayedMessage={setDisplayedMessage}
                    input={input} 
                    setInput={setInput} 
                    handleSend={handleSend} 
                />
            )}

            <HistoryModal 
                showHistory={showHistory} 
                setShowHistory={setShowHistory} 
                messages={messages} 
                activeCompanion={activeCompanion} 
            />

            <div className="absolute bottom-1 right-1 w-3 h-3 border-r-2 border-b-2 border-white/20 pointer-events-none rounded-br-sm z-50"></div>
        </div>
    );
}
