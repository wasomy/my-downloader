const express = require("express");
const ytDlp = require("yt-dlp-exec");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/download", async (req, res) => {
  const videoUrl = req.query.url;

  if (!videoUrl) {
    return res.status(400).send("No URL provided");
  }

  try {
    const outputPath = path.join(__dirname, "video.mp4");

    // نحذف الملف القديم إذا موجود
    if (fs.existsSync(outputPath)) {
      fs.unlinkSync(outputPath);
    }

    await ytDlp(videoUrl, {
      output: outputPath,
      format: "mp4", // صيغة مباشرة بدون دمج
      noPlaylist: true,
    });

    res.download(outputPath, "video.mp4", () => {
      fs.unlinkSync(outputPath); // نحذف بعد الإرسال
    });

  } catch (error) {
    console.error("DOWNLOAD ERROR:", error);
    res.status(500).send("Video download failed. Check server logs.");
  }
});

app.get("/", (req, res) => {
  res.send("Server is running");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});