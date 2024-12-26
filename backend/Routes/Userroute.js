const express = require('express');
const router = express.Router();

const { updatecin, registerUser, loginUser, updateUser, blockUser, getUserById, getUsers, getUserProfile, updateImage } = require('../Controller/UserController');
const verifyJWT = require('../middlewares/jwtmiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');



// Route to register a user (with file upload)
router.post('/register', registerUser); // 'image' is the form field name for the image file
// Route to login a user
router.post('/login', loginUser);

// Route to update a user
router.put('/update/:id', verifyJWT, roleMiddleware(['Superadmin','Diver','Passenger']), updateUser);

// Route to block a user
router.put('/block/:id', verifyJWT, roleMiddleware(['Superadmin']), blockUser);//block user by superadmin

// Route to get a user by ID
router.get('/user/:id', verifyJWT, roleMiddleware(['Superadmin']), getUserById);//search for user by superadmin

// Route to get all users
router.get('/users', verifyJWT, roleMiddleware(['Superadmin']), getUsers); // Only superadmin can get all users

// Route to get my profil
router.get('/me', verifyJWT,getUserProfile); 
router.put('/upcin/:id',updatecin);
router.put('/upimg/:id', verifyJWT, roleMiddleware(['Superadmin','Driver','Passenger ']),updateImage);

module.exports = router;