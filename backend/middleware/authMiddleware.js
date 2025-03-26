const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  const authHeader = req.header("Authorization");

  if (!authHeader) {
    console.error("No Authorization header provided");
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  if (!authHeader.startsWith("Bearer ")) {
    console.error("Invalid token format");
    return res.status(401).json({ msg: "Invalid token format" });
  }

  const token = authHeader.split(" ")[1]; // Extract the token after "Bearer"

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded token:", decoded); // Debugging log
    req.user = decoded.user; // Attach the user to the request object
    next();
  } catch (err) {
    console.error("Token verification failed:", err.message); // Debugging log
    res.status(401).json({ msg: "Token is not valid" });
  }
};