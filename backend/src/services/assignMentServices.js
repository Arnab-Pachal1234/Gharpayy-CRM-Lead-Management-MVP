const Agent = require('../models/Agent');

/**
 * Assigns a lead to the agent with the lowest current workload.
 * Returns the Agent ID or null if no agents exist.
 */
const assignLeadToAgent = async () => {
  try {
    // Find the agent with the lowest current workload
    const agents = await Agent.find().sort({ currentLoad: 1 }).limit(1);
    
    if (agents.length === 0) {
      return null; // No agents available in the system
    }

    const assignedAgentId = agents[0]._id;
    
    // Increment the chosen agent's workload by 1
    await Agent.findByIdAndUpdate(assignedAgentId, { $inc: { currentLoad: 1 } });
    
    return assignedAgentId;
  } catch (error) {
    console.error('Error in lead assignment service:', error);
    throw new Error('Failed to assign lead');
  }
};

module.exports = { assignLeadToAgent };