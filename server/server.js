const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/tasks');

dotenv.config();
const app = express();

// Middleware
app.use(express.json());

// Health check route to confirm the server is running
app.get('/', (req, res) => {
    res.status(200).json({ message: 'Server is running' });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
// Database connection
mongoose.connect(process.env.MONGO_URI).then(() => console.log('Connected to MongoDB'))
    .catch(err => console.log(err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

setInterval(() => {
    https.get('https://task-management-api-bf0l.onrender.com', (res) => {
    }).on('error', (error) => {
        console.error("Error pinging the server:", error.message);
    });
}, 30000);
