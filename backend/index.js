const express = require('express');
const cors = require('cors');
const multer = require('multer');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// Setup CORS
app.use(cors());
app.use(express.json());

// Set up image upload using multer (buffer-based for easy cloud deployment)
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Initialize Google Generative AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post('/analyze', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image uploaded.' });
    }

    const { buffer, mimetype } = req.file;

    // Convert buffer to generative parts
    const imagePart = {
      inlineData: {
        data: buffer.toString('base64'),
        mimeType: mimetype,
      },
    };

    // Use Gemini 2.0 Flash Lite for analysis
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" }); 

    const prompt = `Analyze this food image and provide:
1. Name of the dish (be specific).
2. Estimated calories (number only).
3. A short nutritional summary.

IMPORTANT: Return ONLY a valid JSON object. Do not include markdown code blocks or any other text.
Example format: {"name": "Nasi Ayam Geprek", "calories": 650, "summary": "Tinggi protein dan karbohidrat, hati-hati dengan kandungan minyak."}`;

    const result = await model.generateContent([prompt, imagePart]);
    const response = await result.response;
    const text = response.text();

    console.log("Raw AI response:", text);

    try {
      // Robust JSON extraction: find the first { and last }
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      const cleanJson = jsonMatch ? jsonMatch[0] : text;
      const resultJson = JSON.parse(cleanJson);
      res.json(resultJson);
    } catch (parseError) {
      console.error("JSON Parse Error. Raw text:", text);
      res.status(500).json({ 
        error: 'Gagal memproses data dari AI.', 
        details: 'Format respons tidak valid.',
        raw: text.substring(0, 100) 
      });
    }
  } catch (error) {
    console.error('Error analyzing image:', error);
    res.status(500).json({ 
      error: 'Failed to analyze image.', 
      details: error.message 
    });
  }
});

app.listen(port, () => {
  console.log(`Backend server running on http://localhost:${port}`);
});

module.exports = app;
