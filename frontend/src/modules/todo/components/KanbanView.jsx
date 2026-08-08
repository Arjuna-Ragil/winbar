import { useState } from 'react';
import { Plus, X, Pencil, Check } from 'lucide-react';

const Column = ({ title, status, todos, updateTaskStatus, deleteTask, editTask }) => {
    const handleDragOver = (e) => {
        e.preventDefault();
        e.currentTarget.classList.add('bg-white/5');
    };

    const handleDragLeave = (e) => {
        e.currentTarget.classList.remove('bg-white/5');
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.currentTarget.classList.remove('bg-white/5');
        const id = e.dataTransfer.getData("taskId");
        if (id) {
            updateTaskStatus(id, status);
        }
    };

    const handleDragStart = (e, id) => {
        e.dataTransfer.setData("taskId", id);
        setTimeout(() => e.target.classList.add('opacity-50'), 0);
    };

    const handleDragEnd = (e) => {
        e.target.classList.remove('opacity-50');
    };

    return (
        <div
            className="flex-1 flex flex-col min-w-[250px] shrink-0 border-r border-white/10 last:border-r-0 transition-colors"
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
        >
            <div className="text-center font-serif font-bold p-2 border-b border-white/10 text-white uppercase tracking-widest text-sm">
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
            className="group bg-white/5 border border-white/10 rounded p-2 shadow-sm cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow relative"
        >
            {isEditing ? (
                <div className="flex items-center gap-1">
                    <input
                        type="text"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                        className="w-full bg-transparent border-b border-widget outline-none text-white font-['Caveat'] text-xl"
                        autoFocus
                    />
                    <button onClick={handleSave} className="text-green-400 p-1 hover:bg-white/10 rounded">
                        <Check size={14} />
                    </button>
                </div>
            ) : (
                <div className="flex justify-between items-start gap-2">
                    <span className="font-['Caveat'] text-xl leading-5 text-white wrap-break-word">{task.text}</span>
                    <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => setIsEditing(true)} className="text-white/50 hover:text-white">
                            <Pencil size={12} />
                        </button>
                        <button onClick={() => deleteTask(task.id)} className="text-red-400/50 hover:text-red-400">
                            <X size={12} />
                        </button>
                    </div>
                </div>
            )}
            {task.type === 'normal' && task.date && (
                <div className="text-[10px] text-white/40 text-right mt-1 font-sans">{task.date}</div>
            )}
        </div>
    );
};

const RecurringListView = ({ todos, updateTaskStatus, deleteTask }) => {
    return (
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 scrollable">
            {todos.map(task => {
                const isDone = task.status === 'done';
                
                return (
                    <div key={task.id} className="flex h-20 bg-white/5 border border-white/10 rounded-lg overflow-hidden relative group shadow-sm hover:border-white/20 transition-all">
                        
                        {/* Task Text */}
                        <div className="flex-1 p-4 flex flex-col items-start justify-center border-l-4 border-l-transparent group-hover:border-l-widget transition-colors z-10 pointer-events-none">
                            <span className={`font-sans text-lg font-medium drop-shadow-sm ${isDone ? 'text-white/60 line-through' : 'text-white'}`}>{task.text}</span>
                        </div>
                        
                        {/* Right Side Action / Status */}
                        {isDone ? (
                            <div 
                                onClick={() => updateTaskStatus(task.id, 'todo')}
                                className="absolute inset-0 bg-gradient-to-l from-widget via-widget/70 to-transparent flex justify-end items-center pr-8 text-widget-text font-bold overflow-hidden cursor-pointer hover:opacity-90 transition-opacity z-0"
                            >
                                <span className="absolute right-0 text-5xl font-black opacity-20 whitespace-nowrap transform -rotate-12 select-none pointer-events-none translate-x-2">COMPLETED</span>
                                <div className="flex items-center gap-2 z-10 mr-2 drop-shadow-sm">
                                    <Check size={20} strokeWidth={4} />
                                    <span className="tracking-widest uppercase">Done</span>
                                </div>
                            </div>
                        ) : (
                            <div className="absolute inset-y-0 right-0 w-48 bg-gradient-to-l from-black/40 to-transparent flex flex-col justify-center items-end pr-4 shrink-0 z-10 pointer-events-none">
                                <button 
                                    onClick={() => updateTaskStatus(task.id, 'done')}
                                    className="px-6 py-2 bg-widget/20 hover:bg-widget hover:text-widget-text border border-widget/50 hover:border-widget rounded font-bold transition-all flex items-center gap-2 text-sm text-white pointer-events-auto shadow-sm"
                                >
                                    <Check size={16} strokeWidth={3} />
                                    Done
                                </button>
                            </div>
                        )}

                        {/* Hover actions for delete */}
                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 flex gap-2 transition-opacity z-20">
                            <button onClick={() => deleteTask(task.id)} className="text-white hover:text-red-400 bg-black/40 hover:bg-black/60 p-1.5 rounded-full shadow backdrop-blur-sm transition-colors">
                                <X size={12} strokeWidth={3} />
                            </button>
                        </div>
                    </div>
                );
            })}
            {todos.length === 0 && (
                <div className="text-center font-serif text-white/40 mt-10">No tasks in this category.</div>
            )}
        </div>
    );
};

