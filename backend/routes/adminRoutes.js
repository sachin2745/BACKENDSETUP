const express = require("express");
const router = express.Router();
const verifyToken = require("./verifyToken");
const app = express();
const path = require("path");
const multer = require("multer");
const fs = require("fs");
const adminController = require("../controllers/adminController");
const blogCatController = require("../controllers/blogCatController");
const dashboardController = require("../controllers/dashboardController");
const aboutController = require("../controllers/aboutController");

// Dynamic folder storage setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let folderName = "";

    // Determine the destination folder based on the file fieldname or route
    if (file.fieldname === "blogImage") {
      folderName = "blogImage"; // Folder for blog images
    } else if (file.fieldname === "blogImageMobile") {
      folderName = "blogImageMobile";
    } else if (
      file.fieldname === "ourMissionImg1" ||
      file.fieldname === "ourMissionImg2" ||
      file.fieldname === "ourMissionImg3" ||
      file.fieldname === "ourVisionImg"
    ) {
      folderName = "ourMissionVision"; // Folder for mission & vision images
    } else {
      folderName = "others"; // Default folder for any other images
    }
    
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
router.get("/blogs/getall", adminController.getBlogs);
router.put("/status/:id", adminController.updateStatus);
router.post(
  "/addblog",
  upload.fields([{ name: "blogImage" }, { name: "blogImageMobile" }]),
  verifyToken,
  adminController.addBlog
);
router.get("/get-blog/:id", adminController.getBlog);
router.post(
  "/update-blog/:id",
  upload.fields([{ name: "blogImage" }, { name: "blogImageMobile" }]),
  adminController.updateBlog
);

//ROUTES FOR BLOG CATEGORY
router.put("/blog-cat-status/:id", blogCatController.updateCatStatus);
router.post(
  "/add-blog-category",
  upload.none(),
  verifyToken,
  blogCatController.addBlogCategory
);
router.get("/get-blog-category/:id", blogCatController.getBlogCategory);
router.post(
  "/update-blog-category/:id",
  upload.none(),
  blogCatController.updateBlogCategory
);

//ROUTES FOR DASHBOARD
router.get("/getCounts", dashboardController.getCounts);

//ROUTES FOR COMMENTS
router.post("/update-comment-status", adminController.updateComment);
router.put("/comment-delete/:id", adminController.deleteComment);

//ROUTES FOR ABOUT US
router.get("/mission-vision", aboutController.getMissionVision);
router.post(
  "/update/mission-vision",
  upload.fields([
    { name: "ourMissionImg1", maxCount: 1 },
    { name: "ourMissionImg2", maxCount: 1 },
    { name: "ourMissionImg3", maxCount: 1 },
    { name: "ourVisionImg", maxCount: 1 },
  ]),
  aboutController.updateMissionVision
),
  (module.exports = router);
