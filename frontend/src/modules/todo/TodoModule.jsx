import { useState } from 'react';
import useTodo from './hooks/useTodo';
import KanbanView from './components/KanbanView';
import CalendarView from './components/CalendarView';
import { Kanban, CalendarDays } from 'lucide-react';

export default function TodoModule() {
    const { todos, addTask, updateTaskStatus, deleteTask, editTask } = useTodo();
    const [view, setView] = useState('kanban'); // 'kanban' | 'calendar'

    const btnClass = (isActive) =>
        `flex items-center gap-2 px-3 py-1.5 rounded transition-colors ${isActive ? 'bg-[var(--color-widget-active)] text-[var(--color-widget-text)]' : 'hover:bg-black/10 text-black'}`;

    return (
        <div className="flex flex-col rounded-md shadow-[5px_5px_15px_rgba(0,0,0,0.6)] border-2 border-widget text-black pointer-events-auto resize overflow-hidden relative"
            style={{ width: '600px', height: '700px', minWidth: '350px', minHeight: '400px', backgroundColor: 'var(--color-background)' }}>

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@400..700&family=Playfair+Display:ital,wght@0,600;1,600&display=swap');
                
                /* Custom scrollbar for todo */
                .scrollable::-webkit-scrollbar { width: 8px; }
                .scrollable::-webkit-scrollbar-track { background: transparent; }
                .scrollable::-webkit-scrollbar-thumb { background: var(--color-widget); border-radius: 10px; border: 2px solid #f4ecd8; }
            `}</style>

            {/* Toolbar */}
            <div className="flex items-center justify-between p-2 mx-1 mt-0 bg-[#f4ecd8] border-b border-black/10 rounded-t-sm shadow-[inset_4px_0_10px_rgba(0,0,0,0.1),inset_-1px_0_2px_rgba(0,0,0,0.05)] border-l">
                <div className="font-serif font-bold text-xl ml-2 text-[#3e2723]">Tasks</div>
                <div className="flex gap-1 bg-black/5 p-1 rounded">
                    <button
                        onClick={() => setView('kanban')}
                        className={btnClass(view === 'kanban')}
                        title="Kanban Board"
                    >
                        <Kanban size={16} />
                        <span className="font-serif text-sm font-semibold">Board</span>
                    </button>
                    <button
                        onClick={() => setView('calendar')}
                        className={btnClass(view === 'calendar')}
                        title="Calendar View"
                    >
                        <CalendarDays size={16} />
                        <span className="font-serif text-sm font-semibold">Calendar</span>
                    </button>
                </div>
            </div>

            {/* Inner Content Area */}
            <div className="flex-1 m-1 mt-0 bg-[#f4ecd8] rounded-b-sm shadow-[inset_4px_0_10px_rgba(0,0,0,0.1),inset_-1px_0_2px_rgba(0,0,0,0.05)] overflow-hidden flex flex-col relative border-l border-black/10">
                {view === 'kanban' ? (
                    <KanbanView
                        todos={todos}
                        addTask={addTask}
                        updateTaskStatus={updateTaskStatus}
                        deleteTask={deleteTask}
                        editTask={editTask}
                    />
                ) : (
                    <CalendarView
                        todos={todos}
                        addTask={addTask}
                    />
                )}
            </div>

            {/* Visual resize indicator */}
            <div className="absolute bottom-1 right-1 w-3 h-3 border-r-2 border-b-2 border-widget-text/50 pointer-events-none rounded-br-sm"></div>
        </div>
    );
}
