const Lead = require('../models/Lead');
const User = require('../models/User');

exports.getAllLeads = async (req, res) => {
  try {
    let query = {};
    console.log("User Role: in LeadController.js", req.user.role); 
   
    if (req.user.role === 'agent') {
      query.assignedAgent = req.user._id;
    }
  
    console.log("Lead query filter:", query); 
    const leads = await Lead.find({})
      .populate('assignedAgent', 'name role')
      .sort({ createdAt: -1 });
    console.log("Leads fetched from DB:", leads); 
    res.status(200).json({ success: true, leads });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// Admin Only: Manually Reassign Lead
exports.reassignLead = async (req, res) => {
  try {
    const { leadId } = req.params;
    const { newAgentId } = req.body; // Sent from frontend dropdown

    const updatedLead = await Lead.findByIdAndUpdate(
      leadId, 
      { assignedAgent: newAgentId },
      { new: true }
    ).populate('assignedAgent', 'name');

    res.status(200).json({ success: true, lead: updatedLead });
  } catch (error) {
    console.error("Error reassigning lead:", error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};
exports.updateLeadStatus = async (req, res) => {
  try {
    const { leadId } = req.params;
    const { status } = req.body;

    const updatedLead = await Lead.findByIdAndUpdate(
      leadId,
      { status },
      { new: true }
    ).populate('assignedAgent', 'name');

    res.status(200).json({
      success: true,
      lead: updatedLead
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};
exports.createLead = async (req, res) => {
  try {
    const { name, email, phone, source } = req.body;

    // 1. Find the agent with the lowest currentLoad
    const availableAgent = await User.findOne({ role: 'agent' }).sort({ currentLoad: 1 });

    if (!availableAgent) {
      return res.status(404).json({ success: false, message: 'No agents available to assign the lead' });
    }

    // 2. Create the new lead and assign it to that agent
    const newLead = new Lead({
      name,
      email,
      phone,
      source,
      assignedTo: availableAgent._id // Assign to the found agent
    });

    await newLead.save();

    // 3. Increment the agent's workload so they don't get all the leads at once
    availableAgent.currentLoad += 1;
    await availableAgent.save();

    res.status(201).json({ 
      success: true, 
      message: 'Lead created and assigned successfully',
      lead: newLead 
    });

  } catch (error) {
    console.error('Error creating lead:', error);
    res.status(500).json({ success: false, message: 'Failed to create lead' });
  }
};