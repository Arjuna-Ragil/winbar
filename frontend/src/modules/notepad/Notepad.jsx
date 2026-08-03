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
        <div className="flex flex-col rounded-md shadow-[5px_5px_15px_rgba(0,0,0,0.6)] border-2 border-widget text-black pointer-events-auto resize overflow-hidden relative" 
             style={{ width: '420px', height: '500px', minWidth: '350px', minHeight: '300px', backgroundColor: 'var(--color-background)' }}>
            
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
                .scrollable::-webkit-scrollbar-thumb { background: var(--color-widget); border-radius: 10px; border: 2px solid #f4ecd8; }
            `}</style>
            
            {/* Leather cover top padding (drag handle) */}
            <div className="drag-handle cursor-move h-4 shrink-0 w-full flex items-center justify-center">
                <div className="w-12 h-1 bg-widget-text rounded-full opacity-50"></div>
            </div>

            {/* Inner Paper Pages */}
            <div className="flex-1 m-1 mt-0 bg-[#f4ecd8] rounded-sm shadow-[inset_4px_0_10px_rgba(0,0,0,0.1),inset_-1px_0_2px_rgba(0,0,0,0.05)] overflow-hidden flex flex-col relative border-l border-black/10">
                
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
            
            <div className="absolute bottom-1 right-1 w-3 h-3 border-r-2 border-b-2 border-widget-text/50 pointer-events-none rounded-br-sm"></div>
        </div>
    );
}
