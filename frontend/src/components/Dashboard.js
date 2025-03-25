import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import Modal from 'react-modal';
import 'font-awesome/css/font-awesome.min.css';
import { ToastContainer, toast } from 'react-toastify';
import { PulseLoader } from 'react-spinners';
import 'react-toastify/dist/ReactToastify.css';
import AuthContext from '../contexts/AuthContext';

Modal.setAppElement('#root');

const Dashboard = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState('pending');
    const [message, setMessage] = useState('');
    const [tasks, setTasks] = useState([]);
    const [editingTask, setEditingTask] = useState(null);
    const [loading, setLoading] = useState(false);

    const { setIsAuthenticated } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
        navigate('/login');
    };

    const openModal = (task) => {
        if (task) {
            setEditingTask(task);
            setTitle(task.title);
            setDescription(task.description);
            setStatus(task.status);
        } else {
            setEditingTask(null);
            setTitle('');
            setDescription('');
            setStatus('pending');
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const fetchTasks = async () => {
        try {
            setLoading(true);
            const response = await api.get('/api/tasks', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            setTasks(response.data);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching tasks:', err);
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const taskData = { title, description, status };

            if (editingTask) {
                await api.put(`/api/tasks/${editingTask._id}`, taskData, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                toast.success('Task updated successfully!');
            } else {
                await api.post('/api/tasks', taskData, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                toast.success('Task created successfully!');
            }

            closeModal();
            fetchTasks();
        } catch (err) {
            console.error('Error creating or updating task:', err);
            toast.error('Error creating or updating task');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (taskId) => {
        setLoading(true);
        try {
            await api.delete(`/api/tasks/${taskId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            toast.success('Task deleted successfully!');
            fetchTasks();
        } catch (err) {
            console.error('Error deleting task:', err);
            toast.error('Error deleting task');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    return (
        <div className="dashboard-container">
            <button onClick={handleLogout} className="logout-button">
                Logout
            </button>

            <h2 className="dashboard-header">Your Tasks</h2>
            <button className="create-task-button" onClick={() => openModal(null)} disabled={loading}>
                Create Task
            </button>

            {message && <p>{message}</p>}

            <div className="task-list">
                {tasks.map((task) => (
                    <div className="task-card" key={task._id}>
                        <h3 className="task-title">{task.title}</h3>
                        <p className="task-description">{task.description}</p>
                        <p className={`task-status ${task.status}`}>Status: {task.status}</p>
                        <div className="task-actions">
                            <button onClick={() => handleDelete(task._id)} disabled={loading}>
                                <i className="fa fa-trash"></i>
                            </button>
                            <button onClick={() => openModal(task)} disabled={loading}>
                                <i className="fa fa-edit"></i>
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <Modal isOpen={isModalOpen} onRequestClose={closeModal} contentLabel="Create or Edit Task Modal">
                <div className='dashboard-modal'>
                    <h2>{editingTask ? 'Edit Task' : 'Create a New Task'}</h2>
                    <button onClick={closeModal} disabled={loading} className="create-task-button">X</button>
                </div>
                <form onSubmit={handleSubmit} className="modal-content">
                    <input
                        type="text"
                        placeholder="Task Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                    <textarea
                        placeholder="Task Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    />
                    <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                    >
                        <option value="pending">Pending</option>
                        <option value="in-progress">In Progress</option>
                        <option value="completed">Completed</option>
                    </select>
                    <button type="submit" disabled={loading}>
                        {editingTask ? 'Update Task' : 'Create Task'}
                    </button>
                </form>
            </Modal>

            {loading && (
                <div className="loading-spinner">
                    <PulseLoader color="#36D7B7" loading={loading} size={150} />
                </div>
            )}

            <ToastContainer />
        </div>
    );
};

export default Dashboard;
