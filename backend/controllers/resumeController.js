const Groq = require('groq-sdk');
const pdfParse = require('pdf-parse');

const parseResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    let textContent = '';

    // Handle PDF parsing
    if (req.file.mimetype === 'application/pdf' || req.file.mimetype === 'application/x-pdf') {
      try {
        const data = await pdfParse(req.file.buffer);
        textContent = data.text;
      } catch (parseErr) {
        return res.status(500).json({ message: "PDF extraction failed: " + parseErr.message });
      }
    } else {
      return res.status(400).json({ message: "Only PDF files are currently supported for parsing" });
    }

    if (!process.env.GROQ_API_KEY) {
      return res.status(500).json({ message: "GROQ_API_KEY is not set in backend .env" });
    }

    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
    
    const prompt = `
      You are an expert AI resume parser.
      Extract the following information from the provided resume text and return it strictly as a JSON object. 
      Ensure the JSON structure matches this EXACT format:
      {
        "personalInfo": {
          "fullName": "",
          "email": "",
          "phone": "",
          "address": "",
          "linkedIn": "",
          "github": "",
          "portfolio": ""
        },
        "professionalSummary": "",
        "skills": ["skill1", "skill2"],
        "experience": [
          {
            "company": "",
            "role": "",
            "startDate": "",
            "endDate": "",
            "description": ""
          }
        ],
        "education": [
          {
            "institution": "",
            "degree": "",
            "year": ""
          }
        ],
        "certifications": ["cert1", "cert2"],
        "projects": [
          {
            "title": "",
            "description": "",
            "link": ""
          }
        ],
        "languages": ["lang1", "lang2"],
        "achievements": ["achievement1"],
        "additionalInfo": ""
      }

      Fill in as much information as you can find. If a field is not found, leave it as an empty string or empty array.
      Do not include any markdown formatting, backticks, or explanation in your response. Return ONLY valid JSON.
      
      Resume Text:
      ${textContent}
    `;

    const response = await groq.chat.completions.create({
        messages: [{ role: 'user', content: prompt }],
        model: 'llama-3.3-70b-versatile',
        response_format: { type: 'json_object' }
    });

    const jsonResponse = response.choices[0]?.message?.content || "{}";
    
    const parsedData = JSON.parse(jsonResponse);
    res.json(parsedData);

  } catch (error) {
    console.error("Resume parse error:", error);
    res.status(500).json({ message: error.error?.error?.message || error.message || "Failed to parse resume" });
  }
};

module.exports = { parseResume };
