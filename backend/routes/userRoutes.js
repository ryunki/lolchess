const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const {verifyIsAdmin, verifyIsLoggedin} = require("../middleware/verifyAuthToken")

// Define user-related routes
router.post('/login', userController.loginUser);
router.post('/register', userController.createUser);
router.use(verifyIsLoggedin)
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);

module.exports = router;