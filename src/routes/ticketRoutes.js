// src/routes/ticketRoutes.js
const express = require('express');
const router = express.Router();
const Ticket = require('../models/ticket');

router.get('/', async (req, res) => {
    try {
        const { minPrice, maxPrice } = req.query;
        const query = {};

        if (minPrice) {
            query.price = { ...query.price, $gte: Number(minPrice) };
        }
        if (maxPrice) {
            query.price = { ...query.price, $lte: Number(maxPrice) };
        }

        const tickets = await Ticket.find(query);
        res.json(tickets);
    } catch (error) {
        console.error('Error fetching tickets:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Endpoint to fetch a specific ticket by ID
router.get('/:id', async (req, res) => {
    try {
        const ticket = await Ticket.findById(req.params.id);
        if (!ticket) {
            return res.status(404).json({ message: 'Ticket not found' });
        }
        res.json(ticket);
    } catch (error) {
        console.error('Error fetching ticket:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Endpoint to fetch unique ticket locations
router.get('/locations', async (req, res) => {
    try {
        const locations = await Ticket.distinct('location');
        res.json(locations);
    } catch (error) {
        console.error('Error fetching locations:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Endpoint to fetch unique ticket types
router.get('/ticket-types', async (req, res) => {
    try {
        const ticketTypes = await Ticket.distinct('ticketType');
        res.json(ticketTypes);
    } catch (error) {
        console.error('Error fetching ticket types:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Endpoint to handle seat booking
router.post('/save-seat', async (req, res) => {
    try {
        // Destructure seatNumbers (plural), ticketId, and selectedType from the request body
        const { seatNumbers, ticketId, selectedType } = req.body;

        // Find the ticket by its ID
        const ticket = await Ticket.findById(ticketId);

        if (!ticket) {
            return res.status(404).json({ message: 'Ticket not found' });
        }

        // Select the appropriate seat data based on the type
        const SeatData =
            selectedType === 'stander'
                ? ticket.seats_stander
                : selectedType === 'max'
                ? ticket.seats_max
                : selectedType === 'imax'
                ? ticket.seats_imax
                : selectedType === 'gold'
                ? ticket.seats_gold
                : [];

        if (!Array.isArray(seatNumbers)) {
            return res.status(400).json({ message: 'seatNumbers should be an array' });
        }

        // Check if any of the selected seats are already booked
        const alreadyBookedSeats = seatNumbers.filter(seat => SeatData.includes(seat));

        if (alreadyBookedSeats.length > 0) {
            return res.status(400).json({ message: `Seats ${alreadyBookedSeats.join(', ')} already booked` });
        }

        // Add the selected seats to the ticket
        SeatData.push(...seatNumbers);
        ticket.amount = ticket.amount - seatNumbers.length;

        // Save the ticket
        await ticket.save();

        res.status(200).json({ message: 'Seats booked successfully', seatNumbers });
    } catch (error) {
        console.error('Error saving seat:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Route to get all seats for a specific ticket
router.get('/seats/:ticketId', async (req, res) => {
    const { ticketId } = req.params;
  
    try {
      // Find the ticket by ID
      const ticket = await Ticket.findById(ticketId);
  
      if (!ticket) {
        return res.status(404).json({ message: 'Ticket not found' });
      }
  
      // Function to map seats into a structured response
      const mapSeats = (seats) => seats.map(seat => ({
        seatNumber: seat,  // Seat number as is
        status: 'sold'
      }));
  
      // Mapping seats for all categories
      const seatData_stander = mapSeats(ticket.seats_stander);
      const seatData_max = mapSeats(ticket.seats_max);
      const seatData_imax = mapSeats(ticket.seats_imax);
      const seatData_gold = mapSeats(ticket.seats_gold);
  
      // Send the seat data to the frontend
      res.status(200).json({ seatData_stander, seatData_max, seatData_imax, seatData_gold });
    } catch (error) {
      console.error('Error fetching seats:', error);
      res.status(500).json({ message: 'Error fetching seats' });
    }
  });  

module.exports = router;
