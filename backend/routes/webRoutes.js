const express = require('express');
const router = express.Router();
const verifyToken = require('./verifyToken');
const app = express();
const blogWebController = require('../controllers/web/blogWebController');
const settingWebController = require('../controllers/web/settingWebController');
const pageWebController = require("../controllers/web/pageWebController");
const contactWebController = require("../controllers/web/contactWebController");


//ROUTES FOR BLOG
router.get('/blogs/getall', blogWebController.getBlogs);
router.get('/post/getbysku/:slug', blogWebController.getBlogBySku);
router.get('/recent-blogs', blogWebController.getRecentBlogs);

router.get('/search', blogWebController.searchBlog);

router.post("/add-comment/:id", blogWebController.addComment);
router.get("/get-comments/:blogSlug", blogWebController.getComments);

//FOOTER
router.get('/contact', settingWebController.getContacts);
router.get('/footer-data', settingWebController.getFooterData);

//PRIVACY POLICY , TERMS AND CONDITIONS, REFUND POLICY
router.get("/legal-documents/getall", pageWebController.getLegalDocuments);

//CONTACT US
router.get("/contact/getall", contactWebController.getContactDetails);


//HEADER DATA
router.get('/header-data', settingWebController.getHeaderData);


module.exports = router;
