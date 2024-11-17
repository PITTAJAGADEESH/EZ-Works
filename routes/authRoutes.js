const express = require("express");
const { signUp, login, verifyEmail } = require("../controllers/authController");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

router.post("/signup", signUp);
router.post("/login", login);
router.get("/verify-email/:verification_code", verifyEmail);
router.get("/protected", authMiddleware, (req, res) => {
  res.status(200).json({ message: "You have accessed a protected route" });
});

module.exports = router;
