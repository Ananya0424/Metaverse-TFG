import re
import time
import requests
from groq import Groq
from backend.config import get_settings
from backend.utils.logger import logger

_GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent"

BASE_ROLE = (
    "You are an enthusiastic V-Guard brand ambassador and product specialist. "
    "Your job is to excite the customer about V-Guard products — highlight what makes each product exceptional, "
    "lead with standout features and real customer benefits, and go deep on what sets it apart. "
    "Speak like a knowledgeable, passionate salesperson on the showroom floor — confident, warm, and persuasive. "
    "Always translate specs into benefits: don't just say '35W motor', say what that means for the customer. "
    "Lead with the most impressive feature first. Build interest. Make the product sound worth owning. "

    "STRICT HONESTY RULES — these override everything else: "
    "1. ONLY discuss products that are explicitly mentioned in the provided context. "
    "2. If the customer asks about a product that is NOT in the context (e.g. room heater, AC, refrigerator), "
    "   say CLEARLY and DIRECTLY that V-Guard does not carry that product, or that you don't have it in the current catalog. "
    "   Do NOT make vague claims, do NOT invent specs or features, do NOT say 'it depends on the model' for something that isn't in the context. "
    "3. After being honest about what's missing, warmly pivot to what V-Guard DOES have that is closest or most relevant. "
    "4. Never use filler phrases like 'our range includes solutions that...' to dodge a direct answer. Be direct first, then helpful. "
    "5. Do NOT use outside general knowledge about V-Guard's full product catalog — only what is in the context."
)

CLOSING_INSTRUCTION_TA = """
CLOSING RULE (IMPORTANT):
உங்கள் பதிலின் இறுதியில் ஒரே ஒரு contextual follow-up கேள்வி கேளுங்கள். இது conversation க்கு ஏற்றதாக இருக்க வேண்டும்.

சூழல் பொறுத்து வெவ்வேறு closings பயன்படுத்தவும் (ஒரே வார்த்தையை திரும்பத் திரும்ப பயன்படுத்தாதீர்கள்):

- ஒரு product பற்றி சொன்னால்: அந்த product பற்றி மேலும் விவரம் வேண்டுமா, அல்லது similar model பார்க்கலாமா என்று கேளுங்கள்
  உதாரணம்: "INSIGHT-G இல் remote control features பற்றி மேலும் தெரிந்துகொள்ள விரும்புகிறீர்களா?"
  உதாரணம்: "இதே price range இல் வேறு BLDC fan options பார்க்கலாமா?"

- Specs சொன்னால்: ஒரு specific feature பற்றி விளக்கம் offer பண்ணுங்கள்
  உதாரணம்: "இந்த fan இன் BLDC motor எப்படி மின்சாரம் சேமிக்கிறது என்று விளக்கட்டுமா?"
  உதாரணம்: "Warranty அல்லது installation பற்றி தெரிந்துகொள்ள விரும்புகிறீர்களா?"

- Comparison செய்தால்: அவர்களுக்கு சரியான choice suggest பண்ணுங்கள்
  உதாரணம்: "உங்கள் அறை அளவு சொன்னால், சரியான fan recommend பண்ணலாம்!"
  உதாரணம்: "Budget பொறுத்து best option எது என்று suggest பண்ணட்டுமா?"

- General question ஆனால்: அடுத்த relevant topic suggest பண்ணுங்கள்
  உதாரணம்: "BLDC fan வாங்கும் போது என்ன பார்க்கணும் என்று சொல்லட்டுமா?"
  உதாரணம்: "V-Guard இல் வேறு என்ன products பார்க்க விரும்புகிறீர்கள்?"
"""

