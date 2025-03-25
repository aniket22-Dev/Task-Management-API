const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const signup = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const user = new User({ name, email, password });
        await user.save();

        console.log('User Created', user);

        res.status(201).json({ message: 'User created successfully' });
    } catch (err) {

        console.error("Error Creating User");

        res.status(400).json({ message: 'Error creating user', error: err });
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'User not found' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        console.log(`User Logged In Successfully ${token}`)

        res.status(200).json({ token });
    } catch (err) {

        console.error('Error Login User')

        res.status(500).json({ message: 'Error logging in', error: err });
    }
};

module.exports = { signup, login };
