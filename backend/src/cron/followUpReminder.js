const cron = require('node-cron');
const Lead = require('../models/Lead');

cron.schedule('0 9 * * *', async () => {
  console.log('Running daily follow-up check...');
  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

 
  const inactiveLeads = await Lead.find({
    lastActive: { $lte: oneDayAgo },
    status: { $nin: ['Booked', 'Lost'] }
  }).populate('assignedAgent');

  inactiveLeads.forEach(lead => {
   
    console.log(`Reminder: Agent ${lead.assignedAgent.name}, please follow up with ${lead.name} (${lead.status}).`);
  });
});