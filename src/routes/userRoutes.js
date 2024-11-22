const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { ObjectId } = require('mongodb');
const User = require('../models/user');
const router = express.Router();
require('dotenv').config();

// Middleware for JWT authentication
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ error: 'Access token missing' });

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ error: 'Invalid token' });
        req.user = user;
        next();
    });
}

// Register endpoint
router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, email, password: hashedPassword, PurchasedTickets:[] });
        await newUser.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Login endpoint
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const token = jwt.sign(
            { userId: user._id.toString(), username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.json({ token, username: user.username, userId: user._id, message: 'Login successful' });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Fetch user data
router.get('/:id', authenticateToken, async (req, res) => {
    const userId = req.params.id;

    try {
        const user = await User.findById(userId).select('username email');
        if (!user) return res.status(404).json({ error: 'User not found' });

        res.json({ username: user.username, email: user.email });
    } catch (error) {
        console.error('Error fetching user data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Update user data
router.post('/updateName', authenticateToken, async (req, res) => {
    const userId = req.user.userId; // Use the `userId` from the JWT payload
    const { username, email } = req.body;

    if (!username || !email) {
        return res.status(400).json({ error: 'Both fields are required' });
    }

    try {
        const result = await User.updateOne(
            { _id: new ObjectId(userId) },
            { $set: { username, email } }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({ message: 'User updated successfully' });
    } catch (error) {
        console.error('Error updating user data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/:userId/PurchasedTickets', async (req, res) => {
    try {
        const userId = req.params.userId;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({ tickets: user.PurchasedTickets });
    } catch (error) {
        console.error('Error fetching tickets:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.post('/save-seat', async (req, res) => {
    const { seatDetails , userId } = req.body; 

    if (!seatDetails || seatDetails.length === 0) {
      return res.status(400).json({ message: 'No seat details provided' });
    }
  
    try {
      const user = await User.findById(userId);
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      user.PurchasedTickets = user.PurchasedTickets || [];
      seatDetails.forEach(seat => {
        user.PurchasedTickets.push(seat);
      });
  
      await user.save();
      res.status(200).json({ message: 'Seats saved successfully' });
    } catch (error) {
      console.error('Error saving seats:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
});

router.get('/:userId/findById', async (req, res) => {
    try {
      const userId = req.params.userId;
  
      if (!userId) {
        return res.status(400).json({ message: 'User ID is required' });
      }
  
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      res.json({ findById: true, user });
    } catch (error) {
      console.error('Error fetching user data:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  

module.exports = router;
