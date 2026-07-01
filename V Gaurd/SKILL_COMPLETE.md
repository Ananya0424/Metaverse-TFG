---
name: vguard-fan-assistant
description: Build a complete 3D voice-enabled avatar assistant for V-Guard fan product training with multilingual support, RAG-based knowledge retrieval, and website scraping capabilities.
version: 2.0.0-MVP
author: V-Guard Development Team
---

# V-Guard Fan Assistant - Claude Code Build Guide

## 🎯 What You're Building

A web application where V-Guard employees interact with a 3D male avatar via voice in Tamil, Malayalam, English (and auto-detect 100+ languages). The avatar retrieves information from V-Guard product knowledge base (PPTX files + scraped website data) and responds with synchronized speech.

**Architecture:** Lite Version (Local development → Railway deployment)
**Cost:** ₹914/month after trial | **Target:** 100 employees/day

---

## 📋 Prerequisites (User Must Provide Before You Start)

**Required in project folder:**
```
vguard-assistant/
├── SKILL.md (this file)
├── .env (API keys - user creates)
├── knowledge-base/
│   ├── Fan_Basics_-_Tamil.pptx
│   ├── Fan_Basics_-_Malayalam.pptx
│   └── Fan_Basics_-_English.pptx
└── assets/
    └── male-avatar.glb (from readyplayer.me)
```

**Required in .env file:**
```bash
GROQ_API_KEY=gsk_xxxxxxxxxxxxx
GOOGLE_TTS_API_KEY=AIzaSyxxxxxxxxx
OPENAI_API_KEY=sk_xxxxxxxxxx
PINECONE_API_KEY=xxxxxxxxxx
PINECONE_ENVIRONMENT=us-west1-gcp
PINECONE_INDEX_NAME=vguard-fan-assistant
```

---

## 🏗️ Project Structure to Build

Create this exact folder structure:

```
vguard-assistant/
├── backend/
│   ├── app.py
│   ├── config.py
│   ├── requirements.txt
│   ├── routers/
│   │   ├── __init__.py
│   │   ├── voice.py
│   │   ├── text.py
│   │   └── health.py
│   ├── services/
│   │   ├── __init__.py
│   │   ├── stt_service.py
│   │   ├── llm_service.py
│   │   ├── tts_service.py
│   │   ├── rag_service.py
│   │   └── language_detector.py
│   ├── data/
│   │   ├── website_scraper.py
│   │   ├── process_knowledge.py
│   │   ├── build_index.py
│   │   └── chunks/ (auto-generated)
│   └── utils/
│       ├── __init__.py
│       └── logger.py
├── frontend/
│   ├── index.html
│   ├── css/
│   │   ├── main.css
│   │   ├── avatar-panel.css
│   │   └── chat-panel.css
│   ├── js/
│   │   ├── main.js
│   │   ├── config.js
│   │   ├── avatar-loader.js
│   │   ├── voice-recorder.js
│   │   ├── chat-interface.js
│   │   └── api-client.js
│   ├── models/ (copy from assets/)
│   │   └── male-avatar.glb
│   └── static/
│       └── audio/ (auto-generated for TTS files)
├── .gitignore
└── README.md
```

---

## 🔨 Build Instructions - Follow These Steps

### ⚠️ IMPORTANT: Session Management Strategy

Claude Code has session limits. To avoid timeout issues, build in phases:

**RECOMMENDED APPROACH - Build in 4 Phases:**

```
Phase 1 (15 min): Backend Core
→ Tell Claude Code: "Build Phase 1: backend configuration and services only"
→ Verify files created
→ If session expires, you have a partial working backend

Phase 2 (15 min): Backend API  
→ Tell Claude Code: "Build Phase 2: routers and app.py"
→ Test API endpoints work

Phase 3 (15 min): Data Processing
→ Tell Claude Code: "Build Phase 3: data processing tools"
→ Setup knowledge base

Phase 4 (15 min): Frontend
→ Tell Claude Code: "Build Phase 4: complete frontend"
→ Test in browser
```

**ALTERNATIVE - Build All at Once:**
Only if you have Claude Pro or are confident session won't expire.
→ Tell Claude Code: "Build the complete project from SKILL.md"