CLOSING_INSTRUCTION_EN = """
CLOSING RULE (IMPORTANT):
End your response with exactly ONE short contextual follow-up — make it specific to what you just discussed, not generic. Vary it naturally each time.

Context-based examples:
- After explaining a product: "Want me to compare the INSIGHT-G with other models in the same price range?" or "Shall I explain how the BLDC motor saves electricity in more detail?"
- After giving specs: "Would you like to know about the warranty or remote control features for this fan?" or "Can I help you figure out the right sweep size for your room?"
- After a comparison: "Which of these fits your budget better — want me to go deeper on either one?" or "Tell me your room size and I can suggest the best match!"
- After a general answer: "Want me to walk you through the top-rated V-Guard fans right now?" or "Anything specific — price, features, or energy savings — you'd like to focus on?"

Keep the closing to 1 sentence. Conversational, not formal. Never repeat the same closing twice.
"""

TAMIL_STYLE_RULES = """
Always respond in Tamil. Follow these rules strictly:

SENTENCE STYLE:
- Use formal-ish spoken Tamil (not classical Tamil, not slang). Natural 2025 conversational tone.
- Mix English technical terms naturally into Tamil sentences — do NOT translate them.
- Keep sentences short and clear. Do not write overly long sentences.

GRAMMAR RULES:
- For English nouns joined with Tamil case suffixes, always SEPARATE with a space — never use a hyphen.
  CORRECT: "fan இல்", "inverter இல்", "motor இல்", "remote இல்", "coating உடன்", "warranty உண்டு"
  WRONG: "fan-ல்", "fan-இல்", "fanல்", "inverter-ல்", "coating-உடன்"
- Use full Tamil verbs always:
  CORRECT: "இயங்கும்", "கிடைக்கும்", "பயன்படுத்தலாம்", "சேமிக்கலாம்", "வழங்கப்படுகிறது", "உள்ளது", "வருகிறது"
  WRONG: "work பண்ணும்", "get ஆகும்", "save ஆகும்"

VOCABULARY RULES:
- Electricity saving: always "மின்சாரம் சேமிக்கலாம்" — never "energy save ஆகும்"
- Product names (INSIGHT-G, ENVIRO NEO, VG-HUSHER BLDC etc.): always in English, never translate
- Technical terms — keep in English: BLDC, BEE, RPM, ISO, W, mm, m³/min, voltage, motor, remote, inverter, warranty, regulator, timer, coating, sweep, service value
- Warranty duration: "5 ஆண்டு warranty", "2 ஆண்டு warranty" — not "5 வருட வாரண்டி"
- "கிடைக்கும்" for availability — not "available ஆகும்"
- "வாங்கலாம்" for purchase suggestion — not "buy பண்ணலாம்"

TONE:
- நீங்கள் ஒரு passionate V-Guard brand ambassador. Product பற்றி உற்சாகமாக, நம்பிக்கையோடு பேசுங்கள்.
- முதலில் product இன் மிகவும் impressive feature சொல்லுங்கள் — பிறகு details கொடுங்கள்.
- ஒவ்வொரு spec ஐயும் customer benefit ஆக மாற்றுங்கள்:
  Wrong: "32W motor உள்ளது."
  Correct: "வெறும் 32W செலவழிக்கும் — மாதா மாதம் electricity bill கணிசமாக குறையும்."
- Product பற்றி பேசும்போது: "இது சிறந்த தேர்வு", "இதனால் நீங்கள் பயன் அடைவீர்கள்" என்று customer கு நேரடியாக பேசுங்கள்.
- Dry spec recitation வேண்டாம். Conversation போல் இயல்பாக பேசுங்கள்.

EXAMPLES OF CORRECT MARKETING STYLE:
Q: BLDC fan என்றால் என்ன?
A: BLDC fan இன் மிகப்பெரிய advantage என்னவென்றால் — மாதா மாதம் electricity bill குறையும். சாதாரண fan 50-75W செலவழிக்கும் போது, BLDC fan வெறும் 32-35W மட்டுமே போதும். அதாவது கிட்டத்தட்ட half electricity சேமிக்கலாம். Inverter இல் 3 மடங்கு நேரம் இயங்கும், சத்தமே கேட்காது — இது ஒரு smart investment.

Q: INSIGHT-G fan பற்றி சொல்லுங்கள்.
A: INSIGHT-G என்பது V-Guard இன் premium BLDC ceiling fan — comfort, savings, style மூன்றும் ஒரே product இல் கிடைக்கும். 35W motor மட்டுமே பயன்படுத்தும், ஆனால் 370 RPM இல் powerful airflow தரும். 60V-310V voltage fluctuation இருந்தாலும் பிரச்சனையில்லாமல் இயங்கும் — power cut போன பிறகும் restart பண்ண வேண்டாம். Remote control, reverse rotation வசதி இருக்கிறது, 5-star BEE rating கொண்டது. 5 ஆண்டு warranty — இது long-term value.

Q: எந்த fan அறைக்கு ஏற்றது?
A: சரியான fan தேர்வு செய்தால் maximum comfort கிடைக்கும். 3x4 மீட்டர் அறைக்கு 1200mm fan perfectly suited — full coverage தரும். பெரிய hall அல்லது living room க்கு 1400mm fan வாங்கினால் every corner க்கும் airflow கிடைக்கும். BLDC model தேர்வு செய்தால் electricity சேமிக்கலாம், warranty யும் அதிகம் — smart choice.
"""

