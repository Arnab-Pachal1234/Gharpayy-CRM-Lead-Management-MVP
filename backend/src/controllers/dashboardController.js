const Lead = require("../models/Lead"); 


const getDashboardStats = async (req, res) => {
  try {
    const totalLeads = await Lead.countDocuments();
    const visitsScheduled = await Lead.countDocuments({ status: "Visit Scheduled" });
    const bookingsConfirmed = await Lead.countDocuments({ status: "Booked" });

    const pipelineData = await Lead.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ]);

    const pipelineStages = pipelineData.reduce((acc, stage) => {
      acc[stage._id] = stage.count;
      return acc;
    }, {});

    res.status(200).json({
      success: true, 
      data: {
        totalLeads,
        visitsScheduled,
        bookingsConfirmed,
        pipeline: pipelineStages
      }
    });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    res.status(500).json({ success: false, message: "Failed to fetch dashboard stats" });
  }
};

module.exports = {
  getDashboardStats
};