**IF SESSION EXPIRES MID-BUILD:**
1. Note which files were created
2. Wait for rate limit reset (or use Claude Pro)
3. Start new session
4. Say: "Continue building from where we stopped. Missing files: [list them]"

---

### STEP 1: Backend Configuration

**File: backend/requirements.txt**
Create with these dependencies:
```
fastapi==0.115.0
uvicorn[standard]==0.30.0
python-multipart==0.0.12
groq==0.11.0
openai==1.51.0
pinecone-client==5.0.0
google-cloud-texttospeech==2.17.0
langdetect==1.0.9
python-pptx==1.0.2
pydantic==2.9.0
pydantic-settings==2.5.0
python-dotenv==1.0.0
requests==2.31.0
beautifulsoup4==4.12.3
lxml==5.1.0
```

**File: backend/config.py**
Purpose: Load environment variables from .env file
Requirements:
- Use pydantic-settings BaseSettings
- Load all API keys from .env
- Set default host="0.0.0.0", port=8000
- Use @lru_cache for singleton pattern

**File: backend/app.py**
Purpose: Main FastAPI application
Requirements:
- Create FastAPI app with title="V-Guard Fan Assistant API"
- Add CORS middleware (allow all origins for development)
- Include routers: voice, text, health (prefix="/api")
- Mount frontend as static files
- Serve index.html at root path "/"
- Run with uvicorn when executed directly

---

### STEP 2: Backend Services (Core Logic)

**File: backend/services/language_detector.py**
Purpose: Auto-detect user's language
Requirements:
- Use langdetect library
- Function: detect_language(text: str) -> str
- Support: en, ta, ml, hi, kn, te, bn, mr, gu, fr, es
- Default to 'en' if detection fails

**File: backend/services/stt_service.py**
Purpose: Speech-to-Text using Groq Whisper
Requirements:
- Use Groq client with whisper-large-v3 model
- Function: transcribe(audio_file_path: str) -> str
- Open audio file as binary, call Groq API
- Return transcribed text
- Handle exceptions gracefully

**File: backend/services/rag_service.py**
Purpose: Vector search and retrieval from Pinecone
Requirements:
- Initialize Pinecone client
- Initialize OpenAI client for embeddings
- Function: retrieve(query: str, language: str, top_k: int = 3) -> list
- Convert query to embedding using text-embedding-3-small
- Query Pinecone with filter on language metadata
- Return list of matching chunks with text and metadata

**File: backend/services/llm_service.py**
Purpose: Generate answers using Groq Llama 70B
Requirements:
- Use Groq client with llama-3.1-70b-versatile model
- Function: generate(query: str, context: list, language: str) -> str
- Build system prompt based on language (en, ta, ml, hi, kn, te, etc.)
- Include context chunks in system message
- Temperature: 0.7, max_tokens: 500
- Return generated answer

**File: backend/services/tts_service.py**
Purpose: Text-to-Speech using Google Cloud TTS
Requirements:
- Initialize Google TTS client
- Function: synthesize(text: str, language: str) -> dict
- Map language to voice: ta-IN-Standard-C (Tamil), ml-IN-Standard-C (Malayalam), en-IN-Standard-D (English), hi-IN-Standard-D (Hindi)
- Voice gender: MALE
- Audio encoding: MP3
- Save audio file to frontend/static/audio/ with UUID filename
- Return: {audio_url: '/static/audio/filename.mp3'}

---

### STEP 3: Backend Routers (API Endpoints)

**File: backend/routers/health.py**
Purpose: Health check endpoint
Requirements:
- GET /api/health
- Return: {status: "healthy", services: {...}}
- Check if all services are ready (Groq, Pinecone, Google TTS, OpenAI)

**File: backend/routers/text.py**
Purpose: Handle text-based queries
Requirements:
- POST /api/text-query
- Input: {query: str, language: str (optional)}
- Process: detect language → RAG retrieve → LLM generate → TTS synthesize
- Return: {transcript: str, response_text: str, audio_url: str, detected_language: str}

**File: backend/routers/voice.py**
Purpose: Handle voice-based queries
Requirements:
- POST /api/voice-query
- Input: FormData with audio file and language
- Process: STT transcribe → detect language → RAG retrieve → LLM generate → TTS synthesize
- Save uploaded audio to temp file
- Return: {transcript: str, response_text: str, audio_url: str, detected_language: str, sources: list}

