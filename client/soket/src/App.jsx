import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

// Connect to backend server
const socket = io("chatapp-production-a600.up.railway.app");

const App = () => {
  const [message, setMessage] = useState("");
  const [roomID, setRoomID] = useState("");
  const [selfID, setSelfID] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    // When connected, store the socket ID
    socket.on("connect", () => {
      console.log("✅ Connected:", socket.id);
      setSelfID(socket.id);
    });

    // Receive messages
    socket.on("receive-message", (data) => {
      console.log("📥 Message received:", data);
      setMessages(prev => [...prev, data]); // append new message
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() && roomID.trim()) {
      const msgData = {
        message,
        RoomID: roomID,
        sender: selfID,
      };
      socket.emit("message", msgData);
      setMessages(prev => [...prev, msgData]); // append self message
      setMessage("");
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h2>🧑‍💻 Your ID: {selfID}</h2>

      {/* Room ID + Message Form */}
      <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
        <input
          type="text"
          value={roomID}
          placeholder="Enter Room ID"
          onChange={(e) => setRoomID(e.target.value)}
          style={{ padding: "10px", width: "200px", marginRight: "10px" }}
        />
        <input
          type="text"
          value={message}
          placeholder="Enter message"
          onChange={(e) => setMessage(e.target.value)}
          style={{ padding: "10px", width: "250px", marginRight: "10px" }}
        />
        <button type="submit" style={{ padding: "10px 20px" }}>Send</button>
      </form>

      {/* Chat messages */}
      <div style={{ maxHeight: "300px", overflowY: "auto", border: "1px solid #ccc", padding: "10px" }}>
        {messages.map((m, i) => (
          <p key={i}>
            <strong>{m.sender === selfID ? "You" : m.sender.slice(0, 5)}:</strong> {m.message}
          </p>
        ))}
      </div>
    </div>
  );
};

export default App;
