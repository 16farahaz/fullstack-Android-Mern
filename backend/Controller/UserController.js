    const User = require('../Models/User');
    const jwt = require('jsonwebtoken');
    const bcrypt = require('bcrypt');
    const { checkEmailExists } = require('../middlewares/verifymiddleware');
    const fileUploader = require('../Uploads/fileUploader');
    const path = require('path'); // Import path module

    // Register a new user
    const registerUser = async (req, res) => {
        try {
            console.log(req.body);
            const { name, lastname, country, email, motpasse, serie, mark, role } = req.body;
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
            const newUser = new User({
                name,
                lastname,
                country,
                email,
                motpasse: cryptedPass, 
                image,  // Profile image
                imageUri,  // CIN image
                serie,
                mark,
                role
            });
    
            // Save user and generate JWT token
            const savedUser = await newUser.save();
            const token = jwt.sign({ _id: savedUser._id, role: savedUser.role }, '123456789', { expiresIn: '1h' });
    
            // Respond with user and token
            res.status(201).json({ user: savedUser, token });
        } catch (error) {
            console.error('Error during user registration:', error);
            res.status(500).json({ message: 'Server error' });
        }
    };
    

    // Login user
    const loginUser = async (req, res) => {
        try {
            const { email, motpasse,status } = req.body;

            console.log("Login attempt:", { email, motpasse }); // Debugging log

            // Check if the user exists
            const user = await User.findOne({ email });
            if (!user) {
                return res.status(404).json({ message: 'User not found!' });
            }

            console.log("User found:", user); // Debugging log
            if (status=== 'blocked'){
                return res.status(403).json({ message: 'You do not have permission to login in your account is blocked please check the administration for more information ' });
            }
            // Validate password
            const validPass = await bcrypt.compare(motpasse, user.motpasse);
            if (!validPass) {
                return res.status(401).json({ message: 'Invalid credentials!' });
            }

            // Create a JWT token with role
            const token = jwt.sign({ _id: user._id, role: user.role }, '123456789', { expiresIn: '1h' });
            console.log("Generated Token:", token);
            
            // Return the user and token
            res.status(200).json({ user, token });
        } catch (error) {
            console.error('Error during user login:', error);
            res.status(500).json({ message: 'Server error' });
        }
    };
    const updateUser = async (req, res) => {
        try {
            const userId = req.params.id; // Get user ID from URL parameters
            const { name, lastname, email, motpasse, role } = req.body;

            // Find the user by ID
            let user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({ message: 'User not found!' });
            }

            // Ensure the current user has permission to update roles
            const currentUser = req.user;

            // Only Superadmin can update roles to Superadmin
            if (role === 'Superadmin' && currentUser.role !== 'Superadmin') {
                return res
                    .status(403)
                    .json({ message: 'Only a Superadmin can assign the Superadmin role.' });
            }

            // Allow other role updates or data changes for the current user
            if (name) user.name = name;
            if (lastname) user.lastname = lastname;
            if (email) {
                // Check if the new email is not already taken
                const emailExists = await User.findOne({ email });
                if (emailExists && email !== user.email) {
                    return res.status(400).json({ message: 'Email already exists' });
                }
                user.email = email;
            }
            if (motpasse) user.motpasse = await bcrypt.hash(motpasse, 10); // Hash new password
            if (role && currentUser.role === 'Superadmin') user.role = role; // Update role if provided and current user is a Superadmin

            // Handle file upload for image
            if (req.files && req.files.image) {
                const uploadPath = './Uploads/';
                user.image = await fileUploader.upload(req.files.image, uploadPath);
            }

            // Handle file upload for CIN
            if (req.files && req.files.cin) {
                const uploadPath = './Uploads/';
                user.cin = await fileUploader.upload(req.files.cin, uploadPath);
            }

            // Save the updated user
            await user.save();

            res.status(200).json({ message: 'User updated successfully!', user });
        } catch (error) {
            console.error('Error updating user:', error);
            res.status(500).json({ message: 'Server error' });
        }
    };


    // Update user profile image
    const updateImage = async (req, res) => {
        try {
            const userId = req.params.id; // Get user ID from URL parameters

            // Find the user by ID
            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({ message: 'User not found!' });
            }

            /* // Ensure the current user has permission to update the image
            const currentUser = req.user;
            if (currentUser.role !== 'superadmin' && currentUser._id.toString() !== userId) {
                return res.status(403).json({ message: 'You do not have permission to update this user' });
            } */

            // Handle file upload if there's a new image
            if (req.files && req.files.image) {
                const uploadPath = path.join(__dirname, '../Uploads/');
                user.image = await fileUploader.upload(req.files.image, uploadPath);
            } else {
                return res.status(400).json({ message: 'No image file provided!' });
            }



            // Handle file upload for CIN
            if (req.files && req.files.cin) {
                const uploadPath = './Uploads/';
                user.imageUri = await fileUploader.upload(req.files.cin, uploadPath); // Update imageUri with CIN image
            }

            // Save the updated user
            await user.save();

            res.status(200).json({ message: 'Profile image updated successfully!', user });
        } catch (error) {
            console.error('Error updating profile image:', error);
            res.status(500).json({ message: 'Server error' });
        }
    };

    // Update user profile image
    const updatecin = async (req, res) => {
        try {
            const userId = req.params.id; // Get user ID from URL parameters

            // Find the user by ID
            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({ message: 'User not found!' });
            }

            /* // Ensure the current user has permission to update the image
            const currentUser = req.user;
            if (currentUser.role !== 'superadmin' && currentUser._id.toString() !== userId) {
                return res.status(403).json({ message: 'You do not have permission to update this user' });
            } */

            // Handle file upload if there's a new image
            if (req.files && req.files.cin) {
                const uploadPath = path.join(__dirname, '../Uploads/');
                user.cin = await fileUploader.upload(req.cin, uploadPath);
            } else {
                return res.status(400).json({ message: 'No image file provided!' });
            }

            // Save the updated user
            await user.save();

            res.status(200).json({ message: 'Profile image updated successfully!', user });
        } catch (error) {
            console.error('Error updating profile image:', error);
            res.status(500).json({ message: 'Server error' });
        }
    };

    // Block a user
    const blockUser = async (req, res) => {
        try {
            const userId = req.params.id; // Get user ID from URL parameters

            // Find the user by ID
            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({ message: 'User not found!' });
            }

            // Ensure the current user has permission to block users
            const currentUser = req.user;
            if (currentUser.role !== 'Superadmin') {
                return res.status(403).json({ message: 'You do not have permission to block users' });
            }

            // Update user status to 'blocked'
            user.status = 'blocked';
            //chnzid haja bch ma3ach tnajem ylogi

            // Save the updated user
            await user.save();

            res.status(200).json({ message: 'User blocked successfully!', user });
        } catch (error) {
            console.error('Error blocking user:', error);
            res.status(500).json({ message: 'Server error' });
        }
    };

    // Get user by ID
    const getUserById = async (req, res) => {
        try {
            const userId = req.params.id; // Get user ID from URL parameters

            // Find the user by ID
            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({ message: 'User not found!' });
            }

            res.status(200).json({ user });
        } catch (error) {
            console.error('Error retrieving user:', error);
            res.status(500).json({ message: 'Server error' });
        }
    };

    // Get all users
    const getUsers = async (req, res) => {
        try {
            // Ensure the current user has permission to fetch all users
            const currentUser = req.user;
            if (currentUser.role !== 'Superadmin') {
                return res.status(403).json({ message: 'You do not have permission to access this resource' });
            }

            // Fetch all users from the database
            const users = await User.find();
            res.status(200).json({ users });
        } catch (error) {
            console.error('Error retrieving users:', error);
            res.status(500).json({ message: 'Server error' });
        }
    };

    // Get user profile
    const getUserProfile = async (req, res) => {
        try {
            // Retrieve the user ID from the JWT payload (set by the verifyJWT middleware)
            const userId = req.user._id;

            // Fetch the user's details from the database, excluding the password field
            const user = await User.findById(userId).select('-motpasse');

            // Check if the user exists
            if (!user) {
                return res.status(404).json({ message: 'User not found!' });
            }

            res.status(200).json({ user });
        } catch (error) {
            console.error('Error retrieving user profile:', error);
            res.status(500).json({ message: 'Server error' });
        }
    };

    // Export the controller functions
    module.exports = {
        updatecin,
        registerUser,
        loginUser,
        updateUser,
        updateImage,
        blockUser,
        getUserById,
        getUsers,
        getUserProfile
    };