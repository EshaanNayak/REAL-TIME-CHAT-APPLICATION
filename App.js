import { useEffect, useState } from "react";
import "./App.css";

// Connect to WebSocket server
const socket = new WebSocket("ws://localhost:8080");

function App() {
  // Store username
  const [username, setUsername] = useState("");

  // Store current message
  const [message, setMessage] = useState("");

  // Store all chat messages
  const [messages, setMessages] = useState([]);

  // Check if user has joined the chat
  const [joined, setJoined] = useState(false);

  // Listen for incoming messages from server
  useEffect(() => {
    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setMessages((prev) => [...prev, data]);
    };
  }, []);

  // Join chat with username
  const joinChat = () => {
    if (username.trim() !== "") {
      setJoined(true);
    }
  };

  // Send message to server
  const sendMessage = () => {
    if (message.trim() !== "") {
      socket.send(
        JSON.stringify({
          user: username,
          text: message,
        })
      );
      setMessage(""); // clear input after sending
    }
  };

  // Join screen
  if (!joined) {
    return (
      <div className="join">
        <h2>Join Chat</h2>
        <input
          placeholder="Enter your name"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <button onClick={joinChat}>Join</button>
      </div>
    );
  }

  // Main chat UI
  return (
    <div className="chat">
      <h2>Real-Time Chat</h2>

      <div className="messages">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={msg.user === username ? "message own" : "message"}
          >
            <strong>{msg.user}:</strong> {msg.text}
          </div>
        ))}
      </div>

      <div className="input">
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type message..."
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}

export default App;
