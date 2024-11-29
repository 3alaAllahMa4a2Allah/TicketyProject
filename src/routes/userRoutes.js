const express = require('express');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const validator = require('validator');
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

// Set up email transporter using Nodemailer
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
    tls: {
        rejectUnauthorized: false
    },
    debug: true,
});

// Register endpoint
router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;

    // Check if all required fields are provided
    if (!username || !email || !password) {
        return res.status(400).json({ message: 'Username, email, and password are required' });
    }

    try {
        // Check if the user already exists by email
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists with this email' });
        }
        
        if (!validator.isEmail(email)) {
            return res.status(400).json({ message: 'Invalid email format' });
        }

        // Hash the password before saving it
        const hashedPassword = await bcrypt.hash(password, 10);

        // Generate a verification token
        const verificationToken = crypto.randomBytes(32).toString('hex');

        // Create a new user object, including the verification token
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            verificationToken, // Store the token for later verification
            purchasedTickets: []
        });

        // Send a verification email with the token link
        const verificationLink = `${process.env.BASE_URL}/users/verify-email?token=${verificationToken}`;
        
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Please verify your email address',
            html: `<p>Click the link below to verify your email address and complete your registration:</p>
                    <a href="${verificationLink}">${verificationLink}</a>`
        };

        // Send email
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log('Error:', error);
            } else {
                console.log('Email sent:', info.response);
            }
        });

        // Save the new user to the database
        await newUser.save();
    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).json({ message: 'Server error during registration' });
    }
});

// Email verification endpoint
router.get('/verify-email', async (req, res) => {
    const { token } = req.query;

    if (!token) {
        return res.status(400).json({ message: 'Verification token is required' });
    }

    try {
        // Find the user with the token
        const user = await User.findOne({ verificationToken: token });

        if (!user) {
            return res.status(404).json({ message: 'Invalid or expired token' });
        }

        // Update user to set email as verified and clear the token
        user.verificationToken = undefined;
        user.emailVerified = true; // You may want to add an 'emailVerified' field in your schema
        await user.save();

        // res.json({ message: 'Email verified successfully. You can now log in.' });
        res.redirect('/login');
    } catch (error) {
        console.error('Error during email verification:', error);
        res.status(500).json({ message: 'Server error during email verification' });
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

        // Check if the user is verified
        if (!user.emailVerified) {
            return res.status(400).json({ message: 'Account not verified. Please check your email.' });
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
router.get('/:id', async (req, res) => {
    const userId = req.params.id;

    try {
        const user = await User.findById(userId).select('username email age role nationalID phone');
        if (!user) return res.status(404).json({ error: 'User not found' });

        res.json({
            username: user.username,
            email: user.email,
            age: user.age,
            role: user.role,
            nationalID: user.nationalID,
            phone: user.phone
        });
    } catch (error) {
        console.error('Error fetching user data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


// Update user data
router.post('/updateProfile', authenticateToken, async (req, res) => {
    const userId = req.user.userId; // Extract `userId` from the authenticated JWT token
    const { username, email, phone, age, role, nationalID } = req.body; // Include all fields being updated

    // Validate required fields
    if (!username || !email) {
        return res.status(400).json({ error: 'Username and email are required' });
    }

    try {
        // Prepare updated fields dynamically to allow optional updates
        const updatedFields = { username, email };
        if (phone) updatedFields.phone = phone;
        if (age) updatedFields.age = age;
        if (role) updatedFields.role = role;
        if (nationalID) updatedFields.nationalID = nationalID;

        // Update the user in the database
        const result = await User.updateOne(
            { _id: userId }, // No need for `new ObjectId()` if `userId` is already an ObjectId
            { $set: updatedFields }
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

        res.json({ tickets: user.purchasedTickets });
    } catch (error) {
        console.error('Error fetching tickets:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.post('/save-seat', async (req, res) => {
    const { seatDetails, userId, category } = req.body; // Get category here too

    if (!seatDetails || seatDetails.length === 0) {
      return res.status(400).json({ message: 'No seat details provided' });
    }

    try {
      const user = await User.findById(userId);

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      user.purchasedTickets = user.purchasedTickets || [];
      
      // Ensure the category is included when saving each ticket
      seatDetails.forEach(seat => {
        seat.category = category;  // Add category here if it's missing from the seat object
        user.purchasedTickets.push(seat);
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

      if (!user.emailVerified) {
        return res.status(400).json({ message: 'Account not verified. Please check your email.' });
      }

      res.json({ findById: true, user });
    } catch (error) {
      console.error('Error fetching user data:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

// Route to handle form submission
router.post('/send-email', (req, res) => {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    const mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: `New Message from ${name}`,
        text: `Message from ${name} (${email}):\n\n "Thanks for your message. We will get back to you soon."`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
            return res.status(500).json({ message: 'Failed to send email.' });
        }
        res.status(200).json({ message: 'Email sent successfully!' });
    });

    const mailOptions2 = {
        from: process.env.EMAIL,
        to: "kirolosmourice814@gmail.com",
        subject: `New Message from ${name}`,
        text: `Message from ${name} (${email}):\n\n ${message}`,
    };

    transporter.sendMail(mailOptions2, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
            return res.status(500).json({ message: 'Failed to send email.' });
        }
        res.status(200).json({ message: 'Email sent successfully!' });
    });
});

module.exports = router;