---

### STEP 4: Data Processing Tools

**File: backend/data/website_scraper.py**
Purpose: Scrape V-Guard product pages
Requirements:
- Class: VGuardScraper with base_url
- Method: scrape_page(url) - extract all text content, remove nav/footer/scripts
- Method: save_to_text_files(data) - save to ../../knowledge-base/scraped_data/
- Main function: Allow user to configure URLs list, run scraper, save combined file as vguard_website_data.txt
- Use BeautifulSoup4 with requests
- Add 2-second delay between requests
- Extract: title, content, specifications, features, price

**File: backend/data/process_knowledge.py**
Purpose: Extract text from PPTX and website data
Requirements:
- Function: extract_text_from_pptx(path, language) - use python-pptx to extract slide text
- Function: extract_text_from_scraped_website(path) - read txt file, split into chunks of 250 words
- Function: process_all_knowledge() - process all PPTX files + website data
- Save to: chunks/knowledge_chunks.json
- Each chunk: {text, source, source_type, language, ...}
- Report total chunks and breakdown

**File: backend/data/build_index.py**
Purpose: Upload vectors to Pinecone
Requirements:
- Function: create_index() - create Pinecone index with dimension=1536, metric=cosine
- Function: upload_chunks() - read knowledge_chunks.json, create embeddings using OpenAI, upload to Pinecone in batches of 100
- Each vector: {id, values (embedding), metadata: {text, source, source_type, language}}
- Show progress for each batch

---

### STEP 5: Frontend (User Interface)

**File: frontend/index.html**
Purpose: Main HTML page
Requirements:
- Two-panel layout: left (3D avatar), right (chat interface)
- Left panel: div#avatar-container for Three.js, status display
- Right panel: header with language selector (தமிழ், മലയാളം, English buttons), chat messages area, input area
- Input area: microphone button (hold to speak), text input, send button
- Load Three.js from CDN (version 0.160.0)
- Include all JS modules: config, avatar-loader, voice-recorder, chat-interface, api-client, main

**File: frontend/css/main.css**
Purpose: Main layout styling
Requirements:
- Two-column grid layout: 40% left (avatar), 60% right (chat)
- Full viewport height (100vh)
- Clean modern design with proper spacing

