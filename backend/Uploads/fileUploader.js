const multer = require('multer');
const path = require('path');

// Configure storage with destination folder and filename formatting
const storage = multer.diskStorage({
  destination(req, file, callback) {
    callback(null, './images'); // Specify the destination folder for uploaded files
  },
  filename(req, file, callback) {
    // Create a unique filename based on fieldname, timestamp, and original name
    callback(null, `${file.fieldname}_${Date.now()}_${file.originalname}`);
  },
});

// Initialize multer with the storage configuration
const upload = multer({ storage });

// Export multer upload as a middleware
module.exports = { upload };
