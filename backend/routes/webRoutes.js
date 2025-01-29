const express = require('express');
const router = express.Router();
const verifyToken = require('./verifyToken');
const app = express();
const blogWebController = require('../controllers/blogWebController');


//ROUTES FOR BLOG
router.get('/post/getbysku/:slug', blogWebController.getBlogBySku);


module.exports = router;
