import { Plus, X } from 'lucide-react';

export default function TableOfContents({ notes, setActiveNoteId, handleCreateNote, handleDeleteNote }) {
    return (
        <div key="list-view" className="flex-1 flex flex-col p-6 scrollable overflow-y-auto">
            <div className="text-center border-b-2 border-double border-black/30 pb-3 mb-6 flex flex-col gap-3">
                <h1 className="book-title text-3xl text-black">Notepad</h1>
                <h2 className="book-title text-xl text-black">Table of Contents</h2>
            </div>
            
            <div className="flex-1 flex flex-col gap-3">
                {notes.length === 0 ? (
                    <p className="text-center font-['Caveat'] text-2xl text-black/60 italic mt-8">The pages are empty...</p>
                ) : (
                    notes.map((note, index) => (
                        <div 
                            key={note.id} 
                            onClick={() => setActiveNoteId(note.id)}
                            className="flex items-end cursor-pointer group hover:bg-black/5 p-2 rounded -mx-2 transition-colors"
                        >
                            <span className="book-title text-lg font-semibold mr-2">{index + 1}.</span>
                            <span className="font-['Caveat'] text-2xl truncate max-w-37.5">{note.title}</span>
                            <div className="flex-1 border-b-2 border-dotted border-black/20 mx-2 mb-2 group-hover:border-black/50"></div>
                            <span className="text-sm font-serif text-black/60 shrink-0 mr-2">{note.date}</span>
                            <button 
                                onClick={(e) => handleDeleteNote(e, note.id)}
                                className="opacity-0 group-hover:opacity-100 p-1 text-red-700/60 hover:text-red-700 transition-opacity rounded"
                                title="Tear out page"
                            >
                                <X size={16} className="lucide-x" />
                            </button>
                        </div>
                    ))
                )}
            </div>

            <div className="mt-6 flex justify-center pt-4 border-t border-black/10">
                <button 
                    onClick={handleCreateNote}
                    className="flex items-center gap-2 px-4 py-2 font-['Caveat'] text-2xl bg-widget text-widget-text rounded-md shadow-md hover:bg-widget-hover transition-colors"
                >
                    <Plus size={20} />
                    Write New Entry
                </button>
            </div>
        </div>
    );
}
