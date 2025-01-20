const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const verifyToken = require('./verifyToken');

//fetch all data of users
router.get('/blogs/getall', adminController.getBlogs);
router.put('/status/:id',adminController.updateStatus);



module.exports = router;
