const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const verifyToken = require("./verifyToken");
const multer = require('multer');
const fs = require("fs");
const path = require("path");

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
router.get("/getall", userController.getUsers);
router.put("/status/:id", userController.updateStatus);
router.put("/popular/:id", userController.updatePopular);
router.post("/add-user", upload.fields([{ name: "userImage" }]), userController.addUser);


router.post("/authenticate", userController.authenticateUsers);

router.get("/authorise", verifyToken, userController.authorise);

module.exports = router;
