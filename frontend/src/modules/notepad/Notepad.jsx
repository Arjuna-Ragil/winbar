import { useEffect, useRef } from 'react';
import { Bold, Italic, Underline, Strikethrough, List, Heading1, Heading2, Heading3 } from 'lucide-react';

export default function Notepad() {
    const editorRef = useRef(null);

    useEffect(() => {
        const saved = localStorage.getItem('notepad_content');
        if (saved && editorRef.current) {
            editorRef.current.innerHTML = saved;
        } else if (editorRef.current && !saved) {
            editorRef.current.innerHTML = "<div>Write something here...</div>";
        }
    }, []);

    const handleInput = () => {
        if (editorRef.current) {
            localStorage.setItem('notepad_content', editorRef.current.innerHTML);
        }
    };

    const format = (command, value = null) => {
        document.execCommand(command, false, value);
        if (editorRef.current) {
            editorRef.current.focus();
        }
    };

    return (
        <div className="flex flex-col bg-[#fff9c4]/95 backdrop-blur-xl rounded-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)] border border-yellow-400/50 text-slate-800 pointer-events-auto resize overflow-hidden relative" style={{ width: '320px', height: '400px', minWidth: '250px', minHeight: '200px' }}>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@400..700&display=swap');
                .notepad-editor { 
                    font-family: 'Caveat', cursive; 
                    font-size: 1.5rem; 
                    line-height: 1.3; 
                    outline: none;
                }
                .notepad-editor h1 { font-size: 2.5rem; font-weight: 700; margin-bottom: 0.2rem; }
                .notepad-editor h2 { font-size: 2.0rem; font-weight: 700; margin-bottom: 0.2rem; }
                .notepad-editor h3 { font-size: 1.7rem; font-weight: 700; margin-bottom: 0.2rem; }
                .notepad-editor ul { list-style-type: disc; padding-left: 2rem; margin-bottom: 0.5rem; }
                .notepad-editor b, .notepad-editor strong { font-weight: 700; }
                
                /* Custom scrollbar for notepad */
                .notepad-editor::-webkit-scrollbar { width: 6px; }
                .notepad-editor::-webkit-scrollbar-track { background: transparent; }
                .notepad-editor::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.1); border-radius: 10px; }
                .notepad-editor::-webkit-scrollbar-thumb:hover { background: rgba(0,0,0,0.2); }
            `}</style>
            
            {/* Toolbar - Also acts as a drag handle */}
            <div className="flex items-center gap-1 p-2 bg-[#fff176] border-b border-yellow-400/50 drag-handle cursor-move select-none shrink-0">
                <button onClick={() => format('formatBlock', 'H1')} className="p-1.5 hover:bg-yellow-500/30 active:bg-yellow-500/50 rounded transition-colors" title="Heading 1"><Heading1 size={16} /></button>
                <button onClick={() => format('formatBlock', 'H2')} className="p-1.5 hover:bg-yellow-500/30 active:bg-yellow-500/50 rounded transition-colors" title="Heading 2"><Heading2 size={16} /></button>
                <button onClick={() => format('formatBlock', 'H3')} className="p-1.5 hover:bg-yellow-500/30 active:bg-yellow-500/50 rounded transition-colors" title="Heading 3"><Heading3 size={16} /></button>
                
                <div className="w-px h-5 bg-yellow-600/30 mx-1"></div>
                
                <button onClick={() => format('bold')} className="p-1.5 hover:bg-yellow-500/30 active:bg-yellow-500/50 rounded transition-colors" title="Bold"><Bold size={16} /></button>
                <button onClick={() => format('italic')} className="p-1.5 hover:bg-yellow-500/30 active:bg-yellow-500/50 rounded transition-colors" title="Italic"><Italic size={16} /></button>
                <button onClick={() => format('underline')} className="p-1.5 hover:bg-yellow-500/30 active:bg-yellow-500/50 rounded transition-colors" title="Underline"><Underline size={16} /></button>
                <button onClick={() => format('strikeThrough')} className="p-1.5 hover:bg-yellow-500/30 active:bg-yellow-500/50 rounded transition-colors" title="Strikethrough"><Strikethrough size={16} /></button>
                
                <div className="w-px h-5 bg-yellow-600/30 mx-1"></div>
                
                <button onClick={() => format('insertUnorderedList')} className="p-1.5 hover:bg-yellow-500/30 active:bg-yellow-500/50 rounded transition-colors" title="Bullet List"><List size={16} /></button>
            </div>

            {/* Editor Area */}
            <div 
                ref={editorRef}
                className="flex-1 p-5 overflow-y-auto notepad-editor cursor-text text-black/80"
                contentEditable
                onInput={handleInput}
                suppressContentEditableWarning
            >
            </div>
            
            {/* Visual resize indicator in bottom right corner */}
            <div className="absolute bottom-1 right-1 w-3 h-3 border-r-2 border-b-2 border-yellow-600/30 pointer-events-none rounded-br-sm"></div>
        </div>
    );
}
