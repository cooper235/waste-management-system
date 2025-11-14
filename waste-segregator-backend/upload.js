// uploadTest.js
const fs = require("fs");
const axios = require("axios");
const FormData = require("form-data");
const path = require("path");
const https = require("https");

const binId = "68fb3d421f76f498d6cb39af"; // Replace with your bin _id
const testImageUrl = "https://res.cloudinary.com/demo/image/upload/sample.jpg";
const tempFile = path.join(__dirname, "test-image.jpg");

// 1️⃣ Download test image
const downloadImage = (url, dest) => {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, (res) => {
      res.pipe(file);
      file.on("finish", () => {
        file.close(resolve);
      });
    }).on("error", (err) => {
      fs.unlink(dest, () => reject(err));
    });
  });
};

// 2️⃣ Upload to your API
const uploadImage = async () => {
  try {
    await downloadImage(testImageUrl, tempFile);
    console.log("Image downloaded to", tempFile);

    const form = new FormData();
    form.append("image", fs.createReadStream(tempFile));
    form.append("caption", "Test upload");

    const response = await axios.post(
      `http://localhost:5000/api/bins/${binId}/upload`,
      form,
      { headers: form.getHeaders() }
    );

    console.log("Upload successful:");
    console.log(response.data);

    // Optional: delete temp file
    fs.unlinkSync(tempFile);
  } catch (err) {
    console.error("Error uploading image:", err.response?.data || err.message);
  }
};

uploadImage();
