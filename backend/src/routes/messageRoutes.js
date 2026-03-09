const express = require('express');
const router = express.Router();

const { protect } = require('../middleware/authMiddleware');
const { getMessages, sendMessage } = require('../controllers/messageController');

// Map the routes
router.get('/:otherUserId', protect, getMessages);
router.post('/', protect, sendMessage); // New route to send a message

module.exports = router;