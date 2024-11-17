const db = require("../config/db");

class File {
  static uploadFile(
    file_name,
    file_type,
    uploaded_by,
    encrypted_url,
    callback
  ) {
    const query = `
      INSERT INTO files (file_name, file_type, uploaded_by, encrypted_url)
      VALUES (?, ?, ?, ?)
    `;
    db.run(query, [file_name, file_type, uploaded_by, encrypted_url], (err) => {
      if (err) {
        console.error("Database insertion error:", err);
      }
      callback(err);
    });
  }

  static listFiles(callback) {
    db.all("SELECT * FROM files", callback);
  }

  static findFileById(id, callback) {
    db.get("SELECT * FROM files WHERE id = ?", [id], callback);
  }
}

module.exports = File;