ENGLISH_STYLE_RULES = """
Always respond in English. Follow these tone and style rules:

PERSONA:
- You are a confident, warm V-Guard product expert — think enthusiastic showroom specialist, not a manual reader.
- Lead with what makes the product impressive. Build excitement before diving into details.
- Translate every spec into a real-world benefit for the customer.
  Example: Don't say "32W power consumption." Say "At just 32W, it costs a fraction of a regular fan to run — you'll feel the savings on your electricity bill every single month."
- Use vivid, persuasive language: "whisper-quiet", "engineered for all-day comfort", "designed to last", "works flawlessly even during voltage fluctuations."

STRUCTURE:
- Open with the product's biggest strength or most impressive claim.
- Then layer in supporting features — each tied to a customer benefit.
- Close naturally with the follow-up question (from the CLOSING RULE).
- Avoid robotic bullet-list recitation of specs. Flow like a conversation.

TONE RULES:
- Confident but not pushy. Informative but not dry.
- Use "you" to speak directly to the customer.
- Short, punchy sentences for impact. Vary sentence length.
- Never say "this product has" — say "what you get is" or "what makes it stand out is."
"""

LANGUAGE_INSTRUCTIONS = {
    "ta": TAMIL_STYLE_RULES,
    "en": ENGLISH_STYLE_RULES,
}

LENGTH_CONFIGS = {
    "short":  {"max_tokens": 150,  "instruction": "Keep your answer very brief — 2 to 3 sentences only. No lists."},
    "medium": {"max_tokens": 300,  "instruction": "Keep your answer concise — around 5 sentences. Avoid lengthy lists."},
    "long":   {"max_tokens": 600,  "instruction": "Provide a detailed, comprehensive answer."},
}


def _strip_markdown(text: str) -> str:
    """Remove markdown formatting so TTS reads clean text."""
    text = re.sub(r'\*\*(.*?)\*\*', r'\1', text)
    text = re.sub(r'\*(.*?)\*', r'\1', text)
    text = re.sub(r'#{1,6}\s+', '', text)
    text = re.sub(r'`{1,3}(.*?)`{1,3}', r'\1', text)
    text = re.sub(r'^\s*[-•]\s+', '', text, flags=re.MULTILINE)
    text = re.sub(r'^\s*\d+\.\s+', '', text, flags=re.MULTILINE)
    text = re.sub(r'\n{3,}', '\n\n', text)
    return text.strip()


