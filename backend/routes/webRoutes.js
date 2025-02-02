const express = require('express');
const router = express.Router();
const verifyToken = require('./verifyToken');
const app = express();
const blogWebController = require('../controllers/blogWebController');


//ROUTES FOR BLOG
router.get('/blogs/getall', blogWebController.getBlogs);
router.get('/post/getbysku/:slug', blogWebController.getBlogBySku);
router.get('/recent-blogs', blogWebController.getRecentBlogs);

router.get('/search', blogWebController.searchBlog);

router.post("/add-comment/:id", blogWebController.addComment);
router.get("/get-comments/:blogSlug", blogWebController.getComments);


module.exports = router;
