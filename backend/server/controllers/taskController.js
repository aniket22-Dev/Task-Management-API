const Task = require('../models/task');

const createTask = async (req, res) => {
    const { title, description } = req.body;
    try {
        const task = new Task({
            title,
            description,
            userId: req.user.id
        });
        await task.save();

        console.log('Task Created Successfully', task);
        
        res.status(201).json(task);
    } catch (err) {
        
        console.error("Error Creating Task");

        res.status(400).json({ message: 'Error creating task', error: err });
    }
};

const getTasks = async (req, res) => {
    try {
        const tasks = await Task.find({ userId: req.user.id });
        res.status(200).json(tasks);
    } catch (err) {
        res.status(400).json({ message: 'Error fetching tasks', error: err });
    }
};

const updateTask = async (req, res) => {
    const { id } = req.params;
    const { title, description, status } = req.body;
    try {
        const task = await Task.findById(id);
        if (!task) return res.status(404).json({ message: 'Task not found' });

        if (task.userId.toString() !== req.user.id) return res.status(403).json({ message: 'Forbidden' });

        task.title = title;
        task.description = description;
        task.status = status;
        task.updatedAt = Date.now();
        await task.save();

        console.log(`Task Updated Successfully ${id}`);
        
        res.status(200).json(task);
    } catch (err) {
        res.status(400).json({ message: 'Error updating task', error: err });
    }
};

const deleteTask = async (req, res) => {
    const { id } = req.params;
    try {
        const task = await Task.findById(id);
        if (!task) return res.status(404).json({ message: 'Task not found' });

        if (task.userId.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Forbidden' });
        }

        await Task.deleteOne({ _id: id });

        console.log(`Task Deleted with ${id}`);
        
        res.status(200).json({ message: 'Task deleted' });
    } catch (err) {
        console.error('Error deleting task:', err);
        res.status(400).json({ message: 'Error deleting task', error: err });
    }
};


module.exports = { createTask, getTasks, updateTask, deleteTask };
