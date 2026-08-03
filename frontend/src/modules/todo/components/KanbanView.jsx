import { useState } from 'react';
import { Plus, X, Pencil, Check } from 'lucide-react';

const Column = ({ title, status, todos, updateTaskStatus, deleteTask, editTask }) => {
    const handleDragOver = (e) => {
        e.preventDefault();
        e.currentTarget.classList.add('bg-black/5');
    };

    const handleDragLeave = (e) => {
        e.currentTarget.classList.remove('bg-black/5');
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.currentTarget.classList.remove('bg-black/5');
        const id = e.dataTransfer.getData("taskId");
        if (id) {
            updateTaskStatus(id, status);
        }
    };

    const handleDragStart = (e, id) => {
        e.dataTransfer.setData("taskId", id);
        // Small delay to allow the drag image to be generated before hiding the original
        setTimeout(() => e.target.classList.add('opacity-50'), 0);
    };

    const handleDragEnd = (e) => {
        e.target.classList.remove('opacity-50');
    };

    return (
        <div 
            className="flex-1 flex flex-col min-w-50 border-r border-black/10 last:border-r-0 transition-colors"
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
        >
            <div className="text-center font-serif font-bold p-2 border-b border-black/10 text-black uppercase tracking-widest text-sm">
                {title}
            </div>
            <div className="flex-1 overflow-y-auto p-2 flex flex-col gap-2 scrollable">
                {todos.filter(t => t.status === status).map(task => (
                    <TaskCard 
                        key={task.id} 
                        task={task} 
                        handleDragStart={handleDragStart} 
                        handleDragEnd={handleDragEnd}
                        deleteTask={deleteTask}
                        editTask={editTask}
                    />
                ))}
            </div>
        </div>
    );
};

const TaskCard = ({ task, handleDragStart, handleDragEnd, deleteTask, editTask }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [text, setText] = useState(task.text);

    const handleSave = () => {
        if (text.trim()) {
            editTask(task.id, text.trim());
        } else {
            setText(task.text);
        }
        setIsEditing(false);
    };

    return (
        <div 
            draggable={!isEditing}
            onDragStart={(e) => handleDragStart(e, task.id)}
            onDragEnd={handleDragEnd}
            className="group bg-[#fdfbf6] border border-black/10 rounded p-2 shadow-sm cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow relative"
        >
            {isEditing ? (
                <div className="flex items-center gap-1">
                    <input 
                        type="text" 
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                        className="w-full bg-transparent border-b border-widget outline-none text-black font-['Caveat'] text-xl"
                        autoFocus
                    />
                    <button onClick={handleSave} className="text-green-600 p-1 hover:bg-black/5 rounded">
                        <Check size={14} />
                    </button>
                </div>
            ) : (
                <div className="flex justify-between items-start gap-2">
                    <span className="font-['Caveat'] text-xl leading-5 text-black wrap-break-word">{task.text}</span>
                    <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => setIsEditing(true)} className="text-black/50 hover:text-black">
                            <Pencil size={12} />
                        </button>
                        <button onClick={() => deleteTask(task.id)} className="text-red-700/50 hover:text-red-700">
                            <X size={12} />
                        </button>
                    </div>
                </div>
            )}
            <div className="text-[10px] text-black/40 text-right mt-1 font-sans">{task.date}</div>
        </div>
    );
};

export default function KanbanView({ todos, addTask, updateTaskStatus, deleteTask, editTask }) {
    const [newTaskText, setNewTaskText] = useState("");
    const [newTaskDate, setNewTaskDate] = useState(() => new Date().toISOString().split('T')[0]);

    const handleAdd = (e) => {
        e.preventDefault();
        if (newTaskText.trim()) {
            addTask(newTaskText.trim(), newTaskDate);
            setNewTaskText("");
        }
    };

    return (
        <div className="flex flex-col h-full bg-[#f4ecd8]">
            <form onSubmit={handleAdd} className="flex gap-2 p-3 border-b border-black/10 bg-black/5 items-center">
                <input 
                    type="text" 
                    placeholder="Add a new task..." 
                    value={newTaskText}
                    onChange={(e) => setNewTaskText(e.target.value)}
                    className="flex-1 bg-transparent border-b border-black/20 focus:border-widget outline-none px-2 font-['Caveat'] text-2xl text-black transition-colors"
                />
                <input 
                    type="date"
                    value={newTaskDate}
                    onChange={(e) => setNewTaskDate(e.target.value)}
                    className="bg-transparent border-b border-black/20 focus:border-widget outline-none px-2 text-black/60 font-sans text-sm transition-colors"
                />
                <button 
                    type="submit"
                    className="p-2 rounded bg-widget text-widget-text hover:bg-widget-hover transition-colors shadow-sm shrink-0"
                >
                    <Plus size={20} />
                </button>
            </form>

            <div className="flex-1 flex overflow-hidden">
                <Column title="To Do" status="todo" todos={todos} updateTaskStatus={updateTaskStatus} deleteTask={deleteTask} editTask={editTask} />
                <Column title="In Progress" status="in_progress" todos={todos} updateTaskStatus={updateTaskStatus} deleteTask={deleteTask} editTask={editTask} />
                <Column title="Done" status="done" todos={todos} updateTaskStatus={updateTaskStatus} deleteTask={deleteTask} editTask={editTask} />
            </div>
        </div>
    );
}
