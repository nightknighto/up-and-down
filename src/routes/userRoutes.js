// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');

// Route to get the logged-in user's files
router.get('/', authMiddleware, userController.getUserFiles);

module.exports = router;