import { useState, useEffect } from 'react';

export default function useTodo() {
    const [todos, setTodos] = useState([]);

    useEffect(() => {
        const saved = localStorage.getItem('todo_list');
        if (saved) {
            try {
                setTodos(JSON.parse(saved));
            } catch (e) {
                console.error("Failed to parse todos", e);
            }
        }
    }, []);

    const saveTodos = (newTodos) => {
        setTodos(newTodos);
        localStorage.setItem('todo_list', JSON.stringify(newTodos));
    };

    const addTask = (text, date = new Date().toISOString().split('T')[0]) => {
        const newTask = {
            id: Date.now().toString(),
            text,
            status: 'todo',
            date
        };
        saveTodos([...todos, newTask]);
    };

    const updateTaskStatus = (id, newStatus) => {
        saveTodos(todos.map(t => t.id === id ? { ...t, status: newStatus } : t));
    };

    const deleteTask = (id) => {
        saveTodos(todos.filter(t => t.id !== id));
    };

    const editTask = (id, newText) => {
        saveTodos(todos.map(t => t.id === id ? { ...t, text: newText } : t));
    };

    return {
        todos,
        addTask,
        updateTaskStatus,
        deleteTask,
        editTask
    };
}
