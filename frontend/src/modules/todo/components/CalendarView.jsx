import { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';

export default function CalendarView({ todos, addTask }) {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [newTaskText, setNewTaskText] = useState("");

    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

    const monthName = currentDate.toLocaleString('default', { month: 'long' });
    const year = currentDate.getFullYear();

    const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

    const getTasksForDate = (dateStr) => todos.filter(t => (t.type || 'normal') === 'normal' && t.date === dateStr);

    const handleAdd = (e) => {
        e.preventDefault();
        if (newTaskText.trim()) {
            addTask(newTaskText.trim(), selectedDate);
            setNewTaskText("");
        }
    };

    const days = useMemo(() => {
        const grid = [];
        for (let i = 0; i < firstDayOfMonth; i++) {
            grid.push(<div key={`empty-${i}`} className="p-2 border border-transparent"></div>);
        }
        for (let i = 1; i <= daysInMonth; i++) {
            const dateStr = `${year}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
            const dayTasks = getTasksForDate(dateStr);
            const isSelected = dateStr === selectedDate;

            grid.push(
                <div
                    key={i}
                    onClick={() => setSelectedDate(dateStr)}
                    className={`p-1 border flex flex-col items-center cursor-pointer transition-colors min-h-12.5
                        ${isSelected ? 'border-widget bg-widget/10' : 'border-white/5 hover:border-white/20 hover:bg-white/5'}
                    `}
                >
                    <span className={`font-serif text-sm ${isSelected ? 'font-bold text-white' : 'text-white/70'}`}>{i}</span>
                    <div className="flex gap-0.5 mt-1 flex-wrap justify-center">
                        {dayTasks.map(t => (
                            <div key={t.id} className={`w-1.5 h-1.5 rounded-full ${t.status === 'done' ? 'bg-green-400' : 'bg-widget'}`} title={t.text}></div>
                        ))}
                    </div>
                </div>
            );
        }
        return grid;
    }, [currentDate, todos, selectedDate]);

    const selectedDayTasks = getTasksForDate(selectedDate);

    return (
        <div className="flex flex-col h-full bg-transparent">
            {/* Calendar Header */}
            <div className="flex justify-between items-center p-3 border-b border-white/10">
                <button onClick={prevMonth} className="p-1 rounded hover:bg-white/10 text-white"><ChevronLeft size={20} /></button>
                <h2 className="font-serif font-bold text-xl text-white">{monthName} {year}</h2>
                <button onClick={nextMonth} className="p-1 rounded hover:bg-white/10 text-white"><ChevronRight size={20} /></button>
            </div>

            {/* Calendar Grid */}
            <div className="p-2 border-b border-white/10">
                <div className="grid grid-cols-7 text-center mb-1">
                    {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => (
                        <div key={d} className="font-serif text-xs font-bold text-white/50">{d}</div>
                    ))}
                </div>
                <div className="grid grid-cols-7 gap-1">
                    {days}
                </div>
            </div>

            {/* Selected Date Tasks */}
            <div className="flex-1 flex flex-col overflow-hidden">
                <div className="p-2 font-serif font-bold text-white border-b border-white/10 bg-white/5">
                    Tasks for {new Date(selectedDate).toLocaleDateString()}
                </div>

                <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-2 scrollable">
                    {selectedDayTasks.length === 0 ? (
                        <div className="text-center font-['Caveat'] text-xl text-white/50 mt-4">No tasks for this day...</div>
                    ) : (
                        selectedDayTasks.map(task => (
                            <div key={task.id} className="bg-white/5 border border-white/10 p-2 rounded flex items-center gap-2">
                                <div className={`w-2 h-2 rounded-full ${task.status === 'done' ? 'bg-green-400' : 'bg-widget'}`}></div>
                                <span className={`font-['Caveat'] text-2xl flex-1 ${task.status === 'done' ? 'line-through text-white/50' : 'text-white'}`}>
                                    {task.text}
                                </span>
                            </div>
                        ))
                    )}
                </div>

                {/* Add task for selected date */}
                <form onSubmit={handleAdd} className="flex gap-2 p-3 border-t border-white/10">
                    <input
                        type="text"
                        placeholder={`Add task for ${selectedDate}...`}
                        value={newTaskText}
                        onChange={(e) => setNewTaskText(e.target.value)}
                        className="flex-1 bg-transparent border-b border-white/20 focus:border-widget outline-none px-2 font-['Caveat'] text-2xl text-white transition-colors"
                    />
                    <button
                        type="submit"
                        className="p-2 rounded bg-widget text-widget-text hover:bg-widget-hover transition-colors shadow-sm"
                    >
                        <Plus size={20} />
                    </button>
                </form>
            </div>
        </div>
    );
}