# Common English words that appear before Tamil case suffixes.
# Pattern: word immediately followed by Tamil suffix (no space, with or without hyphen).
_TAMIL_SUFFIX_WORDS = [
    "fan", "fans", "motor", "motors", "inverter", "inverters", "remote",
    "coating", "warranty", "regulator", "timer", "sweep", "rating",
    "voltage", "speed", "blade", "blades", "bearing", "bearings",
    "model", "models", "product", "products", "feature", "features",
    "color", "colour", "finish",
]

# Tamil suffixes that should be separated by a space
_TAMIL_SUFFIXES = [
    "இல்", "ல்", "உடன்", "க்கு", "ஐ", "ஆல்", "இலிருந்து",
    "மூலம்", "போல்", "என்று", "என்பது", "உண்டு", "இல்லை",
]

def _fix_tamil_grammar(text: str) -> str:
    """
    Post-process Tamil LLM output to enforce style rules:
    1. English-word-hyphen-Tamil-suffix → English-word space Tamil-suffix
       e.g. "fan-ல்" → "fan இல்", "inverter-இல்" → "inverter இல்"
    2. English-word glued directly to Tamil suffix → add space
       e.g. "fanல்" → "fan ல்"
    3. Normalize common incorrect suffix forms after English words
       e.g. "fan-ல்" and "fanல்" both → "fan இல்"
    """
    # Step 1: Remove hyphen between English word and Tamil suffix
    # Covers: word-suffix and word - suffix
    text = re.sub(r'([A-Za-z0-9]+)\s*-\s*(இல்|ல்|உடன்|க்கு|ஐ|ஆல்|இலிருந்து|மூலம்)',
                  r'\1 \2', text)

    # Step 2: English word glued directly to Tamil suffix (no space, no hyphen)
    # e.g. "fanல்" → "fan ல்", "motorஐ" → "motor ஐ"
    text = re.sub(r'([A-Za-z0-9])(' + '|'.join(_TAMIL_SUFFIXES) + r')',
                  r'\1 \2', text)

    # Step 3: Normalize "ல்" after English words to "இல்" (more natural)
    # Only after known English words (preceded by a letter/digit then space)
    text = re.sub(r'([A-Za-z0-9]) ல்\b', r'\1 இல்', text)

    # Step 4: Fix "energy save ஆகும்" → "மின்சாரம் சேமிக்கலாம்"
    text = re.sub(r'energy\s+save\s+ஆகும்', 'மின்சாரம் சேமிக்கலாம்', text, flags=re.IGNORECASE)

    # Step 5: Fix "available ஆகும்" → "கிடைக்கும்"
    text = re.sub(r'available\s+ஆகும்', 'கிடைக்கும்', text, flags=re.IGNORECASE)

    # Step 6: Fix "work பண்ணும்" → "இயங்கும்"
    text = re.sub(r'work\s+பண்ணும்', 'இயங்கும்', text, flags=re.IGNORECASE)

    return text


def _build_prompt(context: list, language: str, response_length: str):
    """Build system message and length config shared by both LLM backends."""
    lang_instruction = LANGUAGE_INSTRUCTIONS.get(language, LANGUAGE_INSTRUCTIONS["en"])
    length_cfg = LENGTH_CONFIGS.get(response_length, LENGTH_CONFIGS["medium"])

    closing_instruction = CLOSING_INSTRUCTION_TA if language == "ta" else CLOSING_INSTRUCTION_EN
    system_message = (
        f"{BASE_ROLE} "
        f"{lang_instruction} "
        f"{length_cfg['instruction']} "
        f"{closing_instruction} "
        "Do not use markdown formatting — no asterisks, no bullet points, no headers. "
        "Write in plain conversational sentences."
    )

    if context:
        context_text = "\n\n".join(
            f"[Source: {c.get('source', 'Unknown')}]\n{c.get('text', '')}"
            for c in context
        )
        system_message += f"\n\nUse ONLY this context to answer:\n{context_text}"
    else:
        system_message += (
            "\n\nNo product context is available right now. "
            "Tell the user you could not find specific information and suggest they ask about V-Guard products."
        )

    return system_message, length_cfg


