const File = require("../models/File");
const crypto = require("crypto");
const path = require("path");
const fs = require("fs");

exports.uploadFile = (req, res) => {
  const { file } = req;

  if (!file) {
    console.error("No file uploaded");
    return res.status(400).json({ error: "No file uploaded" });
  }

  const allowedTypes = [
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ];

  if (!allowedTypes.includes(file.mimetype)) {
    console.error("Invalid file type:", file.mimetype);
    return res.status(400).json({ error: "Invalid file type" });
  }

  if (!req.user || !req.user.userId) {
    console.error("User ID is not set");
    return res.status(400).json({ error: "User ID is not set" });
  }

  const encryptedUrl =
    crypto.randomBytes(20).toString("hex") + path.extname(file.originalname);
  const filePath = path.join(__dirname, "../uploads", encryptedUrl);

  console.log(`Saving file to: ${filePath}`);

  fs.rename(file.path, filePath, (err) => {
    if (err) {
      console.error("Failed to save file:", err);
      return res.status(500).json({ error: "Failed to save file" });
    }

    console.log(`Saving file metadata for: ${file.originalname}`);

    File.uploadFile(
      file.originalname,
      file.mimetype,
      req.user.userId,
      encryptedUrl,
      (err) => {
        if (err) {
          console.error("Failed to save file metadata:", err);
          return res
            .status(500)
            .json({ error: "Failed to save file metadata" });
        }
        res
          .status(200)
          .json({ message: "File uploaded successfully", filePath });
      }
    );
  });
};

exports.listFiles = (req, res) => {
  File.listFiles((err, files) => {
    if (err) {
      console.error("Failed to fetch files:", err);
      return res.status(500).json({ error: "Failed to fetch files" });
    }
    res.status(200).json({ files });
  });
};

exports.downloadFile = (req, res) => {
  const { file_id } = req.params;

  File.findFileById(file_id, (err, file) => {
    if (err || !file) {
      console.error("File not found:", err);
      return res.status(404).json({ error: "File not found" });
    }

    if (req.user.role !== "Client User") {
      return res.status(403).json({ error: "Forbidden" });
    }

    const filePath = path.join(__dirname, "../uploads", file.encrypted_url);

    fs.access(filePath, fs.constants.F_OK, (err) => {
      if (err) {
        console.error("File not accessible:", err);
        return res.status(500).json({ error: "Failed to download file" });
      }

      // ** Force download headers **
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${encodeURIComponent(file.file_name)}"`
      );
      res.setHeader(
        "Content-Type",
        file.file_type || "application/octet-stream"
      );

      const fileStream = fs.createReadStream(filePath);
      fileStream.pipe(res);

      fileStream.on("error", (streamErr) => {
        console.error("Error while streaming file:", streamErr);
        res.status(500).json({ error: "Failed to download file" });
      });
    });
  });
};
