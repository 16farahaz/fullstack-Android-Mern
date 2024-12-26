const Ride = require('../Models/Ride');

const createRide = async (req, res) => {
    try {
        
        // Create a new ride instance with the request body
        const ride = new Ride(req.body);
        
        // Save the ride to the database
        const savedRide = await ride.save();
        
        // Return the saved ride ID (and optionally other details)
        res.status(201).json({ message: 'Ride created successfully!', rideId: savedRide._id });
    } catch (error) {
        // Handle any error that occurs during the creation of the ride
        res.status(400).json({ error: error.message });
    }
};


// Get all rides
const getAllRides = async (req, res) => {
    try {
        const rides = await Ride.find();
        res.status(200).json(rides);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
const getMyRides = async (req, res) => {
    try {
        const { userId } = req.params;

        // Validation de l'ID utilisateur
        if (!userId) {
            return res.status(400).json({ error: "User ID is required" });
        }

        // Rechercher les trajets par userId
        const rides = await Ride.find({ userId }).sort({ Datee: -1 });  // Trier par date décroissante

        if (rides.length === 0) {
            return res.status(404).json({ message: "No rides found for this user" });
        }
       console.log(rides);
        res.status(200).json(rides);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch user rides" });
    }
};

// Get a single ride by ID
const getRideById = async (req, res) => {
    try {
        const ride = await Ride.findById(req.params.id);
        if (!ride) {
            return res.status(404).json({ message: 'Ride not found' });
        }
        res.status(200).json(ride);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update a ride by ID
const updateRideById = async (req, res) => {
    try {
        const ride = await Ride.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!ride) {
            return res.status(404).json({ message: 'Ride not found' });
        }
        res.status(200).json(ride);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Delete a ride by ID
const deleteRideById = async (req, res) => {
    try {
        const ride = await Ride.findByIdAndDelete(req.params.id);
        if (!ride) {
            return res.status(404).json({ message: 'Ride not found' });
        }
        res.status(200).json({ message: 'Ride deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getMyRides,
    createRide,
    getAllRides,
    getRideById,
    updateRideById,
    deleteRideById
};
