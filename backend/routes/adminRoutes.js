const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const verifyToken = require('./verifyToken');
const app = express();
const path = require("path");
const multer = require('multer');
const fs = require("fs");

// Dynamic folder storage setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const folderName = file.fieldname; // This will be "blogImage" based on your upload fields
    const uploadPath = path.join(__dirname, "../static/uploads", folderName); // Go up one directory

    // Ensure the folder exists, create it if not
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Set file size limit to 5MB
});

//fetch all data of users
router.get('/blogs/getall', adminController.getBlogs);
router.put('/status/:id',adminController.updateStatus);
// router.post(
//   '/addblog',
//   (req, res, next) => {
//     upload.fields([{ name: "blogImage" }, { name: "blogImageMobile" }])(req, res, (err) => {
//       if (err instanceof multer.MulterError) {
//         console.error("Multer error:", err); // Debugging
//         return res.status(400).json({ error: "Multer error: " + err.message });
//       } else if (err) {
//         console.error("File upload error:", err); // Debugging
//         return res.status(500).json({ error: "File upload error: " + err.message });
//       }
//       next();
//     });
//   },
//   verifyToken,
//   adminController.addBlog
// );

router.post('/addblog',upload.fields([{ name: "blogImage" }]), verifyToken, adminController.addBlog
);

module.exports = router;
