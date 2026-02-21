const express = require("express");
const ytdlp = require("yt-dlp-exec");
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
    // جلب معلومات الفيديو أولاً
    const info = await ytdlp(videoUrl, {
      dumpSingleJson: true,
      noPlaylist: true,
    });

    const safeTitle = info.title.replace(/[<>:"/\\|?*]+/g, "");
    const outputPath = path.join(__dirname, `${safeTitle}.mp4`);

    // تحميل بأفضل جودة MP4 ودمج الصوت
    await ytdlp(videoUrl, {
      output: outputPath,
      format: "bv*[ext=mp4]+ba[ext=m4a]/b[ext=mp4]",
      noPlaylist: true,
      mergeOutputFormat: "mp4",
    });

    if (!fs.existsSync(outputPath)) {
      return res.status(500).send("Download failed");
    }

    res.download(outputPath, () => {
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
  console.log(`Server running on http://localhost:${PORT}`);
});