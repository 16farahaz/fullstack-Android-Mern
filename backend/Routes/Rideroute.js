const express = require('express');
const router = express.Router();
const { 
    getMyRides,
    createRide, 
    getAllRides, 
    getRideById, 
    updateRideById, 
    deleteRideById 
} = require('../Controller/RideController');

// Create a new ride
router.post('/ridescreate', createRide);

// Get all rides
router.get('/rides', getAllRides);
//Get the user rides only 
router.get('/myride/:userId',getMyRides)

// Get a single ride by ID
router.get('/rides/:id', getRideById);

// Update a ride by ID
router.put('/rides/:id', updateRideById);

// Delete a ride by ID
router.delete('/rides/:id', deleteRideById);

module.exports = router;
