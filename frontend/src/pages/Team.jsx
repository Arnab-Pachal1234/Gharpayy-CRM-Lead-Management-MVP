import { useEffect, useState, useRef } from 'react';
import api from '../services/api';
import { io } from 'socket.io-client';

const Team = () => {
  const [agents, setAgents] = useState([]);
  const [activeChat, setActiveChat] = useState(null); // The agent we are currently chatting with
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  
  const userInfo = JSON.parse(localStorage.getItem('userInfo')) || {};
  const socket = useRef();
  const chatEndRef = useRef(null);

  useEffect(() => {
    // Fetch Agents List
    const fetchAgents = async () => {
      const { data } = await api.get('/agents');
      setAgents(data.agents);
    };
    if (userInfo.role === 'admin') fetchAgents();

    // Initialize Socket Connection
    socket.current = io('http://localhost:5000');
    socket.current.emit('addUser', userInfo._id);

    // Listen for incoming messages from the server
    socket.current.on('receiveMessage', (message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => socket.current.disconnect(); // Cleanup on unmount
  }, [userInfo._id, userInfo.role]);

  // Scroll to bottom of chat when new message arrives
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Open Chat Window & Fetch History
  const openChat = async (agent) => {
    setActiveChat(agent);
    const { data } = await api.get(`/messages/${agent._id}`);
    setMessages(data.messages); // Assuming the API returns { messages: [...] }
  };

  // Send a Message
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const msgData = {
      senderId: userInfo._id,
      receiverId: activeChat._id,
      text: newMessage
    };

    // Emit to socket
    socket.current.emit('sendMessage', msgData);
    
    // Add to local UI instantly
    setMessages(prev => [...prev, { ...msgData, createdAt: new Date() }]);
    setNewMessage('');
  };

  return (
    <div className="relative h-full">
      <h1 className="text-3xl font-bold mb-6">Team Directory</h1>

      {/* Grid of Agents */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {agents.map(agent => (
          <div key={agent._id} className="group relative bg-white p-6 rounded-lg shadow border hover:shadow-lg transition-all">
            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
              {agent.name.charAt(0)}
            </div>
            <h3 className="text-center font-bold text-gray-800 text-lg">{agent.name}</h3>
            <p className="text-center text-gray-500 text-sm mb-4">{agent.email}</p>
            
            {/* Hover Details overlay */}
            <div className="absolute inset-0 bg-blue-900 bg-opacity-90 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white p-4">
              <p className="mb-2 font-semibold">Active Leads: {agent.currentLoad || 0}</p>
              <button 
                onClick={() => openChat(agent)}
                className="bg-white text-blue-900 px-4 py-2 rounded font-bold hover:bg-gray-100"
              >
                Message {agent.name.split(' ')[0]}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Floating Chat Box (Only shows if activeChat is set) */}
      {activeChat && (
        <div className="absolute bottom-0 right-8 w-80 bg-white rounded-t-lg shadow-2xl border border-gray-300 flex flex-col h-96">
          {/* Chat Header */}
          <div className="bg-blue-600 text-white p-3 rounded-t-lg flex justify-between items-center">
            <span className="font-bold">Chat with {activeChat.name}</span>
            <button onClick={() => setActiveChat(null)} className="text-white hover:text-gray-200">✖</button>
          </div>
          
          {/* Chat Messages */}
          <div className="flex-1 p-3 overflow-y-auto bg-gray-50 flex flex-col gap-2">
            {messages.map((msg, i) => (
              <div key={i} className={`max-w-[80%] p-2 rounded ${msg.senderId === userInfo._id || msg.sender === userInfo._id ? 'bg-blue-500 text-white self-end rounded-br-none' : 'bg-gray-200 text-gray-800 self-start rounded-bl-none'}`}>
                <p className="text-sm">{msg.text}</p>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          {/* Message Input */}
          <form onSubmit={handleSendMessage} className="p-2 border-t flex gap-2">
            <input 
              type="text" 
              className="flex-1 border rounded px-2 py-1 outline-none focus:border-blue-500"
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
            />
            <button type="submit" className="bg-blue-600 text-white px-3 py-1 rounded">Send</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Team;