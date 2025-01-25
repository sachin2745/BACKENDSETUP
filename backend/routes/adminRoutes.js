const express = require('express');
const router = express.Router();
const verifyToken = require('./verifyToken');
const app = express();
const path = require("path");
const multer = require('multer');
const fs = require("fs");
const adminController = require('../controllers/adminController');
const blogCatController = require('../controllers/blogCatController');

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

//ROUTES FOR BLOG
router.get('/blogs/getall', adminController.getBlogs);
router.put('/status/:id',adminController.updateStatus);
router.post('/addblog',upload.fields([{ name: "blogImage" },{ name: "blogImageMobile" }]), verifyToken, adminController.addBlog);
router.get('/get-blog/:id', adminController.getBlog);
router.post('/update-blog/:id', upload.fields([{ name: "blogImage" },{ name: "blogImageMobile" }]), adminController.updateBlog);

//ROUTES FOR BLOG CATEGORY
router.put('/blog-cat-status/:id', blogCatController.updateCatStatus);

module.exports = router;