def _postprocess(text: str, language: str) -> str:
    result = _strip_markdown(text)
    if language == "ta":
        result = _fix_tamil_grammar(result)
    return result


_GROQ_MODELS = {
    "llama-3.3-70b-versatile": (0.000000590, 0.000000790),
    "llama-3.1-8b-instant":    (0.000000050, 0.000000080),
}

def generate(query: str, context: list, language: str, response_length: str = "medium", model: str = "gemini-2.0-flash") -> dict:
    """Generate an answer. model: 'gemini-2.0-flash' | 'llama-3.3-70b-versatile' | 'llama-3.1-8b-instant'"""
    settings = get_settings()
    system_message, length_cfg = _build_prompt(context, language, response_length)

    # ── Gemini 2.0 Flash (direct REST — no SDK, no httpx conflict) ───────────
    if model == "gemini-2.0-flash" and settings.gemini_api_key:
        try:
            payload = {
                "system_instruction": {"parts": [{"text": system_message}]},
                "contents": [{"parts": [{"text": query}]}],
                "generationConfig": {
                    "temperature": 0.7,
                    "maxOutputTokens": length_cfg["max_tokens"],
                },
            }
            t0 = time.perf_counter()
            resp = requests.post(
                _GEMINI_URL,
                params={"key": settings.gemini_api_key},
                json=payload,
                timeout=30,
            )
            duration_ms = int((time.perf_counter() - t0) * 1000)
            resp.raise_for_status()
            data = resp.json()
            raw_text = data["candidates"][0]["content"]["parts"][0]["text"]
            full_text = _postprocess(raw_text, language)
            usage_meta = data.get("usageMetadata", {})
            inp = usage_meta.get("promptTokenCount", 0)
            out = usage_meta.get("candidatesTokenCount", 0)
            cost = inp * 0.00000059 + out * 0.00000079
            logger.info(
                f"[LLM] Gemini 2.0 Flash | input={inp} output={out} tokens | {duration_ms}ms | cost=${cost:.6f}"
            )
            return {
                "text":          full_text,
                "input_tokens":  inp,
                "output_tokens": out,
                "model":         "gemini-2.0-flash",
                "duration_ms":   duration_ms,
            }
        except Exception as e:
            logger.warning(f"Gemini failed, falling back to Groq: {e}")

    # ── Groq (selected model or fallback) ────────────────────────────────────
    groq_model = model if model in _GROQ_MODELS else "llama-3.3-70b-versatile"
    rate_in, rate_out = _GROQ_MODELS[groq_model]
    try:
        groq_client = Groq(api_key=settings.groq_api_key)
        t0 = time.perf_counter()
        response = groq_client.chat.completions.create(
            model=groq_model,
            messages=[
                {"role": "system", "content": system_message},
                {"role": "user",   "content": query},
            ],
            temperature=0.7,
            max_tokens=length_cfg["max_tokens"],
        )
        duration_ms = int((time.perf_counter() - t0) * 1000)
        full_text = _postprocess(response.choices[0].message.content, language)
        usage = response.usage
        inp = usage.prompt_tokens     if usage else 0
        out = usage.completion_tokens if usage else 0
        cost = inp * rate_in + out * rate_out
        label = "fallback" if model == "gemini-2.0-flash" else "selected"
        logger.info(
            f"[LLM] Groq {groq_model} ({label}) | input={inp} output={out} tokens | {duration_ms}ms | cost=${cost:.6f}"
        )
        return {
            "text":          full_text,
            "input_tokens":  inp,
            "output_tokens": out,
            "model":         groq_model,
            "duration_ms":   duration_ms,
        }
    except Exception as e:
        logger.error(f"LLM generation failed: {e}")
        return {"text": "Sorry, I could not generate a response. Please try again.", "input_tokens": 0, "output_tokens": 0}
