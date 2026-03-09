const express = require('express');
const router = express.Router();

// Import the controller functions
const { addAgent, getAgents } = require('../controllers/agentController');

// Map the routes to the controller functions
router.post('/', addAgent);
router.get('/', getAgents);

module.exports = router;