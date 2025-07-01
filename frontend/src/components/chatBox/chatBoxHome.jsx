import React, { useState, useEffect, useRef } from "react";
import { Box, Paper, Typography } from "@mui/material";
import axios from "axios";
import { io } from "socket.io-client";
import config from "../../config";
import ConversationList from "./ConversationList";
import ChatArea from "./ChatArea";

const ChatBoxHome = ({
  token,
  account,
  userId,
  otherUserId,
  initialConversationId,
}) => {
  const [conversations, setConversations] = useState([]);
  const [selectedConv, setSelectedConv] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const socketRef = useRef(null);

  // Connect to Socket.IO
  useEffect(() => {
    if (!userId) return;
    socketRef.current = io(config.SOCKET_URL, { transports: ["websocket"] });
    socketRef.current.emit("join", userId);

    socketRef.current.on("receive_message", (msg) => {
      if (selectedConv && msg.conversationId === selectedConv.id) {
        setMessages((prev) => [...prev, msg]);
      }
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [userId, selectedConv]);

  // Fetch conversations
  useEffect(() => {
    if (!token) return;
    const fetchConversations = async () => {
      try {
        const response = await axios.get(
          `${config.API_BASE_URL}/api/conversations`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setConversations(response.data);
      } catch (error) {
        // handle error
      }
    };
    fetchConversations();
  }, [token]);

  // Auto-select conversation when initialConversationId changes
  useEffect(() => {
    if (initialConversationId && conversations.length) {
      const found = conversations.find((c) => c.id === initialConversationId);
      if (found) setSelectedConv(found);
    }
  }, [initialConversationId, conversations]);

  // Fetch messages when a conversation is selected
  useEffect(() => {
    if (selectedConv && token) {
      axios
        .get(
          `${config.API_BASE_URL}/api/conversations/${selectedConv.id}/messages`,
          { headers: { Authorization: `Bearer ${token}` } }
        )
        .then((res) => setMessages(res.data));
    }
  }, [selectedConv, token]);

  // Send message
  const sendMessage = async () => {
    if (!input.trim() || !selectedConv) return;
    setLoading(true);
    try {
      const res = await axios.post(
        `${config.API_BASE_URL}/api/conversations/${selectedConv.id}/messages`,
        { content: input },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessages((prev) => [...prev, res.data]);
      setInput("");
      // Emit via socket for real-time update
      if (socketRef.current) {
        socketRef.current.emit("send_message", {
          conversationId: selectedConv.id,
          senderId: userId,
          receiverId: selectedConv.otherUserId,
          content: input,
          created_at: res.data.created_at,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      display="flex"
      height={500}
      bgcolor="transparent"
      borderRadius={2}
      boxShadow={0}
    >
      {/* Conversation List */}
      <Paper
        sx={{
          width: 280,
          borderRadius: 2,
          mr: 2,
          overflow: "hidden",
          bgcolor: "rgba(255,255,255,0.8)",
          boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
          backdropFilter: "blur(4px)",
        }}
        elevation={0}
      >
        <ConversationList
          conversations={conversations}
          selectedConv={selectedConv}
          onSelect={setSelectedConv}
        />
      </Paper>
      {/* Chat Area */}
      <Box
        flex={1}
        display="flex"
        flexDirection="column"
        sx={{
          bgcolor: "rgba(255,255,255,0.8)",
          borderRadius: 2,
          boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
          backdropFilter: "blur(4px)",
        }}
      >
        <ChatArea
          messages={messages}
          input={input}
          setInput={setInput}
          onSend={sendMessage}
          userId={userId}
          // Use the other participant's id from the selected conversation
          otherUserId={
            selectedConv
              ? Number(selectedConv.user1_id) === Number(userId)
                ? selectedConv.user2_id
                : selectedConv.user1_id
              : otherUserId // fallback for initial open
          }
          loading={loading}
          otherUserName={selectedConv?.otherUserName}
          otherUserAvatar={selectedConv?.otherUserAvatar}
        />
      </Box>
    </Box>
  );
};

export default ChatBoxHome;
