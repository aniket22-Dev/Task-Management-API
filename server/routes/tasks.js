const express = require('express');
const { createTask, getTasks, updateTask, deleteTask } = require('../controllers/taskController');
const jwtMiddleware = require('../middleware/auth');
const router = express.Router();

router.post('/create-task', jwtMiddleware, createTask);
router.get('/get-tasks', jwtMiddleware, getTasks);
router.put('/update-task/:id', jwtMiddleware, updateTask);
router.delete('/delete-task/:id', jwtMiddleware, deleteTask);

module.exports = router;
