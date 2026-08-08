import useNotepad from './hooks/useNotepad';
import TableOfContents from './components/TableOfContents';
import NotepadEditor from './components/NotepadEditor';

export default function Notepad() {
    const {
        notes,
        activeNoteId,
        setActiveNoteId,
        saveNotes,
        handleCreateNote,
        handleDeleteNote
    } = useNotepad();

    return (
        <div className="flex flex-col text-white pointer-events-auto resize overflow-hidden relative"
            style={{ width: '350px', height: '400px', minWidth: '350px', minHeight: '300px' }}>

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@400..700&family=Playfair+Display:ital,wght@0,600;1,600&display=swap');
                
                .notepad-editor { 
                    font-family: 'Caveat', cursive; 
                    font-size: 1.6rem; 
                    line-height: 1.3; 
                    outline: none;
                }
                .notepad-editor h1 { font-family: 'Playfair Display', serif; font-size: 2.2rem; margin-bottom: 0.5rem; text-align: center; }
                .notepad-editor h2 { font-family: 'Playfair Display', serif; font-size: 1.8rem; margin-bottom: 0.5rem; }
                .notepad-editor h3 { font-family: 'Playfair Display', serif; font-size: 1.5rem; margin-bottom: 0.5rem; }
                .notepad-editor ul { list-style-type: disc; padding-left: 2rem; margin-bottom: 0.5rem; }
                .notepad-editor b, .notepad-editor strong { font-weight: 700; }
                
                .book-title { font-family: 'Playfair Display', serif; }
                
                /* Custom scrollbar for notepad */
                .scrollable::-webkit-scrollbar { width: 8px; }
                .scrollable::-webkit-scrollbar-track { background: transparent; }
                .scrollable::-webkit-scrollbar-thumb { background: var(--color-widget); border-radius: 10px; border: 2px solid transparent; }
            `}</style>

            <div className="flex-1 m-1 mt-0 bg-transparent rounded-sm overflow-hidden flex flex-col relative border-l border-white/10">

                {!activeNoteId ? (
                    <TableOfContents
                        notes={notes}
                        setActiveNoteId={setActiveNoteId}
                        handleCreateNote={handleCreateNote}
                        handleDeleteNote={handleDeleteNote}
                    />
                ) : (
                    <NotepadEditor
                        activeNoteId={activeNoteId}
                        notes={notes}
                        saveNotes={saveNotes}
                        setActiveNoteId={setActiveNoteId}
                    />
                )}
            </div>

            <div className="absolute bottom-1 right-1 w-3 h-3 border-r-2 border-b-2 border-widget-text/50 pointer-events-none rounded-br-sm z-50"></div>
        </div>
    );
}
