# 💬 Real-Time Chat Application

A modern, responsive real-time chat application built with **React.js** and **WebSockets (Socket.IO)**.

## ✨ Features

- ✅ Real-time messaging with WebSockets
- ✅ User authentication (username-based)
- ✅ Message history
- ✅ Online users counter
- ✅ System notifications (user join/leave)
- ✅ Typing indicators
- ✅ Responsive design (mobile-friendly)
- ✅ Modern, polished UI with animations
- ✅ Auto-scroll to latest messages
- ✅ Timestamps on all messages

## 📁 Files Included

1. **index.html** - Main HTML structure
2. **styles.css** - Complete styling with responsive design
3. **app.js** - React frontend with simulated WebSocket
4. **server.js** - Real Node.js WebSocket server (optional)
5. **package.json** - Node.js dependencies
6. **README.md** - This file

## 🚀 Quick Start (Frontend Only)

The app works out of the box with a simulated WebSocket for demo purposes:

1. Open `index.html` in your web browser
2. Enter a username
3. Start chatting!

The simulated version includes demo users who will respond to your messages randomly.

## 🔧 Setup with Real WebSocket Server (Production)

For a real multi-user chat experience, follow these steps:

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the server:
```bash
npm start
```

3. Open your browser and navigate to:
```
http://localhost:3000
```

4. Open multiple browser tabs/windows to test real-time communication

### Development Mode

Run with auto-reload:
```bash
npm run dev
```

## 📱 How to Use

### Login
1. Enter your username (2-20 characters)
2. Click "Join Chat"

### Chatting
1. Type your message in the input field
2. Press Enter or click the send button
3. Your message appears instantly
4. See other users' messages in real-time

### Features
- **Online Users**: View count in the header
- **Message History**: All messages are preserved
- **System Messages**: See when users join/leave
- **Logout**: Click the logout button to exit

## 🎨 Customization

### Changing Colors

Edit `styles.css` to change the color scheme:
- Primary gradient: `.667eea` and `.764ba2`
- Background: Modify `body` background gradient
- Message bubbles: Update `.message-bubble` styles

### Adding Features

The code is well-structured for easy extension:
- Add emoji picker in `app.js`
- Implement file sharing in message handling
- Add private messaging functionality
- Create chat rooms/channels

## 🌐 Deployment

### Frontend Only (GitHub Pages, Netlify, Vercel)

Simply deploy the HTML, CSS, and JS files. The simulated WebSocket will work.

### Full Stack (Heroku, Railway, AWS)

1. Ensure `server.js` is properly configured
2. Set the PORT environment variable
3. Deploy all files including `package.json`
4. Update CORS settings in `server.js` for your domain

## 📝 Technical Details

### Frontend Stack
- React 18 (via CDN)
- Babel Standalone (for JSX transformation)
- Vanilla CSS with modern features

### Backend Stack (Optional)
- Node.js
- Express.js
- Socket.IO

### WebSocket Events

**Client → Server:**
- `join`: User joins with username
- `sendMessage`: Send new message
- `typing`: Typing indicator
- `disconnect`: User leaves

**Server → Client:**
- `messageHistory`: Initial message load
- `message`: New message broadcast
- `userJoined`: User joined notification
- `userLeft`: User left notification
- `usersUpdate`: Online users list update
- `userTyping`: Typing indicator

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Kill the process on port 3000
lsof -ti:3000 | xargs kill
```

### WebSocket Connection Issues
- Check firewall settings
- Ensure server is running
- Verify CORS configuration
- Check browser console for errors

## 📄 License

MIT License - feel free to use for any purpose!

## 🤝 Contributing

Feel free to submit issues and enhancement requests!

## 📧 Support

For questions or issues, please open an issue in the repository.

---

**Enjoy your new chat application! 💬✨**
