const express = require('express');
const router = express.Router();
const {registerPassenger , getPassengerById} = require('../Controller/PassengerController');
const verifyJWT = require('../middlewares/jwtmiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

// Route to register a user
router.post('/register', registerPassenger);
router.get('/one/:passengerId', getPassengerById);


module.exports = router;