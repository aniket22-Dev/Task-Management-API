import React from 'react';
import api from '../services/api';

const Task = ({ task }) => {
    const handleDelete = async () => {
        try {
            await api.delete(`api/tasks/delete-task/${task._id}`);
            window.location.reload();
        } catch (err) {
            console.error('Error deleting task', err);
        }
    };

    const handleUpdate = async (status) => {
        try {
            await api.put(`api/tasks/update-task/${task._id}`, { status });
            window.location.reload();
        } catch (err) {
            console.error('Error updating task', err);
        }
    };

    return (
        <div>
            <h3>{task.title}</h3>
            <p>{task.description}</p>
            <p>Status: {task.status}</p>
            <button onClick={() => handleUpdate(task.status === 'pending' ? 'in-progress' : 'completed')}>
                {task.status === 'pending' ? 'Start Task' : 'Complete Task'}
            </button>
            <button onClick={handleDelete}>Delete Task</button>
        </div>
    );
};

export default Task;
