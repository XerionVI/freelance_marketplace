import React, { useRef, useEffect } from "react";
import {
  Box,
  Typography,
  Avatar,
  IconButton,
  TextField,
  InputAdornment,
  Paper,
  Button,
} from "@mui/material";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";
import MoreVertIcon from "@mui/icons-material/MoreVert";

const formatTime = (timestamp) =>
  new Date(timestamp).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

const ChatArea = ({
  messages,
  input,
  setInput,
  onSend,
  userId,
  otherUserId,
  loading,
  otherUserName = "Chat Room",
  otherUserAvatar = "C",
  participants = 2,
  disableInput = false,
}) => {
  const messagesEndRef = useRef(null);
  const isSelfChat = Number(userId) === Number(otherUserId);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey && !loading && !disableInput && !isSelfChat) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <Paper
      elevation={0}
      sx={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        borderRadius: 2,
        bgcolor: "#fff",
        p: 0,
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          background: "linear-gradient(to bottom, #211C84 0%, #B5A8D5 100%)",
          color: "#fff",
          p: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Box display="flex" alignItems="center" gap={2}>
          <Box position="relative">
            <Avatar
              sx={{
                bgcolor: "rgba(255,255,255,0.2)",
                color: "#fff",
                width: 40,
                height: 40,
                fontWeight: 600,
                fontSize: 18,
              }}
              src={otherUserAvatar}
            >
              {typeof otherUserAvatar === "string"
                ? otherUserAvatar[0]?.toUpperCase()
                : "C"}
            </Avatar>
            <Box
              sx={{
                position: "absolute",
                bottom: 2,
                right: 2,
                width: 12,
                height: 12,
                bgcolor: "#4ade80",
                borderRadius: "50%",
                border: "2px solid #fff",
              }}
            />
          </Box>
          <Box>
            <Typography variant="h6" fontWeight={600} sx={{ m: 0 }}>
              {otherUserName}
            </Typography>
            <Typography variant="caption" sx={{ opacity: 0.9 }}>
              {participants} participants • Online
            </Typography>
          </Box>
        </Box>
        <IconButton sx={{ color: "#fff" }}>
          <MoreVertIcon />
        </IconButton>
      </Box>

      {/* Messages */}
      <Box
        flex={1}
        p={2}
        sx={{
          overflowY: "auto",
          background: "#f8fafc",
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        {messages.length === 0 && (
          <Typography color="text.secondary" align="center" mt={4}>
            No messages yet.
          </Typography>
        )}
        {messages.map((msg, idx) => {
          const isCurrentUser = Number(msg.sender_id) === Number(userId);
          return (
            <Box
              key={msg.id || idx}
              display="flex"
              justifyContent={isCurrentUser ? "flex-end" : "flex-start"}
              sx={{ animation: "slideIn 0.3s ease-out forwards", opacity: 1 }}
            >
              <Box
                display="flex"
                alignItems="flex-end"
                gap={1}
                maxWidth="70%"
                flexDirection={isCurrentUser ? "row-reverse" : "row"}
              >
                <Avatar
                  sx={{
                    bgcolor: isCurrentUser
                      ? "linear-gradient(to bottom, #211C84 0%, #B5A8D5 100%)"
                      : "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
                    color: "#fff",
                    width: 32,
                    height: 32,
                    fontSize: 14,
                  }}
                  src={
                    isCurrentUser
                      ? undefined
                      : otherUserAvatar
                  }
                >
                  {isCurrentUser
                    ? "Y"
                    : typeof otherUserAvatar === "string"
                    ? otherUserAvatar[0]?.toUpperCase()
                    : "O"}
                </Avatar>
                <Box display="flex" flexDirection="column" gap={0.5}>
                  <Box
                    sx={{
                      bgcolor: isCurrentUser
                        ? "#e0e7ff"
                        : "#fff",
                      color: isCurrentUser ? "#000" : "#1f2937",
                      px: 2,
                      py: 1,
                      borderRadius: 2,
                      borderBottomRightRadius: isCurrentUser ? 4 : 16,
                      borderBottomLeftRadius: isCurrentUser ? 16 : 4,
                      boxShadow: !isCurrentUser
                        ? "0 1px 3px rgba(0,0,0,0.1)"
                        : "none",
                      fontSize: 14,
                      minWidth: 60,
                    }}
                  >
                    {!isCurrentUser && (
                      <Typography
                        variant="caption"
                        fontWeight={600}
                        color="#667eea"
                        sx={{ mb: 0.5, display: "block" }}
                      >
                        {otherUserName}
                      </Typography>
                    )}
                    <Typography variant="body2" sx={{ color: isCurrentUser ? "#000" : "#1f2937" }}>
                      {msg.content}
                    </Typography>
                  </Box>
                  <Box
                    display="flex"
                    alignItems="center"
                    gap={1}
                    fontSize={11}
                    color="#6b7280"
                    justifyContent={isCurrentUser ? "flex-end" : "flex-start"}
                  >
                    <span>{formatTime(msg.created_at || msg.timestamp)}</span>
                    {isCurrentUser && (
                      <span
                        style={{
                          padding: "2px 6px",
                          borderRadius: 8,
                          border: "1px solid #d1d5db",
                          background: "#fff",
                          fontSize: 10,
                          color: "#3b82f6",
                          marginLeft: 4,
                        }}
                      >
                        {msg.status || "sent"}
                      </span>
                    )}
                  </Box>
                </Box>
              </Box>
            </Box>
          );
        })}
        <div ref={messagesEndRef} />
      </Box>

      {/* Input */}
      <Box
        sx={{
          p: 2,
          background: "#fff",
          borderTop: "1px solid #e5e7eb",
          display: "flex",
          alignItems: "flex-end",
          gap: 1.5,
        }}
      >
        <Box
          sx={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            background: "#f1f3f4",
            borderRadius: "24px",
            px: 2,
            py: 1,
            gap: 1,
          }}
        >
          <IconButton>
            <AttachFileIcon fontSize="small" />
          </IconButton>
          <TextField
            variant="standard"
            fullWidth
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            InputProps={{
              disableUnderline: true,
              style: { fontSize: 14, background: "transparent" },
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton>
                    <EmojiEmotionsIcon fontSize="small" />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            onKeyDown={handleKeyPress}
            multiline
            minRows={1}
            maxRows={4}
            disabled={loading || disableInput || isSelfChat}
            sx={{
              flex: 1,
              background: "transparent",
              "& .MuiInputBase-input": { padding: 0 },
            }}
          />
        </Box>
        <Button
          variant="contained"
          sx={{
            minWidth: 48,
            minHeight: 48,
            borderRadius: "50%",
            background:
              input.trim().length > 0
                ? "linear-gradient(to bottom, #211C84 0%, #B5A8D5 100%)"
                : "#d1d5db",
            color: "#fff",
            fontSize: 20,
            boxShadow: "none",
            "&:hover": {
              background:
                input.trim().length > 0
                  ? "linear-gradient(to bottom, #211C84 0%, #B5A8D5 100%)"
                  : "#d1d5db",
              transform: input.trim().length > 0 ? "scale(1.05)" : "none",
            },
          }}
          onClick={onSend}
          disabled={loading || !input.trim() || disableInput || isSelfChat}
          title="Send message"
        >
          ➤
        </Button>
      </Box>
      {isSelfChat && (
        <Typography color="error" variant="caption" align="center" sx={{ mt: 1 }}>
          You cannot send messages to yourself.
        </Typography>
      )}
    </Paper>
  );
};

export default ChatArea;