import { useState, useEffect, useRef } from 'react';
import { Bold, Italic, Underline, Strikethrough, List, Heading1, Heading2, Heading3, ArrowLeft, AlignLeft, AlignCenter, AlignRight, AlignJustify } from 'lucide-react';

export default function NotepadEditor({ activeNoteId, notes, saveNotes, setActiveNoteId }) {
    const [activeFormats, setActiveFormats] = useState({});
    const editorRef = useRef(null);

    useEffect(() => {
        if (activeNoteId && editorRef.current) {
            const note = notes.find(n => n.id === activeNoteId);
            if (note && editorRef.current.innerHTML !== note.content) {
                editorRef.current.innerHTML = note.content;
            }
            editorRef.current.focus();
            checkActiveFormats();
        }
    }, [activeNoteId]);

    const handleInput = () => {
        if (!editorRef.current || !activeNoteId) return;

        const text = editorRef.current.innerText.trim();
        const firstLine = text.split('\n')[0].substring(0, 30);
        let title = firstLine || `Chapter ${notes.findIndex(n => n.id === activeNoteId) + 1}`;
        if (title.length === 30) title += "...";

        const newNotes = notes.map(n =>
            n.id === activeNoteId
                ? { ...n, content: editorRef.current.innerHTML, title }
                : n
        );
        saveNotes(newNotes);
    };

    const checkActiveFormats = () => {
        const block = document.queryCommandValue('formatBlock');
        setActiveFormats({
            h1: block === 'h1',
            h2: block === 'h2',
            h3: block === 'h3',
            bold: document.queryCommandState('bold'),
            italic: document.queryCommandState('italic'),
            underline: document.queryCommandState('underline'),
            strikethrough: document.queryCommandState('strikeThrough'),
            justifyLeft: document.queryCommandState('justifyLeft'),
            justifyCenter: document.queryCommandState('justifyCenter'),
            justifyRight: document.queryCommandState('justifyRight'),
            justifyFull: document.queryCommandState('justifyFull'),
            list: document.queryCommandState('insertUnorderedList'),
        });
    };

    const format = (command, value = null) => {
        document.execCommand(command, false, value);
        if (editorRef.current) {
            editorRef.current.focus();
        }
        checkActiveFormats();
    };

    const btnClass = (isActive) =>
        `p-1 rounded transition-colors ${isActive ? 'bg-[var(--color-widget-active)] text-white' : 'hover:bg-white/10 active:bg-white/20 text-white/80 hover:text-white'}`;

    return (
        <div key="editor-view" className="flex-1 flex flex-col h-full overflow-hidden">
            <div className="flex items-center justify-between p-1.5 border-b border-white/10 bg-white/5 shrink-0">
                <button
                    onClick={() => setActiveNoteId(null)}
                    className="p-1 hover:bg-white/10 rounded transition-colors mr-1 text-white"
                    title="Back to Index"
                >
                    <ArrowLeft size={16} />
                </button>

                <div className="flex items-center gap-0.5">
                    <button onClick={() => format('formatBlock', 'H1')} className={btnClass(activeFormats.h1)} title="Heading 1"><Heading1 size={14} /></button>
                    <button onClick={() => format('formatBlock', 'H2')} className={btnClass(activeFormats.h2)} title="Heading 2"><Heading2 size={14} /></button>
                    <button onClick={() => format('formatBlock', 'H3')} className={btnClass(activeFormats.h3)} title="Heading 3"><Heading3 size={14} /></button>
                </div>

                <div className="w-px h-4 bg-white/20 mx-0.5"></div>

                <div className="flex items-center gap-0.5">
                    <button onClick={() => format('bold')} className={btnClass(activeFormats.bold)} title="Bold"><Bold size={14} /></button>
                    <button onClick={() => format('italic')} className={btnClass(activeFormats.italic)} title="Italic"><Italic size={14} /></button>
                    <button onClick={() => format('underline')} className={btnClass(activeFormats.underline)} title="Underline"><Underline size={14} /></button>
                    <button onClick={() => format('strikeThrough')} className={btnClass(activeFormats.strikethrough)} title="Strikethrough"><Strikethrough size={14} /></button>
                </div>

                <div className="w-px h-4 bg-white/20 mx-0.5"></div>

                <div className="flex items-center gap-0.5">
                    <button onClick={() => format('justifyLeft')} className={btnClass(activeFormats.justifyLeft)} title="Align Left"><AlignLeft size={14} /></button>
                    <button onClick={() => format('justifyCenter')} className={btnClass(activeFormats.justifyCenter)} title="Align Center"><AlignCenter size={14} /></button>
                    <button onClick={() => format('justifyRight')} className={btnClass(activeFormats.justifyRight)} title="Align Right"><AlignRight size={14} /></button>
                    <button onClick={() => format('justifyFull')} className={btnClass(activeFormats.justifyFull)} title="Justify"><AlignJustify size={14} /></button>
                </div>

                <div className="w-px h-4 bg-white/20 mx-0.5"></div>

                <button onClick={() => format('insertUnorderedList')} className={btnClass(activeFormats.list)} title="Bullet List"><List size={14} /></button>
            </div>

            <div
                ref={editorRef}
                className="flex-1 p-6 overflow-y-auto notepad-editor scrollable cursor-text text-white"
                contentEditable
                onInput={handleInput}
                onKeyUp={checkActiveFormats}
                onMouseUp={checkActiveFormats}
                onMouseLeave={checkActiveFormats}
                suppressContentEditableWarning
            >
            </div>
        </div>
    );
}
