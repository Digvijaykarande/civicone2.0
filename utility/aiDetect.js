import axios from "axios";
import fs from "fs";

const HF_TOKEN = process.env.HF_TOKEN;

// ✅ NEW router endpoint (IMPORTANT)
const MODEL_URL =
  "https://router.huggingface.co/hf-inference/models/microsoft/resnet-50";

export const detectIssueFromImage = async (imagePath) => {
  try {
    const imageBuffer = fs.readFileSync(imagePath);

    const response = await axios.post(MODEL_URL, imageBuffer, {
      headers: {
        Authorization: `Bearer ${HF_TOKEN}`,
        "Content-Type": "application/octet-stream",
      },
      timeout: 30000,
    });

    if (!Array.isArray(response.data)) return null;

    const topLabel = response.data[0]?.label?.toLowerCase();
    if (!topLabel) return null;

    console.log("HF Raw Label:", topLabel);

    // Map generic → civic issues
    if (topLabel.includes("road") || topLabel.includes("asphalt"))
      return "road issue";

    if (topLabel.includes("trash") || topLabel.includes("garbage"))
      return "waste management";

    if (topLabel.includes("water") || topLabel.includes("pipe"))
      return "water leakage";

    if (topLabel.includes("lamp") || topLabel.includes("light"))
      return "streetlight issue";

    if (topLabel.includes("building") || topLabel.includes("wall"))
      return "public property damage";

    return topLabel; // fallback
  } catch (err) {
    console.error("HF AI error:", err.response?.data || err.message);
    return null;
  }
};
