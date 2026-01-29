const { useState, useEffect, useRef } = React;

// Simulated WebSocket class for demo purposes
// In production, this would connect to a real WebSocket server
class SimulatedWebSocket {
    constructor() {
        this.listeners = {
            message: [],
            userJoined: [],
            userLeft: [],
            typing: [],
            usersUpdate: []
        };
        this.users = new Map();
        this.messageHistory = [];
        this.currentUser = null;
    }

    connect(username) {
        this.currentUser = username;
        this.users.set(username, { username, online: true });
        
        // Simulate other users
        setTimeout(() => {
            this.addDemoUser('OM PATIL');
            this.addDemoUser('YASH TOTARE');
        }, 1000);

        this.emit('usersUpdate', Array.from(this.users.values()));
    }

    addDemoUser(username) {
        if (!this.users.has(username)) {
            this.users.set(username, { username, online: true });
            this.emit('userJoined', { username });
            this.emit('usersUpdate', Array.from(this.users.values()));
        }
    }

    sendMessage(message) {
        const newMessage = {
            id: Date.now(),
            username: this.currentUser,
            text: message,
            timestamp: new Date().toISOString(),
            isOwn: true
        };
        
        this.messageHistory.push(newMessage);
        this.emit('message', newMessage);

        // Simulate random responses from other users
        setTimeout(() => {
            const otherUsers = Array.from(this.users.keys()).filter(u => u !== this.currentUser);
            if (otherUsers.length > 0 && Math.random() > 0.3) {
                const randomUser = otherUsers[Math.floor(Math.random() * otherUsers.length)];
                this.simulateResponse(randomUser);
            }
        }, 2000 + Math.random() * 3000);
    }

    simulateResponse(username) {
        const responses = [
            "That's interesting! Tell me more.",
            "I totally agree with you!",
            "Great point! 👍",
            "Thanks for sharing that.",
            "I was thinking the same thing.",
            "Have you considered another perspective?",
            "That's a really good idea!",
            "Let's discuss this further.",
            "I appreciate your input!",
            "Interesting take on this topic."
        ];

        const response = {
            id: Date.now() + Math.random(),
            username: username,
            text: responses[Math.floor(Math.random() * responses.length)],
            timestamp: new Date().toISOString(),
            isOwn: false
        };

        this.messageHistory.push(response);
        this.emit('message', response);
    }

    disconnect() {
        if (this.currentUser) {
            this.users.delete(this.currentUser);
            this.emit('userLeft', { username: this.currentUser });
            this.emit('usersUpdate', Array.from(this.users.values()));
        }
    }

    on(event, callback) {
        if (this.listeners[event]) {
            this.listeners[event].push(callback);
        }
    }

    emit(event, data) {
        if (this.listeners[event]) {
            this.listeners[event].forEach(callback => callback(data));
        }
    }

    getMessageHistory() {
        return this.messageHistory;
    }
}

// Create a global WebSocket instance
const ws = new SimulatedWebSocket();

// Login Component
function LoginScreen({ onLogin }) {
    const [username, setUsername] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        const trimmedUsername = username.trim();
        
        if (trimmedUsername.length < 2) {
            setError('Username must be at least 2 characters');
            return;
        }
        
        if (trimmedUsername.length > 20) {
            setError('Username must be less than 20 characters');
            return;
        }

        onLogin(trimmedUsername);
    };

    return (
        <div className="login-container">
            <h1>💬 Chat App</h1>
            <p>Enter your name to start chatting</p>
            
            <div className="login-icon">
                <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="50" cy="50" r="45" fill="#667eea" opacity="0.1"/>
                    <circle cx="50" cy="35" r="15" fill="#667eea"/>
                    <path d="M 25 75 Q 25 55 50 55 Q 75 55 75 75" fill="#667eea"/>
                </svg>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="input-group">
                    <input
                        type="text"
                        placeholder="Enter your username"
                        value={username}
                        onChange={(e) => {
                            setUsername(e.target.value);
                            setError('');
                        }}
                        maxLength="20"
                    />
                </div>
                {error && <p style={{ color: '#f44336', marginBottom: '10px', fontSize: '0.9em' }}>{error}</p>}
                <button type="submit" className="btn-login">
                    Join Chat
                </button>
            </form>
        </div>
    );
}

// Message Component
function Message({ message, currentUser }) {
    const isOwn = message.username === currentUser;
    const time = new Date(message.timestamp).toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
    });

    return (
        <div className={`message ${isOwn ? 'own' : 'other'}`}>
            <div className="message-header">
                {!isOwn && <strong>{message.username}</strong>}
            </div>
            <div className="message-bubble">
                {message.text}
                <div className="message-time">{time}</div>
            </div>
        </div>
    );
}

