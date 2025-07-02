require("dotenv").config();

const express = require("express");
const path = require("path");
const cors = require("cors");


const app = express();

const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
    origin: ["https://freelancemarketplacefrontend-production.up.railway.app", "http://localhost:5173"] , // your frontend URL
    methods: ["GET", "POST"],
    credentials: true,
  }
});


// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "../frontend/dist")));


io.on("connection", (socket) => {
  // Join user to their own room for private messages
  socket.on("join", (userId) => {
    socket.join(`user_${userId}`);
  });

  // Listen for sending messages
  socket.on("send_message", (data) => {
    // data: { conversationId, senderId, receiverId, content }
    // Save to DB here if you want, or rely on REST API
    io.to(`user_${data.receiverId}`).emit("receive_message", data);
  });
});

// Import authentication routes
const authRoutes = require("./routes/auth");
app.use("/api/auth", authRoutes);

// Import job routes
const jobRoutes = require("./routes/jobs");
app.use("/api/jobs", jobRoutes);

// Import file routes
const fileRoutes = require("./routes/file");
app.use("/api/files", fileRoutes);

const noteRoutes = require("./routes/note");
app.use("/api/notes", noteRoutes);

// Import vote routes
const voteRoutes = require("./routes/vote");
app.use("/api/votes", voteRoutes);

// Import dispute routes
const disputeRoutes = require("./routes/disputes");
app.use("/api/disputes", disputeRoutes);

// Import user profile routes
const userRoutes = require("./routes/users");
app.use("/api/users", userRoutes);

// Import skills routes
const skillsRoutes = require("./routes/skills");
app.use("/api/skills", skillsRoutes);

// Import conversations routes
const conversationsRoutes = require("./routes/conversations");
app.use("/api/conversations", conversationsRoutes);

// Import and use evidence routes
const evidenceRoutes = require("./routes/evidence");
app.use("/api/evidence", evidenceRoutes);

// Import and use arguments routes
const argumentsRoutes = require("./routes/arguments");
app.use("/api/arguments", argumentsRoutes);

// Import and use listings routes
const listingsRoutes = require("./routes/listings");  
app.use("/api/listings", listingsRoutes);

// Import and use applications routes
const applicationsRoutes = require("./routes/applications");  
app.use("/api/applications", applicationsRoutes);

// Import and use categories routes
const categoriesRoutes = require("./routes/categories");
app.use("/api/categories", categoriesRoutes);

// Import and use reviews routes
const reviewsRoutes = require("./routes/reviews");
app.use("/api/reviews", reviewsRoutes);

// Serve uploads/works as static files
app.use("/uploads/works", express.static(path.join(__dirname, "uploads/works")));

// Serve uploads/avatars as static files
app.use("/uploads/avatars", express.static(path.join(__dirname, "uploads/avatars")));

// Serve React frontend for other routes (this must come last)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
});

// Start the server
const PORT = process.env.PORT || 5000;

// With this:
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});