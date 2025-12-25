import app from "./app.js";
import cloudinary from "cloudinary";
import https from "https";

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Render Keep-Alive Logic
const keepAlive = () => {
  const url = process.env.BACKEND_URL; // e.g., https://your-backend.onrender.com
  if (!url) {
    console.log("[Keep-Alive] BACKEND_URL not set. Skipping self-ping.");
    return;
  }

  setInterval(() => {
    https.get(`${url}/api/v1/health`, (res) => {
      console.log(`[Keep-Alive] Self-ping status: ${res.statusCode}`);
    }).on('error', (err) => {
      console.error(`[Keep-Alive] Ping failed: ${err.message}`);
    });
  }, 14 * 60 * 1000); // 14 minutes
};

app.listen(process.env.PORT, () => {
  console.log(`Server listening at port ${process.env.PORT}`);
  if (process.env.NODE_ENV === "production") {
    keepAlive();
  }
});
