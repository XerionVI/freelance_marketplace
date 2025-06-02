import React, { useState, useEffect, useRef } from "react";
import { Box, List, ListItem, Avatar, Typography, TextField, Button, Paper } from "@mui/material";
import axios from "axios";
import { io } from "socket.io-client";

const SOCKET_URL = "http://localhost:5000"; // Change if your backend runs elsewhere

const ChatBoxHome = ({ token, account, userId }) => {
  const [conversations, setConversations] = useState([]);
  const [selectedConv, setSelectedConv] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);

  // Connect to Socket.IO
  useEffect(() => {
    if (!account) return;
    socketRef.current = io(SOCKET_URL, { transports: ["websocket"] });
    socketRef.current.emit("join", userId || account);

    socketRef.current.on("receive_message", (msg) => {
      if (selectedConv && msg.conversationId === selectedConv.id) {
        setMessages((prev) => [...prev, msg]);
      }
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [account, userId, selectedConv]);

  // Fetch conversations
  useEffect(() => {
    if (!token) return;
    axios
      .get("/api/conversations", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setConversations(res.data));
  }, [token]);

  // Fetch messages when a conversation is selected
  useEffect(() => {
    if (selectedConv && token) {
      axios
        .get(`/api/conversations/${selectedConv.id}/messages`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => setMessages(res.data));
    }
  }, [selectedConv, token]);

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Send message
  const sendMessage = async () => {
    if (!input.trim() || !selectedConv) return;
    const res = await axios.post(
      `/api/conversations/${selectedConv.id}/messages`,
      { content: input },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    const msg = {
      id: res.data.id,
      conversationId: selectedConv.id,
      sender_id: userId || account,
      content: input,
      created_at: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, msg]);
    setInput("");
    // Emit via socket for real-time update
    if (socketRef.current) {
      socketRef.current.emit("send_message", {
        conversationId: selectedConv.id,
        senderId: userId || account,
        receiverId: selectedConv.otherUserId,
        content: input,
        created_at: msg.created_at,
      });
    }
  };

  // Start a new conversation (if needed)
  const startConversation = async (otherUserId) => {
    const res = await axios.post(
      "/api/conversations/start",
      { otherUserId },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    // Find or add the conversation to the list
    const convId = res.data.id;
    const found = conversations.find((c) => c.id === convId);
    if (found) {
      setSelectedConv(found);
    } else {
      // Optionally, refetch conversations or add a placeholder
      setSelectedConv({ id: convId, otherUserId });
    }
  };

  return (
    <Box display="flex" height={500}>
      {/* Conversation List */}
      <Paper sx={{ width: 250, overflowY: "auto" }}>
        <List>
          {conversations.map((conv) => (
            <ListItem
              button
              key={conv.id}
              selected={selectedConv?.id === conv.id}
              onClick={() => setSelectedConv(conv)}
            >
              <Avatar src={conv.otherUserAvatar} />
              <Typography sx={{ ml: 2 }}>{conv.otherUserName}</Typography>
            </ListItem>
          ))}
        </List>
      </Paper>
      {/* Chat Area */}
      <Box flex={1} display="flex" flexDirection="column">
        <Box flex={1} p={2} overflow="auto">
          {messages.map((msg) => (
            <Box key={msg.id} textAlign={msg.sender_id === (userId || account) ? "right" : "left"}>
              <Typography variant="body2">{msg.content}</Typography>
              <Typography variant="caption" color="text.secondary">
                {msg.created_at}
              </Typography>
            </Box>
          ))}
          <div ref={messagesEndRef} />
        </Box>
        <Box p={2} display="flex" gap={1}>
          <TextField
            fullWidth
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            size="small"
            onKeyDown={(e) => {
              if (e.key === "Enter") sendMessage();
            }}
          />
          <Button variant="contained" onClick={sendMessage}>
            Send
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default ChatBoxHome;