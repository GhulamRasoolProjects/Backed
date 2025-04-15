// server.js
const express = require("express");
const multer = require("multer");
const axios = require("axios");
const FormData = require("form-data");
const cors = require("cors");
const fs = require("fs");

const app = express();
const port = 3000;
app.use(cors());

const upload = multer({ dest: "uploads/" });

app.post("/api/swap", upload.single("user_face"), async (req, res) => {
  const userFace = req.file;
  const productImageUrl = req.body.product_image_url;

  if (!userFace || !productImageUrl) {
    return res.status(400).json({ error: "Missing required data" });
  }

  try {
    const form = new FormData();
    form.append("face_image", fs.createReadStream(userFace.path));
    form.append("target_image_url", productImageUrl);

    const response = await axios.post("https://external-face-swap-api.com/swap", form, {
      headers: {
        ...form.getHeaders(),
        "Authorization": `Bearer YOUR_API_KEY_HERE`
      }
    });

    fs.unlinkSync(userFace.path);

    res.json({ result_image_url: response.data.result_image_url });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Face swap failed" });
  }
});

app.listen(port, () => {
  console.log(`Face Swap API running on http://localhost:${port}`);
});
