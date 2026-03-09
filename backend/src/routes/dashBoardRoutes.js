const express = require('express');
const router = express.Router();
const Lead = require('../models/Lead');

// GET /api/dashboard
// Calculates and returns statistics for the frontend dashboard
router.get('/', async (req, res) => {
  try {
    const totalLeads = await Lead.countDocuments();
    const visitsScheduled = await Lead.countDocuments({ status: 'Visit Scheduled' });
    const bookingsConfirmed = await Lead.countDocuments({ status: 'Booked' });

    // Aggregate to count leads by their pipeline status
    const pipelineData = await Lead.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ]);

    // Format pipeline data into a simple object { "New Lead": 5, "Contacted": 2 }
    const pipelineStages = {};
    pipelineData.forEach(stage => {
      pipelineStages[stage._id] = stage.count;
    });

    res.status(200).json({
      totalLeads,
      visitsScheduled,
      bookingsConfirmed,
      pipeline: pipelineStages
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Failed to fetch dashboard stats' });
  }
});

module.exports = router;