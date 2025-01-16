const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Define the '/users' route
router.get('/users', userController.getUsers);


router.post('/users/authenticate', userController.authenticateUsers);

module.exports = router;
