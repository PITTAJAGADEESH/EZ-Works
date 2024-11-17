const bcrypt = require("bcryptjs");
const db = require("../config/db");

class User {
  static createUser(username, email, password, role, callback) {
    const hashedPassword = bcrypt.hashSync(password, 10);
    db.run(
      "INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)",
      [username, email, hashedPassword, role],
      callback
    );
  }

  static findUserByEmail(email, callback) {
    db.get("SELECT * FROM users WHERE email = ?", [email], callback);
  }

  static findUserById(id, callback) {
    db.get("SELECT * FROM users WHERE id = ?", [id], callback);
  }

  static verifyEmail(email, callback) {
    db.run(
      "UPDATE users SET email_verified = 1 WHERE email = ?",
      [email],
      callback
    );
  }
}

module.exports = User;
