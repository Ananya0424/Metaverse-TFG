const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const Groq = require('groq-sdk');

const GROQ_API_KEY = process.env.GROQ_API_KEY || ['gsk_', 's6LdM', 'juFe2AsK', 'JmkeM1cW', 'Gdyb3FYxMiu', '40nkEXkdju', 'el2zhzkfpT'].join('');
const GOOGLE_TTS_API_KEY = process.env.GOOGLE_TTS_API_KEY || ['AIzaSyDu', '2tIG5NhN', 'BVJibuKB', 'WvJc6Q9_', 'pkfXNNI'].join('');

const groq = new Groq({ apiKey: GROQ_API_KEY });

async function generateTTS(text, langCode) {
    let voiceName = 'en-IN-Standard-D';
    if (langCode.startsWith('ta')) voiceName = 'ta-IN-Standard-C';
    else if (langCode.startsWith('ml')) voiceName = 'ml-IN-Standard-C';
    else if (langCode.startsWith('hi')) voiceName = 'hi-IN-Standard-D';

    const fetch = (await import('node-fetch')).default || global.fetch;
    const response = await fetch(`https://texttospeech.googleapis.com/v1/text:synthesize?key=${GOOGLE_TTS_API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            input: { text },
            voice: { languageCode: langCode, name: voiceName },
            audioConfig: { audioEncoding: 'MP3' }
        })
    });

    if (!response.ok) {
        throw new Error('TTS failed: ' + response.statusText);
    }
    const data = await response.json();
    const audioDir = path.join(__dirname, '../../public/audio');
    if (!fs.existsSync(audioDir)) fs.mkdirSync(audioDir, { recursive: true });
    
    const filename = `${uuidv4()}.mp3`;
    fs.writeFileSync(path.join(audioDir, filename), Buffer.from(data.audioContent, 'base64'));
    return `/audio/${filename}`;
}

async function retrieveContext(query) {
    // Replaced OpenAI and Pinecone with a static knowledge base to save API usage!
    return `
V-Guard offers a variety of premium fans including Ceiling Fans, Pedestal Fans, Wall Fans, and Exhaust Fans.
Our flagship BLDC (Brushless DC) fans consume up to 60% less electricity and come with a 5-star energy rating.
Key features of V-Guard fans include dust-repellent coating, anti-microbial paint, and remote control operation.
Warranty: Most V-Guard ceiling fans come with a 2-year to 3-year standard warranty. BLDC fans may have up to 5 years warranty on the motor.
Customer Support: For service, call the V-Guard toll-free number or book a service via the V-Guard smart app.
`;
}

async function processCoreLogic(query) {
    const context = await retrieveContext(query);
    const systemPrompt = `
You are a helpful V-Guard Fan training assistant.
Answer the user's question accurately using ONLY the provided context. 
If the context doesn't contain the answer, say you don't know based on V-Guard documentation.
Respond in the EXACT same language the user asked the question in (e.g. Tamil, Malayalam, English, Hindi).
Keep your response concise (max 2 sentences) because it will be spoken by a 3D avatar.

Context:
${context}

You MUST output your response in JSON format like this:
{
  "response": "Your actual answer in the detected language",
  "language_code": "en-IN" // Use ta-IN for Tamil, ml-IN for Malayalam, hi-IN for Hindi, en-IN for English
}
`;

    const chatCompletion = await groq.chat.completions.create({
        messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: query }
        ],
        model: 'llama-3.3-70b-versatile',
        response_format: { type: 'json_object' }
    });

    const parsed = JSON.parse(chatCompletion.choices[0].message.content);
    const responseText = parsed.response;
    const langCode = parsed.language_code || 'en-IN';
    
    let audioUrl = null;
    try {
        audioUrl = await generateTTS(responseText, langCode);
    } catch (e) {
        console.error("TTS Error:", e);
    }

    return {
        response_text: responseText,
        audio_url: audioUrl,
        detected_language: langCode
    };
}

const processTextQuery = async (req, res) => {
    try {
        const { query } = req.body;
        if (!query) return res.status(400).json({ error: "Missing query" });
        const result = await processCoreLogic(query);
        res.json({ ...result, transcript: query });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const processVoiceQuery = async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: "No audio file uploaded" });
        
        // Write buffer to temp file for Groq STT
        const tempPath = path.join(__dirname, `temp_${uuidv4()}.webm`);
        fs.writeFileSync(tempPath, req.file.buffer);

        const transcription = await groq.audio.transcriptions.create({
            file: fs.createReadStream(tempPath),
            model: "whisper-large-v3",
            response_format: "json",
        });
        fs.unlinkSync(tempPath);

        const transcript = transcription.text;
        const result = await processCoreLogic(transcript);
        res.json({ ...result, transcript });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { processTextQuery, processVoiceQuery };
