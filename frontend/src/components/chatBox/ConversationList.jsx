import React from "react";
import {
  List,
  ListItemButton,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Typography,
  Divider,
  Box,
} from "@mui/material";

const ConversationList = ({ conversations, selectedConv, onSelect }) => (
  <Box
    sx={{
      width: 1,
      height: 1,
      bgcolor: "#f8fafc",
      borderRadius: 2,
      p: 1,
      overflowY: "auto",
    }}
  >
    <List sx={{ width: 1, p: 0 }}>
      {conversations.length === 0 && (
        <Typography variant="body2" color="text.secondary" sx={{ p: 2 }}>
          No conversations yet.
        </Typography>
      )}
      {conversations.map((conv, idx) => {
        const isSelected = selectedConv?.id === conv.id;
        return (
          <React.Fragment key={conv.id}>
            <ListItemButton
              selected={isSelected}
              onClick={() => onSelect(conv)}
              sx={{
                borderRadius: 2,
                mb: 1,
                background: isSelected
                  ? "linear-gradient(to bottom, #211C84 0%, #B5A8D5 100%)"
                  : "#fff",
                color: isSelected ? "#fff" : "#1f2937",
                boxShadow: isSelected ? "0 2px 8px rgba(102,126,234,0.15)" : 0,
                border: isSelected ? "2px solid #667eea" : "2px solid transparent",
                "&:hover": {
                  background: isSelected
                    ? "linear-gradient(to bottom, #211C84 0%, #B5A8D5 100%)"
                    : "#e0e7ff",
                },
                transition: "background 0.2s, color 0.2s, border 0.2s",
              }}
            >
              <ListItemAvatar>
                <Avatar
                  src={conv.otherUserAvatar}
                  sx={{
                    bgcolor: isSelected
                      ? "rgba(255,255,255,0.2)"
                      : "#e0e7ff",
                    color: isSelected ? "#fff" : "#667eea",
                    fontWeight: 600,
                    border: isSelected ? "2px solid #fff" : "2px solid transparent",
                  }}
                >
                  {conv.otherUserName?.[0]?.toUpperCase() || "U"}
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Typography
                    fontWeight={600}
                    fontSize={16}
                    color={isSelected ? "#fff" : "#1f2937"}
                  >
                    {conv.otherUserName}
                  </Typography>
                }
                secondary={
                  <Typography
                    variant="caption"
                    color={isSelected ? "#e0e7ff" : "text.secondary"}
                    noWrap
                  >
                    {conv.last_message}
                  </Typography>
                }
              />
            </ListItemButton>
            {idx < conversations.length - 1 && (
              <Divider component="li" sx={{ borderColor: "#e5e7eb" }} />
            )}
          </React.Fragment>
        );
      })}
    </List>
  </Box>
);

export default ConversationList;