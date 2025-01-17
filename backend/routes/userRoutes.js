const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const verifyToken = require('./verifyToken');

//fetch all data of users
router.get('/getall', userController.getUsers);

router.post('/authenticate', userController.authenticateUsers);

router.get('/authorise', verifyToken, userController.authorise);

module.exports = router;
