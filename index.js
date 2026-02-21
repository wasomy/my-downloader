const express = require("express");
const ytDlp = require("yt-dlp-exec");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3000;

// الصفحة الرئيسية
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public.html"));
});

// تحميل الفيديو
app.get("/download", async (req, res) => {
  const videoUrl = req.query.url;

  if (!videoUrl) {
    return res.status(400).send("No URL provided");
  }

  try {
    const outputPath = path.join(__dirname, "video.mp4");

    if (fs.existsSync(outputPath)) {
      fs.unlinkSync(outputPath);
    }

    await ytDlp(videoUrl, {
      output: outputPath,
      format: "mp4",
      noPlaylist: true,
    });

    res.download(outputPath, "video.mp4", () => {
      if (fs.existsSync(outputPath)) {
        fs.unlinkSync(outputPath);
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).send("Error downloading video");
  }
});

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});