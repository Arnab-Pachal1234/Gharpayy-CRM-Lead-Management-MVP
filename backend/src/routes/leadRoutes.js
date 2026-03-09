const { protect, adminOnly } = require('../middleware/authMiddleware');
const leadController = require('../controllers/leadController');
const express = require('express');

const router = express.Router();

router.get('/', protect, leadController.getAllLeads);
router.post('/capture', protect, leadController.createLead);
router.put('/:leadId/status', protect, leadController.updateLeadStatus);

router.put('/:leadId/reassign', protect, adminOnly, leadController.reassignLead);

module.exports = router;