require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const http = require('http');
const { Server } = require('socket.io');

// Import Routes
const agentRoutes = require('./routes/agentRoutes');
const authRoutes = require('./routes/authRoutes');
const leadRoutes = require('./routes/leadRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes'); 
const messageRoutes = require('./routes/messageRoutes');

// Initialize Express App
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/leads', leadRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/agents', agentRoutes);
app.use('/api/messages', messageRoutes);

// Health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'API is running smoothly' });
});

// --- SOCKET.IO SETUP ---
const server = http.createServer(app);

const io = new Server(server, {
  cors: { 
    origin: 'http://localhost:5173', // Your React app URL
    methods: ['GET', 'POST'] 
  }
});

// Map to track online users (UserId -> SocketId)
const onlineUsers = new Map();

app.set('io', io);
app.set('onlineUsers', onlineUsers);

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // Map the user ID to their active socket ID when they connect
  socket.on('addUser', (userId) => {
    onlineUsers.set(userId.toString(), socket.id);
    console.log(`User ${userId} mapped to socket ${socket.id}`);
  });

  // Handle disconnection and cleanup the map
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    for (let [key, value] of onlineUsers.entries()) {
      if (value === socket.id) {
        onlineUsers.delete(key);
      }
    }
  });
});

// --- START THE SERVER ---
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server & Sockets running on port ${PORT}`);
  // require('./cron/followUpReminder'); // Uncomment when your cron file is ready
});