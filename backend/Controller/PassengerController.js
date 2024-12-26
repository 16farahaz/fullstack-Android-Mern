const Passenger = require('../Models/Passenger');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { checkEmailExists } = require('../middlewares/verifymiddleware');
const fileUploader = require('../Uploads/fileUploader');
const path = require('path'); // Import path module

// Register a new user
const registerPassenger = async (req, res) => {
    try {
        console.log(req.body);
        const { name, lastname, country, email, motpasse, role } = req.body;
        const imageUri = req.files?.imageUri ? req.files.imageUri : '../Uploads/userr.png'; // Default or file from the form
        let image = req.files?.image ? await fileUploader.upload(req.files.image, '../Uploads/') : '../Uploads/userr.png'; // Default profile image

        // Check if email exists
        const emailExists = await checkEmailExists(email);
        if (emailExists) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        // Hash the password
        const cryptedPass = await bcrypt.hash(motpasse, 10);

        // Create new user object
        const newPassenger = new Passenger({
            name,
            lastname,
            country,
            email,
            motpasse: cryptedPass, 
            image,  // Profile image
            imageUri,  // CIN image
            role
        });

        // Save user and generate JWT token
        const savedPassenger = await newPassenger.save();
        const token = jwt.sign({ _id: savedPassenger._id, role: savedPassenger.role }, '123456789', { expiresIn: '1h' });

        // Respond with user and token
        res.status(201).json({ Passenger: savedPassenger, token });
    } catch (error) {
        console.error('Error during user registration:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
// Export the controller functions
module.exports = {
    
    registerPassenger,
    
};