export default function KanbanView({ todos, addTask, updateTaskStatus, deleteTask, editTask }) {
    const [newTaskText, setNewTaskText] = useState("");
    const [newTaskDate, setNewTaskDate] = useState(() => new Date().toISOString().split('T')[0]);
    const [activeTab, setActiveTab] = useState('daily');

    const handleAdd = (e) => {
        e.preventDefault();
        if (newTaskText.trim()) {
            addTask(newTaskText.trim(), activeTab === 'normal' ? newTaskDate : null, activeTab);
            setNewTaskText("");
        }
    };

    const filteredTodos = todos.filter(t => (t.type || 'normal') === activeTab);

    return (
        <div className="flex flex-col h-full bg-transparent">
            {/* Tabs */}
            <div className="flex px-3 pt-2 gap-2 border-b border-white/10 bg-white/5">
                {['daily', 'weekly', 'monthly', 'normal'].map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-3 py-1 font-serif text-sm font-bold capitalize transition-colors border-b-2 ${activeTab === tab ? 'border-widget text-white' : 'border-transparent text-white/50 hover:text-white/80'}`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            <form onSubmit={handleAdd} className="flex gap-2 p-3 border-b border-white/10 bg-black/10 items-center">
                <input
                    type="text"
                    placeholder={`Add a new ${activeTab} task...`}
                    value={newTaskText}
                    onChange={(e) => setNewTaskText(e.target.value)}
                    className="flex-1 bg-transparent border-b border-white/20 focus:border-widget outline-none px-2 font-['Caveat'] text-2xl text-white transition-colors"
                />
                {activeTab === 'normal' && (
                    <input
                        type="date"
                        value={newTaskDate}
                        onChange={(e) => setNewTaskDate(e.target.value)}
                        className="bg-transparent border-b border-white/20 focus:border-widget outline-none px-2 py-1.5 text-white/60 font-sans text-sm transition-colors scheme-dark"
                    />
                )}
                <button
                    type="submit"
                    className="p-2 rounded bg-widget text-widget-text hover:bg-widget-hover transition-colors shadow-sm shrink-0"
                >
                    <Plus size={20} />
                </button>
            </form>

            <div className="flex-1 flex overflow-x-auto overflow-y-hidden scrollable">
                {activeTab === 'normal' ? (
                    <>
                        <Column title="To Do" status="todo" todos={filteredTodos} updateTaskStatus={updateTaskStatus} deleteTask={deleteTask} editTask={editTask} />
                        <Column title="In Progress" status="in_progress" todos={filteredTodos} updateTaskStatus={updateTaskStatus} deleteTask={deleteTask} editTask={editTask} />
                        <Column title="Done" status="done" todos={filteredTodos} updateTaskStatus={updateTaskStatus} deleteTask={deleteTask} editTask={editTask} />
                    </>
                ) : (
                    <RecurringListView todos={filteredTodos} updateTaskStatus={updateTaskStatus} deleteTask={deleteTask} />
                )}
            </div>
        </div>
    );
}
