const User = require('../Models/User');

const checkEmailExists = async (email) => {
    try {
        // Use the email parameter instead of the hardcoded 'emailr'
        const user = await User.findOne({ email: email });
        return user !== null;
    } catch (error) {
        console.error('Error checking email existence:', error); // Log the actual error
        throw new Error('Erreur lors de la vérification de l\'email');
    }
};

module.exports = {
    checkEmailExists
};