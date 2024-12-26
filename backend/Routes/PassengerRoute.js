const express = require('express');
const router = express.Router();
const {registerPassenger } = require('../Controller/PassengerController');
const verifyJWT = require('../middlewares/jwtmiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

// Route to register a user
router.post('/register', registerPassenger);



module.exports = router;