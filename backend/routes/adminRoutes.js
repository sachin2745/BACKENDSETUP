const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const verifyToken = require('./verifyToken');
const app = express();
const path = require("path");
const multer = require('multer');

// Dynamic folder storage setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const folderName = file.fieldname; // Dynamically get folder name from fieldname
    const uploadPath = path.join(__dirname, "static/uploads", folderName);

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
router.post("/addBlog", upload.fields([{ name: "blogImage" }, { name: "blogImageMobile" }]), adminController.addBlog);


module.exports = router;
