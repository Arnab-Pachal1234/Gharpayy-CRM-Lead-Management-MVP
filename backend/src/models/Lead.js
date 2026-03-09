const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  source: { 
    type: String, 
    enum: ['WhatsApp', 'Website Form', 'Social Media', 'Lead Form'], 
    required: true 
  },
  status: { 
    type: String, 
    enum: ['New Lead', 'Contacted', 'Requirement Collected', 'Property Suggested', 'Visit Scheduled', 'Visit Completed', 'Booked', 'Lost'],
    default: 'New Lead' 
  },
  assignedAgent: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' // <-- CHANGED THIS FROM 'Agent' TO 'User'
  },
  lastActive: { type: Date, default: Date.now }
}, { timestamps: true }); 

module.exports = mongoose.model('Lead', leadSchema);