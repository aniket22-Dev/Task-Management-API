import React, { useState, useEffect } from 'react';
import api from '../services/api'; // Import your axios instance
import Modal from 'react-modal'; // Import react-modal
import 'font-awesome/css/font-awesome.min.css'; // Import Font Awesome
import { ToastContainer, toast } from 'react-toastify'; // Import Toastify
import { PulseLoader } from 'react-spinners'; // Import loader
import 'react-toastify/dist/ReactToastify.css'; // Import Toastify styles

Modal.setAppElement('#root'); // To avoid accessibility warnings

const Dashboard = () => {
    const [isModalOpen, setIsModalOpen] = useState(false); // Modal visibility
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState('pending');
    const [message, setMessage] = useState('');
    const [tasks, setTasks] = useState([]); // State to store tasks
    const [editingTask, setEditingTask] = useState(null); // Store task being edited
    const [loading, setLoading] = useState(false); // Loading state for creating/editing/deleting

    // Open the modal
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

    // Close the modal
    const closeModal = () => {
        setIsModalOpen(false);
    };

    // Fetch all tasks from the backend
    const fetchTasks = async () => {
        try {
            setLoading(true); // Set loading to true when fetching tasks
            const response = await api.get('/api/tasks', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`, // Include JWT token
                },
            });
            setTasks(response.data); // Set tasks state with the fetched tasks
            setLoading(false); // Set loading to false after fetching tasks
        } catch (err) {
            console.error('Error fetching tasks:', err);
            setLoading(false); // Set loading to false in case of error
        }
    };

    // Handle form submit to create or update a task
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true); // Set loading to true while submitting the form
        try {
            const taskData = { title, description, status };

            // If editing a task, update it
            if (editingTask) {
                await api.put(`/api/tasks/${editingTask._id}`, taskData, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`, // Include JWT token
                    },
                });
                toast.success('Task updated successfully!'); // Show success message
            } else {
                // If creating a new task, create it
                await api.post('/api/tasks', taskData, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`, // Include JWT token
                    },
                });
                toast.success('Task created successfully!'); // Show success message
            }

            closeModal(); // Close the modal on success
            fetchTasks(); // Fetch all tasks after creating/updating
        } catch (err) {
            console.error('Error creating or updating task:', err);
            toast.error('Error creating or updating task'); // Show error message
        } finally {
            setLoading(false); // Set loading to false after the operation
        }
    };

    // Handle task deletion
    const handleDelete = async (taskId) => {
        setLoading(true); // Set loading to true while deleting the task
        try {
            await api.delete(`/api/tasks/${taskId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`, // Include JWT token
                },
            });
            toast.success('Task deleted successfully!'); // Show success message
            fetchTasks(); // Fetch all tasks after deletion
        } catch (err) {
            console.error('Error deleting task:', err);
            toast.error('Error deleting task'); // Show error message
        } finally {
            setLoading(false); // Set loading to false after the operation
        }
    };

    // Fetch tasks on component mount
    useEffect(() => {
        fetchTasks();
    }, []); // Empty dependency array ensures this runs only once after component mounts

    return (
        <div>
            <h2>Your Tasks</h2>

            <button onClick={() => openModal(null)} disabled={loading}>Create Task</button> {/* Button to open modal */}

            {/* Success/Error message */}
            {message && <p>{message}</p>}

            {/* List of tasks */}
            <ul>
                {tasks.map((task) => (
                    <li key={task._id} style={{ display: 'flex', alignItems: 'center' }}>
                        <div style={{ marginRight: '10px' }}>
                            <h3>{task.title}</h3>
                            <p>{task.description}</p>
                            <p>Status: {task.status}</p>
                        </div>
                        <div>
                            <button onClick={() => handleDelete(task._id)} disabled={loading} style={{ marginRight: '10px' }}>
                                <i className="fa fa-trash"></i> {/* Delete Icon */}
                            </button>
                            <button onClick={() => openModal(task)} disabled={loading}>
                                <i className="fa fa-edit"></i> {/* Edit Icon */}
                            </button>
                        </div>
                    </li>
                ))}
            </ul>

            {/* Modal for task creation or editing */}
            <Modal isOpen={isModalOpen} onRequestClose={closeModal} contentLabel="Create or Edit Task Modal">
                <h2>{editingTask ? 'Edit Task' : 'Create a New Task'}</h2>
                <form onSubmit={handleSubmit}>
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
                    ></textarea>
                    <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                    >
                        <option value="pending">Pending</option>
                        <option value="in-progress">In Progress</option>
                        <option value="completed">Completed</option>
                    </select>
                    <button type="submit" disabled={loading}>{editingTask ? 'Update Task' : 'Create Task'}</button>
                </form>
                <button onClick={closeModal} disabled={loading}>Close</button> {/* Close the modal */}
            </Modal>

            {/* Loading Spinner */}
            {loading && (
                <div style={{ textAlign: 'center', marginTop: '20px' }}>
                    <PulseLoader color="#36D7B7" loading={loading} size={150} />
                </div>
            )}

            {/* Toast container */}
            <ToastContainer />
        </div>
    );
};

export default Dashboard;
