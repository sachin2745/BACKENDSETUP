const express = require('express');
const router = express.Router();
const verifyToken = require('./verifyToken');
const app = express();
const blogWebController = require('../controllers/web/blogWebController');
const settingWebController = require('../controllers/web/settingWebController');
const pageWebController = require("../controllers/web/pageWebController");
const contactWebController = require("../controllers/web/contactWebController");
const homeWebController = require("../controllers/web/homeWebController");
const aboutWebController = require("../controllers/web/aboutWebController");
const consumerWebController = require("../controllers/web/consumerWebController");


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

//HOME PAGE
router.get('/home/getall', homeWebController.getHomeDetails);

//BLOGS
router.get("/blog/getall", settingWebController.getBlogDetails);

//ABOUT US
router.get("/about/getall", aboutWebController.getAboutDetails);
router.get("/about-data/getall", aboutWebController.getAboutData);


router.post("/enquiry-form/submit", homeWebController.SubmitEnquiryForm);

//COSUMER
router.post("/consumer/authenticate",consumerWebController.authenticateConsumer);
router.get("/authorise", verifyToken, consumerWebController.authorise);
router.post("/add-consumer", consumerWebController.addConsumer);

router.get('/consumer/getbyemail/:email',consumerWebController.getConsumerByEmail);
router.put("/consumer/update/:id", consumerWebController.updateConsumer);
module.exports = router;
