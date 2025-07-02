const express = require("express");
const userController = require("../controllers/userController");
const auth = require("../middleware/authMiddleware");

const router = express.Router();
//profile routes
router.get("/profile", auth, userController.getProfile);
router.put("/profile", auth, userController.updateProfile);

//public profile route
router.get("/:id/profile", userController.getPublicProfile);

//freelancers routes
router.get("/freelancers", userController.getFreelancers);


//browser routes
router.get("/browse", userController.browseFreelancers);

// Avatar upload route
router.post(
  "/avatar",
  auth,
  userController.avatarUploadMiddleware,
  userController.uploadAvatar
);

module.exports = router;