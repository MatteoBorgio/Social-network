/**
 * Configuration for multer middleware to handle image uploads
 * Set up storage engine, file validation and size limits
 */

const multer = require('multer');
const path = require('path');
const fs = require('fs');

/**
 * Configure storage settings for uploaded files
 * Stores the file locally in the 'uploads/profiles/' directory
 * Guarantees unique file names
 */
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const rootDir = process.cwd();
        const dest = path.resolve(rootDir, 'uploads', 'profiles');

        if (!fs.existsSync(dest)) {
            fs.mkdirSync(dest, { recursive: true });
        }

        cb(null, dest);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

/**
 * Filter files to ensure the upload of only image files
 */
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Only images are allowed!'), false);
    }
};

/**
 * Initialize multer with storage, filter and file limits
 */
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 }
});

module.exports = upload;