// System Message Component
function SystemMessage({ text }) {
    return <div className="system-message">{text}</div>;
}

// Typing Indicator Component
function TypingIndicator({ username }) {
    return (
        <div className="typing-indicator">
            <span>{username} is typing</span>
            <div className="typing-dots">
                <div></div>
                <div></div>
                <div></div>
            </div>
        </div>
    );
}

// Chat Component
function ChatRoom({ username, onLogout }) {
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [typingUsers, setTypingUsers] = useState(new Set());
    const messagesEndRef = useRef(null);
    const typingTimeoutRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, typingUsers]);

    useEffect(() => {
        // Connect to WebSocket
        ws.connect(username);

        // Load message history
        const history = ws.getMessageHistory();
        setMessages(history);

        // Listen for new messages
        ws.on('message', (message) => {
            setMessages(prev => [...prev, message]);
        });

        // Listen for user joined
        ws.on('userJoined', (data) => {
            setMessages(prev => [...prev, {
                id: Date.now(),
                type: 'system',
                text: `${data.username} joined the chat`
            }]);
        });

        // Listen for user left
        ws.on('userLeft', (data) => {
            setMessages(prev => [...prev, {
                id: Date.now(),
                type: 'system',
                text: `${data.username} left the chat`
            }]);
        });

        // Listen for users update
        ws.on('usersUpdate', (users) => {
            setOnlineUsers(users);
        });

        return () => {
            ws.disconnect();
        };
    }, [username]);

    const handleSendMessage = (e) => {
        e.preventDefault();
        
        if (inputMessage.trim()) {
            ws.sendMessage(inputMessage.trim());
            setInputMessage('');
        }
    };

    const handleInputChange = (e) => {
        setInputMessage(e.target.value);
        
        // Clear previous timeout
        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }

        // Set new timeout
        typingTimeoutRef.current = setTimeout(() => {
            // Stop typing indicator
        }, 1000);
    };

    return (
        <div className="chat-container">
            <div className="chat-header">
                <h2>
                    <span className="online-indicator"></span>
                    Chat Room
                </h2>
                <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                    <div className="users-online">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="white">
                            <circle cx="8" cy="8" r="7" fill="currentColor" opacity="0.3"/>
                            <circle cx="8" cy="5" r="2.5" fill="currentColor"/>
                            <path d="M 4 12 Q 4 9 8 9 Q 12 9 12 12" fill="currentColor"/>
                        </svg>
                        {onlineUsers.length} Online
                    </div>
                    <button className="logout-btn" onClick={onLogout}>
                        Logout
                    </button>
                </div>
            </div>

            <div className="messages-area">
                {messages.length === 0 ? (
                    <div className="empty-state">
                        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="50" cy="50" r="40" stroke="#ccc" strokeWidth="2"/>
                            <path d="M 30 45 Q 30 35 40 35 Q 50 35 50 45" stroke="#ccc" strokeWidth="2" fill="none"/>
                            <path d="M 50 45 Q 50 35 60 35 Q 70 35 70 45" stroke="#ccc" strokeWidth="2" fill="none"/>
                            <path d="M 30 60 Q 50 70 70 60" stroke="#ccc" strokeWidth="2" fill="none"/>
                        </svg>
                        <h3>No messages yet</h3>
                        <p>Start the conversation by sending a message!</p>
                    </div>
                ) : (
                    <>
                        {messages.map((message) => (
                            message.type === 'system' ? (
                                <SystemMessage key={message.id} text={message.text} />
                            ) : (
                                <Message key={message.id} message={message} currentUser={username} />
                            )
                        ))}
                        {Array.from(typingUsers).map(user => (
                            <TypingIndicator key={user} username={user} />
                        ))}
                        <div ref={messagesEndRef} />
                    </>
                )}
            </div>

            <form className="message-input" onSubmit={handleSendMessage}>
                <input
                    type="text"
                    placeholder="Type your message..."
                    value={inputMessage}
                    onChange={handleInputChange}
                />
                <button type="submit" className="send-btn">
                    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
                    </svg>
                </button>
            </form>
        </div>
    );
}

// Main App Component
function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [username, setUsername] = useState('');

    const handleLogin = (user) => {
        setUsername(user);
        setIsLoggedIn(true);
    };

    const handleLogout = () => {
        setIsLoggedIn(false);
        setUsername('');
    };

    return (
        <>
            {!isLoggedIn ? (
                <LoginScreen onLogin={handleLogin} />
            ) : (
                <ChatRoom username={username} onLogout={handleLogout} />
            )}
        </>
    );
}

// Render the app
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
