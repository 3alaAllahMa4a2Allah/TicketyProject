// src/routes/searchRoutes.js
const express = require('express');
const router = express.Router();
const Ticket = require('../models/ticket');

// Search endpoint
router.get('/', async (req, res) => {
    try {
        const { query } = req.query; // `query` is the search input from the frontend.

        if (!query) {
            return res.status(400).json({ message: 'Search query is required' });
        }

        // Perform a case-insensitive search in the specified fields
        const searchResults = await Ticket.find({
            $or: [
                { name: { $regex: query, $options: 'i' } },        // Case-insensitive match for name
                { description: { $regex: query, $options: 'i' } }, // Case-insensitive match for description
                { location: { $regex: query, $options: 'i' } }     // Case-insensitive match for location
            ]
        });

        res.status(200).json(searchResults);
    } catch (error) {
        console.error('Error performing search:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
