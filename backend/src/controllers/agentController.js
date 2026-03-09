const User = require("../models/User"); 

const addAgent = async (req, res) => {
  try {

    const { name, email, password } = req.body; 

    
    const newAgent = new User({ 
      name, 
      email, 
      password, 
      role: "agent" 
    });

    await newAgent.save();

    // Avoid sending the hashed password back in the response
    res.status(201).json({ 
      success: true, 
      agent: {
        _id: newAgent._id,
        name: newAgent.name,
        email: newAgent.email,
        role: newAgent.role,
        currentLoad: newAgent.currentLoad
      } 
    });
  } catch (error) {
    console.error("Error adding agent:", error);
    // Handle specific mongoose duplicate key error for emails
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: "Email already exists" });
    }
    res.status(500).json({ success: false, message: "Failed to add agent" });
  }
};

// @desc    Get all agents
// @route   GET /api/agents
const getAgents = async (req, res) => {
  try {
    // Fetch only users who have the role of 'agent'. 
    // .select('-password') prevents the hashed passwords from being sent to the client.
    const agents = await User.find({ role: "agent" }).select("-password");
    
    console.log("Agents fetched from DB:", agents);
    res.status(200).json({ success: true, agents });
  } catch (error) {
    console.error("Error fetching agents:", error);
    res.status(500).json({ success: false, message: "Failed to fetch agents" });
  }
};

module.exports = {
  addAgent,
  getAgents
};