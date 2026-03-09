const Message = require('../models/Message');


const getMessages = async (req, res) => {
  try {
    const { otherUserId } = req.params;
    const loggedInUserId = req.user._id;

    const messages = await Message.find({
      $or: [
        { sender: loggedInUserId, receiver: otherUserId },
        { sender: otherUserId, receiver: loggedInUserId }
      ]
    }).sort({ createdAt: 1 });
    
    res.status(200).json({ success: true, messages });
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ success: false, message: 'Failed to fetch messages' });
  }
};


const sendMessage = async (req, res) => {
  try {
    const { receiverId, text } = req.body;
    const senderId = req.user._id;

    // 1. Save to database via HTTP route
    const newMessage = new Message({
      sender: senderId,
      receiver: receiverId,
      text 
    });
    await newMessage.save();

    // 2. Retrieve Socket.io instance and users map from Express
    const io = req.app.get('io');
    const onlineUsers = req.app.get('onlineUsers');

    // 3. Emit real-time message ONLY if the receiver is currently online
    if (io && onlineUsers) {
      // Look up the receiver's specific socket ID
      const receiverSocketId = onlineUsers.get(receiverId.toString());
      
      if (receiverSocketId) {
        // Ping their specific browser tab instantly
        io.to(receiverSocketId).emit('receiveMessage', newMessage);
      }
    }

    // 4. Send standard HTTP response back to the sender
    res.status(201).json({ success: true, message: newMessage });
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ success: false, message: 'Failed to send message' });
  }
};

module.exports = {
  getMessages,
  sendMessage
};