**File: frontend/css/avatar-panel.css**
Purpose: Left panel styling
Requirements:
- Gradient background: linear-gradient(135deg, #667eea 0%, #764ba2 100%)
- Center avatar container
- Status badge at bottom with rounded corners and white background

**File: frontend/css/chat-panel.css**
Purpose: Right panel styling
Requirements:
- White background
- Header with title and language selector buttons
- Scrollable message area
- Message bubbles: user (right, blue), bot (left, gray)
- Input area with mic button, text input, send button
- Mic button shows recording state (pulsing animation)

**File: frontend/js/config.js**
Purpose: Configuration constants
Requirements:
- Export API_BASE_URL (http://localhost:8000)
- Export AVATAR_MODEL_PATH (/models/male-avatar.glb)

**File: frontend/js/avatar-loader.js**
Purpose: Load and display 3D avatar using Three.js
Requirements:
- Class: AvatarLoader
- Initialize: Create scene, camera, renderer, lights
- Load avatar: Use GLTFLoader to load male-avatar.glb
- Camera position: (0, 1.6, 2) looking at (0, 1.4, 0)
- Animation loop: Render continuously
- Handle window resize

**File: frontend/js/voice-recorder.js**
Purpose: Record audio from microphone
Requirements:
- Class: VoiceRecorder
- Method: start() - request microphone access, start MediaRecorder
- Method: stop() - stop recording, return audio Blob (webm format)
- Use MediaRecorder API

**File: frontend/js/chat-interface.js**
Purpose: Display chat messages
Requirements:
- Class: ChatInterface
- Method: addMessage(text, sender) - create message bubble (user/bot), add to chat, auto-scroll
- Clear styling for user vs bot messages

**File: frontend/js/api-client.js**
Purpose: Call backend APIs
Requirements:
- Class: APIClient
- Method: sendVoiceQuery(audioBlob, language) - POST to /api/voice-query with FormData
- Method: sendTextQuery(text, language) - POST to /api/text-query with JSON
- Return parsed JSON response

**File: frontend/js/main.js**
Purpose: Main application logic
Requirements:
- Class: VGuardAssistant
- Initialize: Create avatar loader, chat interface, voice recorder, API client
- Event: Mic button mousedown → start recording
- Event: Mic button mouseup → stop recording, send to backend
- Event: Send button click → send text query
- Event: Language selector → update current language
- Display: Show user message, bot response, play audio
- Update status: "Listening...", "Processing...", "Ready"

---

### STEP 6: Supporting Files

**File: backend/utils/logger.py**
Purpose: Logging configuration
Requirements:
- Setup Python logging with INFO level
- Format: timestamp, level, message
- Log to console

**File: .gitignore**
Content:
```
.env
__pycache__/
*.pyc
*.pyo
node_modules/
chunks/
scraped_data/
*.mp3
*.webm
.DS_Store
```

**File: README.md**
Purpose: Setup and usage instructions
Requirements:
- Prerequisites section
- Installation steps
- Knowledge base setup (scraper → processor → uploader)
- Running the application
- Testing checklist
- Troubleshooting guide
- API endpoints documentation

---

## 🧪 Testing Workflow (For User After Build)

After Claude Code builds everything, user should:

### 1. Setup Knowledge Base
```bash
cd backend/data

# Optional: Scrape website (edit URLs in website_scraper.py first)
python website_scraper.py

# Process knowledge (PPTX + website)
python process_knowledge.py

# Upload to Pinecone
python build_index.py
```

### 2. Run Application
```bash
cd backend
pip install -r requirements.txt
python app.py
```

### 3. Test in Browser
```
Open: http://localhost:8000

Test checklist:
- [ ] Page loads, avatar appears
- [ ] Click microphone, speak "BLDC fan warranty என்ன?"
- [ ] System transcribes correctly
- [ ] Bot responds in Tamil
- [ ] Audio plays
- [ ] Type message, send, get response
- [ ] Switch language selector
```

---

## 🎯 Critical Implementation Notes

### For STT Service:
- Use Groq whisper-large-v3 (FREE, auto language detection)
- Process audio file as binary stream
- Handle errors gracefully (return empty string on failure)

### For RAG Service:
- IMPORTANT: Embeddings are multilingual - user can ask in Hindi, system finds English/Tamil/Malayalam data
- Filter by language if specified, otherwise search all
- Return top 3 most relevant chunks

### For LLM Service:
- Context is CRITICAL - include all retrieved chunks in system message
- Instruct LLM to respond in user's language
- Keep responses concise (max 500 tokens)

### For TTS Service:
- Save audio files to frontend/static/audio/ (create directory if not exists)
- Use UUID for filenames to avoid conflicts
- Return relative URL path (/static/audio/filename.mp3)

### For Frontend:
- Avatar: Keep simple for MVP - just load and display, no animations yet
- Voice: Use MediaRecorder API (works in all modern browsers)
- Audio playback: Create Audio element, play response

---

## 🚨 Common Issues & Solutions

### **Issue: "Module not found"**
**Solution:** Run `pip install -r requirements.txt` in backend/

### **Issue: "API key error"**
**Solution:** Check .env file exists and has all required keys

### **Issue: "Pinecone index not found"**
**Solution:** Run backend/data/build_index.py to create index

### **Issue: "Avatar not loading"**
**Solution:** Check male-avatar.glb is in frontend/models/

### **Issue: "CORS error"**
**Solution:** Check FastAPI CORS middleware allows all origins

### **Issue: "Microphone not working"**
**Solution:** Browser requires HTTPS for mic access (use localhost for dev)

---

## 🔑 API Token Expiry Handling - CRITICAL

### **Understanding Token/Credit Expiry**

**Services that NEVER expire:**
```
✅ Groq (STT + LLM): FREE forever
✅ Pinecone: FREE forever (up to 100K vectors)

No action needed - these work indefinitely
```

**Services with trial credits that EXPIRE:**
```
⚠️ OpenAI Embeddings: $5 credit (expires after 3 months)
⚠️ Google Cloud TTS: $300 credit (expires after 90 days)

After expiry: MUST add payment method or service stops
```

---

### **What Happens When Credits Expire**

#### **Scenario 1: OpenAI Credits Depleted**

```
Timeline:
Month 1-3: Using $5 free credit ✅
Month 4: Credit runs out ❌

What breaks:
❌ Cannot create new embeddings (new knowledge base uploads fail)
❌ Cannot search (query embedding fails)
❌ Users see error: "Service unavailable"

What still works:
✅ Existing vectors in Pinecone (already uploaded)
✅ Everything else (STT, LLM, TTS)

Impact: CRITICAL - system cannot answer queries
```

**Error you'll see in logs:**
```python
openai.RateLimitError: You exceeded your current quota, please check your plan and billing details
# OR
openai.AuthenticationError: Incorrect API key provided
```

**How to detect BEFORE it breaks:**

Add this monitoring to `backend/routers/health.py`:

```python
# In health check endpoint
@router.get("/health")
async def health_check():
    status = {
        "status": "healthy",
        "services": {}
    }
    
    # Check OpenAI credits
    try:
        test_response = openai_client.embeddings.create(
            model="text-embedding-3-small",
            input="test"
        )
        status["services"]["openai"] = "healthy"
    except openai.RateLimitError:
        status["services"]["openai"] = "⚠️ CREDITS DEPLETED - Add payment"
        status["status"] = "degraded"
    except Exception as e:
        status["services"]["openai"] = f"error: {str(e)}"
        status["status"] = "unhealthy"
    
    # Check other services...
    return status
```

**How to fix:**
```
1. Go to: https://platform.openai.com/account/billing
2. Add payment method (credit card)
3. Add $10 minimum (will last ~5 months)
4. Credits refill immediately
5. System works again ✅

Cost: ₹2/month for your usage
```

---

#### **Scenario 2: Google Cloud TTS Credits Depleted**

```
Timeline:
Day 1-90: Using $300 free credit ✅
Day 91: Credit expires ❌

What breaks:
❌ Cannot generate speech (TTS fails)
❌ Avatar cannot speak
❌ Users only see text responses (no audio)

What still works:
✅ Everything else (STT, search, LLM text responses)

Impact: MEDIUM - text responses work, but no voice
```

**Error you'll see:**
```python
google.api_core.exceptions.PermissionDenied: 403 The billing account for the owning project is disabled
```

**How to detect:**

Add to health check:
```python
# Test TTS
try:
    test_tts = tts_client.synthesize_speech(
        input=texttospeech.SynthesisInput(text="test"),
        voice=texttospeech.VoiceSelectionParams(
            language_code="en-IN",
            name="en-IN-Standard-D"
        ),
        audio_config=texttospeech.AudioConfig(
            audio_encoding=texttospeech.AudioEncoding.MP3
        )
    )
    status["services"]["google_tts"] = "healthy"
except Exception as e:
    status["services"]["google_tts"] = f"⚠️ {str(e)}"
    status["status"] = "degraded"
```

**How to fix:**
```
1. Go to: https://console.cloud.google.com/billing
2. Enable billing (add credit card)
3. Continue using (charged ₹412/month)
4. TTS works again ✅
```

---

### **Graceful Degradation Strategy**

**Goal:** System continues working even if one service fails

**Implementation in `backend/routers/voice.py`:**

```python
@router.post("/voice-query")
async def process_voice_query(audio: UploadFile, language: str = "auto"):
    try:
        # 1. STT
        transcript = await stt_service.transcribe(audio_path)
        
        # 2. Detect language
        detected_lang = language_detector.detect_language(transcript)
        
        # 3. RAG - with fallback
        try:
            context = await rag_service.retrieve(transcript, detected_lang)
        except openai.RateLimitError:
            # OpenAI credits depleted - use fallback
            logger.error("OpenAI credits depleted - using fallback response")
            context = []  # No context, LLM uses general knowledge
            
        # 4. LLM
        response_text = await llm_service.generate(transcript, context, detected_lang)
        
        # 5. TTS - with fallback
        try:
            tts_result = await tts_service.synthesize(response_text, detected_lang)
            audio_url = tts_result['audio_url']
        except Exception as e:
            # Google TTS failed - return text only
            logger.error(f"TTS failed: {e} - returning text only")
            audio_url = None
            
        return {
            "transcript": transcript,
            "response_text": response_text,
            "audio_url": audio_url,  # Can be None
            "detected_language": detected_lang,
            "warning": "Audio unavailable - credits depleted" if not audio_url else None
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
```

**Frontend handles gracefully:**

```javascript
// In frontend/js/api-client.js
const response = await fetch('/api/voice-query', {...});
const data = await response.json();

if (data.warning) {
    // Show warning to user
    showWarning(data.warning);
}

// Display text even if audio unavailable
chatInterface.addMessage(data.response_text, 'bot');

// Play audio only if available
if (data.audio_url) {
    playAudio(data.audio_url);
}
```

---

### **Monitoring & Alerting**

**Create `backend/utils/credit_monitor.py`:**

```python
"""
Check API credit status daily and send alerts
Run as cron job: 0 9 * * * python credit_monitor.py
"""

import openai
from google.cloud import texttospeech
import smtplib
from email.message import EmailMessage

def check_openai_credits():
    """Check if OpenAI credits are low"""
    try:
        # Make test call
        openai_client.embeddings.create(
            model="text-embedding-3-small",
            input="test"
        )
        return "healthy"
    except openai.RateLimitError:
        return "depleted"
    except Exception as e:
        return f"error: {str(e)}"

def send_alert(service, status):
    """Send email alert to admin"""
    msg = EmailMessage()
    msg['Subject'] = f'⚠️ V-Guard Assistant: {service} {status}'
    msg['From'] = 'alerts@vguard-assistant.com'
    msg['To'] = 'admin@vguard.com'
    msg.set_content(f"""
    Alert: {service} credits are {status}
    
    Action required:
    1. Add payment method
    2. System will degrade if not fixed
    
    Check: https://app.vguard-assistant.com/health
    """)
    
    # Send email (configure SMTP)
    # smtp.send_message(msg)
    
if __name__ == "__main__":
    openai_status = check_openai_credits()
    if openai_status != "healthy":
        send_alert("OpenAI", openai_status)
```

---

### **Cost Timeline & Actions**

**Month 1-3: Everything FREE**
```
Using trial credits:
✅ OpenAI: $5 credit
✅ Google: $300 credit
✅ Total cost: ₹500/month (Railway only)

Action: Nothing - enjoy free period
```

**Month 3 (OpenAI expires):**
```
⚠️ OpenAI trial ending soon

Action:
1. Go to OpenAI billing
2. Add payment method
3. Add $10 (lasts 5 months)
4. New cost: ₹502/month (Railway + OpenAI)
```

**Month 4 (Google expires):**
```
⚠️ Google trial ending soon

Action:
1. Go to Google Cloud billing  
2. Enable billing
3. New cost: ₹914/month (Railway + OpenAI + Google)
```

**Month 5+: Stable costs**
```
✅ All services paid
✅ Total: ₹914/month
✅ No more surprises
```

---

### **Emergency Fallback Plan**

**If you cannot add payment immediately:**

**Option 1: Disable affected features temporarily**
```python
# In config.py
ENABLE_RAG = False  # If OpenAI expired
ENABLE_TTS = False  # If Google expired

# System still works in degraded mode:
# - No RAG → LLM uses general knowledge (less accurate)
# - No TTS → Text responses only (no audio)
```

**Option 2: Switch to free alternatives**
```python
# Replace OpenAI embeddings with free alternative
# Use sentence-transformers (self-hosted)
from sentence_transformers import SentenceTransformer

model = SentenceTransformer('all-MiniLM-L6-v2')
embeddings = model.encode(text)

# Cost: ₹0 (runs on your server)
# Downside: Slightly lower quality
```

**Option 3: Pause system temporarily**
```python
# Return maintenance message to users
@app.middleware("http")
async def maintenance_mode(request, call_next):
    if MAINTENANCE_MODE:
        return JSONResponse({
            "error": "System under maintenance. Back soon!"
        }, status_code=503)
    return await call_next(request)
```

---

## 📊 Architecture Summary

```
User speaks → Microphone → WebM audio
    ↓
Backend /api/voice-query → Groq Whisper (STT)
    ↓
Transcribed text → Language detection
    ↓
Query → OpenAI Embeddings → Vector
    ↓
Vector → Pinecone search → Top 3 chunks
    ↓
Chunks + Query → Groq Llama 70B → Answer
    ↓
Answer → Google TTS → MP3 audio
    ↓
Frontend plays audio + displays text
```

**Total response time: ~2-3 seconds**

---

## 💰 Cost Breakdown

**Monthly costs after free trial:**
- Groq (STT + LLM): ₹0 (forever free)
- Pinecone: ₹0 (free tier, 100K vectors)
- OpenAI Embeddings: ₹2/month
- Google TTS: ₹412/month
- Railway hosting: ₹500/month
**Total: ₹914/month**

**Per query cost: ₹0.06**
**Per employee/month: ₹9.14**

---

## 🎯 Success Criteria

When complete, the system should:
- ✅ Accept voice input in Tamil/Malayalam/English (and auto-detect 100+ languages)
- ✅ Transcribe accurately using Groq Whisper
- ✅ Find relevant information from PPTX + website data
- ✅ Generate accurate answers in user's language
- ✅ Speak responses with Google TTS
- ✅ Display 3D avatar with conversation
- ✅ Handle 100 queries/day with <3 second response time
- ✅ Work on localhost for development
- ✅ Be ready for Railway deployment

---

## 🔄 Phase-by-Phase Build Guide (Session-Safe)

### **PHASE 1: Backend Core (15 minutes)**

**Tell Claude Code:**
```
"Build Phase 1 of the V-Guard Fan Assistant:

Create backend configuration and core services:
1. backend/requirements.txt
2. backend/config.py
3. backend/utils/logger.py
4. backend/services/__init__.py
5. backend/services/language_detector.py
6. backend/services/stt_service.py
7. backend/services/rag_service.py
8. backend/services/llm_service.py
9. backend/services/tts_service.py

Follow the specifications in SKILL.md for each file.
Stop after these files are complete."
```

**Verify:**
```bash
ls backend/services/
# Should show: __init__.py, language_detector.py, stt_service.py, 
#              rag_service.py, llm_service.py, tts_service.py
```

---

### **PHASE 2: Backend API (15 minutes)**

**Tell Claude Code:**
```
"Build Phase 2 of the V-Guard Fan Assistant:

Create API routers and main application:
1. backend/routers/__init__.py
2. backend/routers/health.py
3. backend/routers/text.py
4. backend/routers/voice.py
5. backend/app.py

Follow the specifications in SKILL.md for each file.
Stop after these files are complete."
```

**Verify:**
```bash
ls backend/routers/
# Should show: __init__.py, health.py, text.py, voice.py

ls backend/app.py
# Should exist
```

**Test (Optional):**
```bash
cd backend
pip install -r requirements.txt
python app.py
# Should start without errors
```

---

### **PHASE 3: Data Processing Tools (15 minutes)**

**Tell Claude Code:**
```
"Build Phase 3 of the V-Guard Fan Assistant:

Create data processing tools:
1. backend/data/website_scraper.py
2. backend/data/process_knowledge.py
3. backend/data/build_index.py

Follow the specifications in SKILL.md for each file.
Stop after these files are complete."
```

**Verify:**
```bash
ls backend/data/
# Should show: website_scraper.py, process_knowledge.py, build_index.py
```

**Test (Optional):**
```bash
cd backend/data
python process_knowledge.py
# Should process PPTX files
```

---

### **PHASE 4: Frontend (20 minutes)**

**Tell Claude Code:**
```
"Build Phase 4 of the V-Guard Fan Assistant:

Create complete frontend:
1. frontend/index.html
2. frontend/css/main.css
3. frontend/css/avatar-panel.css
4. frontend/css/chat-panel.css
5. frontend/js/config.js
6. frontend/js/avatar-loader.js
7. frontend/js/voice-recorder.js
8. frontend/js/chat-interface.js
9. frontend/js/api-client.js
10. frontend/js/main.js
11. Copy assets/male-avatar.glb to frontend/models/
12. Create frontend/static/audio/ directory

Follow the specifications in SKILL.md for each file.
Complete the project."
```

**Verify:**
```bash
ls frontend/
# Should show: index.html, css/, js/, models/, static/

ls frontend/models/
# Should show: male-avatar.glb
```

**Test:**
```bash
# Backend should already be running from Phase 2
# Open browser: http://localhost:8000
# Should see the interface
```

---

### **PHASE 5: Documentation (10 minutes)**

**Tell Claude Code:**
```
"Build Phase 5 of the V-Guard Fan Assistant:

Create documentation and configuration:
1. README.md (complete setup guide)
2. .gitignore
3. .env.example (template for API keys)

Follow the specifications in SKILL.md.
This completes the project."
```

**Verify:**
```bash
ls
# Should show: README.md, .gitignore, .env.example
```

---

## 🚨 If Session Expires During Build

### **What to do:**

**1. Check what was completed:**
```bash
# List all files created
find vguard-assistant -type f -name "*.py" -o -name "*.js" -o -name "*.html"
```

**2. Identify missing files:**
```
Compare against SKILL.md Phase requirements
Example: "Phase 3 incomplete - missing build_index.py"
```

**3. Wait for rate limit reset:**
```
Free tier: Wait 5 hours
OR
Upgrade to Claude Pro: Continue immediately
```

**4. Resume in new session:**
```
"Continue building the V-Guard Fan Assistant project.

Already completed: [list completed phases]
Missing: [list missing files]

Please create the missing files following SKILL.md specifications."
```

**5. Claude Code will resume:**
```
✅ Reads existing files
✅ Creates only missing files
✅ Completes the build
```

---

## 💡 Session Management Tips

### **Tip 1: Use Claude Pro if building all at once**
```
Claude Pro benefits:
- 5x more messages
- Higher rate limits  
- Longer sessions
- Priority access

Worth it for large projects like this.
```

### **Tip 2: Build during low-traffic hours**
```
Less likely to hit rate limits:
- Late night (your timezone)
- Early morning
- Weekdays (less usage than weekends)
```

### **Tip 3: Have API keys ready BEFORE starting**
```
Don't waste session time getting API keys.
Prepare everything first, then build.
```

### **Tip 4: Test each phase before continuing**
```
After Phase 1: Test imports work
After Phase 2: Test API starts
After Phase 3: Test data processing
After Phase 4: Test full system

Catch issues early = easier to fix
```

### **Tip 5: Save progress frequently**
```
Claude Code auto-saves, but:
- Commit to git after each phase
- Or backup the folder
- Don't lose work if something goes wrong
```

---

## 📊 Estimated Times

**With Claude Pro (all at once):**
```
Build time: 30-40 minutes
Risk of timeout: Low (~10%)
Recommended: Yes, if you have Pro
```

**With Free Tier (phased approach):**
```
Phase 1: 15 min ✓
Phase 2: 15 min ✓  
Phase 3: 15 min ✓
Phase 4: 20 min ✓
Phase 5: 10 min ✓

Total: 75 minutes across multiple sessions
Risk of timeout per phase: Very low (~5%)
Recommended: Yes, safer approach
```

**With Free Tier (all at once):**
```
Build time: 30-40 minutes
Risk of timeout: High (~60%)
Recommended: No, too risky
```

---

## 🎓 Development Principles

1. **Local First**: Make it work on localhost before deploying
2. **MVP Focus**: Core features only, add polish later
3. **Test Incrementally**: Test each service independently
4. **Error Handling**: Graceful failures, informative messages
5. **User Experience**: Fast, accurate, multilingual

---

## 📝 Next Steps After MVP

Version 2.0 enhancements:
- Add lip sync / viseme animations for avatar
- Add more TTS voice options
- Deploy to Railway
- Add analytics dashboard
- Add admin panel for knowledge base updates
- Performance optimizations

---

## 🎯 Final Checklist Before Starting

User must have:
- [x] All API keys obtained
- [x] .env file created with keys
- [x] 3 PPTX files in knowledge-base/
- [x] male-avatar.glb in assets/
- [x] This SKILL.md in project root
- [x] Python 3.11+ installed
- [x] VS Code with Claude Code extension

**Ready? Tell Claude Code: "Build this project following SKILL.md"**

---

**End of Build Guide**
