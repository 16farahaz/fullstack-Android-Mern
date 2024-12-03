const fs = require('fs');
const path = require('path');

// Utility function to handle file uploads
const upload = (file, uploadPath) => {
    return new Promise((resolve, reject) => {
        // Validate file type
        const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf']; // Add your allowed types here
        if (!allowedTypes.includes(file.mimetype)) {
            return reject(new Error('Invalid file type'));
        }

        // Validate file size (5MB limit)
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (file.size > maxSize) {
            return reject(new Error('File size exceeds the 5MB limit'));
        }

        // Generate a unique file name to avoid collisions (using timestamp)
        const fileName = Date.now() + path.extname(file.name);
        const filePath = path.join(uploadPath, fileName);

        // Move the file to the specified directory
        file.mv(filePath, (err) => {
            if (err) {
                reject(new Error(`File upload failed: ${err.message}`));
            } else {
                resolve(filePath); // Return the path of the uploaded file
            }
        });
    });
};

module.exports = { upload };
