const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database(process.env.DB_FILE, (err) => {
  if (err) {
    console.error("Error connecting to SQLite database:", err);
    process.exit(1);
  }
  console.log("Connected to SQLite database.");

  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      role TEXT NOT NULL CHECK(role IN ('Ops User', 'Client User')),
      email_verified INTEGER DEFAULT 0,
      verification_code TEXT NOT NULL
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS files (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      file_name TEXT NOT NULL,
      file_type TEXT NOT NULL,
      uploaded_by INTEGER NOT NULL,
      encrypted_url TEXT NOT NULL,
      uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(uploaded_by) REFERENCES users(id)
    )
  `);
});

module.exports = db;
