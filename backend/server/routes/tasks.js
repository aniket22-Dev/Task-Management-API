const express = require('express');
const { createTask, getTasks, updateTask, deleteTask } = require('../controllers/taskController');
const jwtMiddleware = require('../middleware/auth');
const router = express.Router();

router.post('/', jwtMiddleware, createTask);
router.get('/', jwtMiddleware, getTasks);
router.put('/:id', jwtMiddleware, updateTask);
router.delete('/:id', jwtMiddleware, deleteTask);

module.exports = router;
