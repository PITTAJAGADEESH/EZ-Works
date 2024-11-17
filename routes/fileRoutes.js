const express = require("express");
const {
  uploadFile,
  listFiles,
  downloadFile,
} = require("../controllers/fileController");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

const router = express.Router();

router.post("/upload", upload.single("file"), uploadFile);
router.get("/list-files", listFiles);
router.get("/download-file/:file_id", downloadFile);

module.exports = router;
