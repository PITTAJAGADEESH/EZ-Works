const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const crypto = require("crypto");
const jwtSecret = require("../config/jwtSecret");
const sendVerificationEmail = require("../utils/mailer");
const db = require("../config/db");

exports.signUp = async (req, res) => {
  const { email, password, username, role } = req.body;

  console.log("Received sign-up request: ", req.body);

  if (!email || !password || !username || !role) {
    console.error("Missing required fields.");
    return res.status(400).json({ error: "All fields are required." });
  }

  if (role !== "Ops User" && role !== "Client User") {
    console.error("Invalid role specified.");
    return res.status(400).json({ error: "Invalid role specified." });
  }

  try {
    db.get("SELECT * FROM users WHERE email = ?", [email], async (err, row) => {
      if (err) {
        console.error("Error checking email:", err);
        return res.status(500).json({ error: "Error checking email." });
      }

      if (row) {
        return res.status(400).json({ error: "Email is already in use." });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const verificationCode = crypto.randomBytes(16).toString("hex");

      const query = `
        INSERT INTO users (username, email, password, role, email_verified, verification_code)
        VALUES (?, ?, ?, ?, 0, ?)
      `;
      db.run(
        query,
        [username, email, hashedPassword, role, verificationCode],
        async function (err) {
          if (err) {
            console.error("Sign up error:", err);
            return res.status(500).json({ error: "Sign up failed" });
          }

          const verificationLink = `http://localhost:${process.env.PORT}/auth/verify-email/${verificationCode}`;

          try {
            await sendVerificationEmail(email, verificationLink);
            res.status(201).json({
              message:
                "User registered successfully. Check your email for verification.",
            });
          } catch (mailError) {
            console.error("Email sending error:", mailError);
            return res
              .status(500)
              .json({ error: "Sign up succeeded, but email sending failed" });
          }
        }
      );
    });
  } catch (error) {
    console.error("Sign up error:", error);
    res.status(500).json({ error: "Sign up failed" });
  }
};

exports.login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required." });
  }

  User.findUserByEmail(email, (err, user) => {
    if (err || !user) {
      return res.status(400).json({ error: "Invalid email or password." });
    }

    if (!bcrypt.compareSync(password, user.password)) {
      return res.status(400).json({ error: "Invalid email or password." });
    }

    const payload = { userId: user.id, role: user.role };
    const token = jwt.sign(payload, jwtSecret.secret, { expiresIn: "1h" });

    res.json({ token });
  });
};

exports.verifyEmail = async (req, res) => {
  const { verification_code } = req.params;

  try {
    const query = `UPDATE users SET email_verified = 1 WHERE verification_code = ?`;
    db.run(query, [verification_code], function (err) {
      if (err) {
        console.error("Email verification error:", err);
        return res.status(500).json({ error: "Email verification failed" });
      }

      if (this.changes === 0) {
        return res
          .status(400)
          .json({ error: "Invalid or expired verification code" });
      }

      res.status(200).json({ message: "Email verified successfully" });
    });
  } catch (error) {
    console.error("Email verification error:", error);
    res.status(500).json({ error: "Email verification failed" });
  }
};
