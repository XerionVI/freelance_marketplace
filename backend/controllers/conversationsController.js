const mysql = require("mysql");
const db = require("../db");

// List all conversations for the logged-in user
exports.getConversations = (req, res) => {
  const userId = req.user.id;
  db.query(
    `SELECT c.*, 
      u1.display_name AS user1_name, u1.profile_picture_url AS user1_avatar,
      u2.display_name AS user2_name, u2.profile_picture_url AS user2_avatar
     FROM conversations c
     JOIN users u1 ON c.user1_id = u1.id
     JOIN users u2 ON c.user2_id = u2.id
     WHERE c.user1_id = ? OR c.user2_id = ?
     ORDER BY c.updated_at DESC`,
    [userId, userId],
    (err, rows) => {
      if (err) return res.status(500).json({ msg: "Server error" });
      // For each conversation, show the "other" user
      const result = rows.map(row => {
        const isUser1 = row.user1_id === userId;
        return {
          id: row.id,
          otherUserId: isUser1 ? row.user2_id : row.user1_id,
          otherUserName: isUser1 ? row.user2_name : row.user1_name,
          otherUserAvatar: isUser1 ? row.user2_avatar : row.user1_avatar,
          last_message: row.last_message,
          updated_at: row.updated_at,
        };
      });
      res.json(result);
    }
  );
};

// Get messages for a conversation
exports.getMessages = (req, res) => {
  const userId = req.user.id;
  const conversationId = req.params.id;
  db.query(
    `SELECT * FROM conversations WHERE id = ? AND (user1_id = ? OR user2_id = ?)`,
    [conversationId, userId, userId],
    (err, rows) => {
      if (err || rows.length === 0) return res.status(403).json({ msg: "Forbidden" });
      db.query(
        `SELECT * FROM messages WHERE conversation_id = ? ORDER BY created_at ASC`,
        [conversationId],
        (err2, messages) => {
          if (err2) return res.status(500).json({ msg: "Server error" });
          res.json(messages);
        }
      );
    }
  );
};

// Send a message
exports.sendMessage = (req, res) => {
  const userId = req.user.id;
  const conversationId = req.params.id;
  const { content } = req.body;
  if (!content) return res.status(400).json({ msg: "Message required" });

  db.query(
    `SELECT * FROM conversations WHERE id = ? AND (user1_id = ? OR user2_id = ?)`,
    [conversationId, userId, userId],
    (err, rows) => {
      if (err || rows.length === 0) return res.status(403).json({ msg: "Forbidden" });
      db.query(
        `INSERT INTO messages (conversation_id, sender_id, content) VALUES (?, ?, ?)`,
        [conversationId, userId, content],
        (err2, result) => {
          if (err2) return res.status(500).json({ msg: "Server error" });
          db.query(
            `UPDATE conversations SET last_message = ?, updated_at = NOW() WHERE id = ?`,
            [content, conversationId]
          );
          // For Socket.IO: emit new message event here if needed
          res.json({ msg: "Message sent", id: result.insertId });
        }
      );
    }
  );
};

// Start a new conversation (or get existing)
exports.startConversation = (req, res) => {
  const userId = req.user.id;
  const { otherUserId } = req.body;
  if (!otherUserId) return res.status(400).json({ msg: "Other user required" });

  // Ensure unique pair
  db.query(
    `SELECT * FROM conversations WHERE (user1_id = ? AND user2_id = ?) OR (user1_id = ? AND user2_id = ?)`,
    [userId, otherUserId, otherUserId, userId],
    (err, rows) => {
      if (err) return res.status(500).json({ msg: "Server error" });
      if (rows.length > 0) return res.json({ id: rows[0].id });
      db.query(
        `INSERT INTO conversations (user1_id, user2_id) VALUES (?, ?)`,
        [userId, otherUserId],
        (err2, result) => {
          if (err2) return res.status(500).json({ msg: "Server error" });
          res.json({ id: result.insertId });
        }
      );
    }
  );
};