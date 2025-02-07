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
const settingController = require("../controllers/settingController");

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
      file.fieldname === "ourVisionImg" ||
      file.fieldname === "ourMissionBgImg" ||
      file.fieldname === "ourVisionBgImg"
    ) {
      folderName = "ourMissionVision"; // Folder for mission & vision images
    } else if (
      file.fieldname === "companyLogo" ||
      file.fieldname === "fav180" ||
      file.fieldname === "fav32" ||
      file.fieldname === "fav16"
    ) {
      folderName = "Setting"; // Folder for mission & vision images
    } else if (file.fieldname === "founderImg") {
      folderName = "Founder";
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
    { name: "ourMissionBgImg", maxCount: 1 },
    { name: "ourVisionBgImg", maxCount: 1 },
  ]),
  aboutController.updateMissionVision
);

router.get("/founder/getall", aboutController.getFounder);
router.put("/founder-status/:id", aboutController.updateFounderStatus);
router.delete("/founder-delete/:id", aboutController.deleteFounder);
router.post(
  "/add-founder",
  upload.fields([{ name: "founderImg", maxCount: 1 }]),
  aboutController.addFounder
);
router.get("/get-founder/:id", aboutController.getFounderById);
router.put("/update-founder/:id", upload.fields([{ name: "founderImg", maxCount: 1 }]),aboutController.updateFounder);



//ROUTES FOR APPEARANCE
router.get("/general-setting/getall", settingController.getSetting);
router.post(
  "/update/general-setting",
  upload.fields([
    { name: "companyLogo", maxCount: 1 },
    { name: "fav180", maxCount: 1 },
    { name: "fav32", maxCount: 1 },
    { name: "fav16", maxCount: 1 },
  ]),
  settingController.updateSetting
);

router.get("/page-content/getall", settingController.getPageContent);
router.put("/page-content-status/:id", settingController.updatePageStatus);
router.get("/get-page-content/:id", settingController.getPageById);
router.post(
  "/update-page-content/:id",
  upload.none(),
  settingController.updatePage
);

module.exports = router;
