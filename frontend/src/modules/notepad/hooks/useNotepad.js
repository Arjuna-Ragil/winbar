import { useState, useEffect } from 'react';

export default function useNotepad() {
    const [notes, setNotes] = useState([]);
    const [activeNoteId, setActiveNoteId] = useState(null);

    // Load notes on mount and handle migration
    useEffect(() => {
        const savedList = localStorage.getItem('notepad_list');
        const legacyNote = localStorage.getItem('notepad_content');
        
        if (savedList) {
            try {
                setNotes(JSON.parse(savedList));
            } catch (e) {
                console.error("Failed to parse notes", e);
            }
        } else if (legacyNote && legacyNote !== "<div>Write something here...</div>") {
            // Migrate old note
            const migrated = [{
                id: Date.now().toString(),
                title: 'Chapter I',
                content: legacyNote,
                date: new Date().toLocaleDateString()
            }];
            setNotes(migrated);
            localStorage.setItem('notepad_list', JSON.stringify(migrated));
        }
    }, []);

    const saveNotes = (newNotes) => {
        setNotes(newNotes);
        localStorage.setItem('notepad_list', JSON.stringify(newNotes));
    };

    const handleCreateNote = () => {
        const newNote = {
            id: Date.now().toString(),
            title: `Chapter ${notes.length + 1}`,
            content: "<div>Start writing...</div>",
            date: new Date().toLocaleDateString()
        };
        saveNotes([...notes, newNote]);
        setActiveNoteId(newNote.id);
    };

    const handleDeleteNote = (e, id) => {
        e.stopPropagation();
        saveNotes(notes.filter(n => n.id !== id));
    };

    return {
        notes,
        activeNoteId,
        setActiveNoteId,
        saveNotes,
        handleCreateNote,
        handleDeleteNote
    };
}
