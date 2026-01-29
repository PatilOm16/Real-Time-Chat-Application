// server.js - Real WebSocket Server Implementation
// To run this server: node server.js
// Make sure to install dependencies first: npm install express socket.io

const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

// Serve static files
app.use(express.static(path.join(__dirname)));

// Store connected users
const users = new Map();
const messageHistory = [];

// Socket.IO connection handling
io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);

    // Handle user join
    socket.on('join', (username) => {
        users.set(socket.id, { 
            id: socket.id, 
            username, 
            online: true 
        });

        // Send message history to the new user
        socket.emit('messageHistory', messageHistory);

        // Notify all users about the new user
        io.emit('userJoined', { username });
        
        // Send updated users list to all clients
        io.emit('usersUpdate', Array.from(users.values()));

        console.log(`${username} joined the chat`);
    });

    // Handle new message
    socket.on('sendMessage', (data) => {
        const user = users.get(socket.id);
        if (user) {
            const message = {
                id: Date.now(),
                username: user.username,
                text: data.text,
                timestamp: new Date().toISOString(),
                socketId: socket.id
            };

            // Store message in history
            messageHistory.push(message);
            
            // Keep only last 100 messages
            if (messageHistory.length > 100) {
                messageHistory.shift();
            }

            // Broadcast message to all clients
            io.emit('message', message);
            
            console.log(`Message from ${user.username}: ${data.text}`);
        }
    });

    // Handle typing indicator
    socket.on('typing', (data) => {
        const user = users.get(socket.id);
        if (user) {
            socket.broadcast.emit('userTyping', {
                username: user.username,
                isTyping: data.isTyping
            });
        }
    });

    // Handle disconnect
    socket.on('disconnect', () => {
        const user = users.get(socket.id);
        if (user) {
            users.delete(socket.id);
            
            // Notify all users
            io.emit('userLeft', { username: user.username });
            io.emit('usersUpdate', Array.from(users.values()));
            
            console.log(`${user.username} left the chat`);
        }
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
