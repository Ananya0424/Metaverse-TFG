from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from openai import RateLimitError as OpenAIRateLimitError
from backend.services import language_detector, rag_service, llm_service, tts_service
from backend.utils.logger import logger

router = APIRouter()

WELCOME_TEXT_TA = (
    "வணக்கம்! நான் உங்கள் V-Guard assistant. "
    "V-Guard தயாரிப்புகள் பற்றி எந்த கேள்வியும் கேளுங்கள்."
)
WELCOME_TEXT_EN = (
    "Welcome! I'm your V-Guard Assistant. "
    "Feel free to ask me anything about V-Guard products."
)


@router.get("/welcome")
async def welcome(language: str = "ta", tts_quality: str = "Chirp3-HD"):
    """Return a TTS welcome message. Called once on page load."""
    try:
        text = WELCOME_TEXT_TA if language == "ta" else WELCOME_TEXT_EN
        tts_result = tts_service.synthesize(text, language, tts_quality=tts_quality)
        return {
            "response_text": text,
            "audio_url": tts_result["audio_url"],
            "language": language,
        }
    except Exception as e:
        logger.error(f"Welcome TTS failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))


class TextQueryRequest(BaseModel):
    query: str
    language: str = "auto"
    response_length: str = "medium"
    llm_model: str = "gemini-2.0-flash"
    tts_quality: str = "Chirp3-HD"


@router.post("/text-query")
async def text_query(request: TextQueryRequest):
    try:
        # Detect language
        if request.language == "auto" or not request.language:
            detected_language = language_detector.detect_language(request.query)
        else:
            detected_language = request.language

        # RAG retrieval with fallback
        warning = None
        try:
            context = rag_service.retrieve(request.query, detected_language)
        except OpenAIRateLimitError:
            logger.error("OpenAI credits depleted — falling back to no context")
            context = []
            warning = "RAG unavailable — OpenAI credits depleted"

        # LLM generation
        llm_result = llm_service.generate(request.query, context, detected_language, request.response_length, model=request.llm_model)
        response_text = llm_result["text"]

        # TTS synthesis with fallback
        audio_url = None
        tts_chars = 0
        tts_voice = None
        tts_ms    = 0
        try:
            tts_result = tts_service.synthesize(response_text, detected_language, tts_quality=request.tts_quality)
            audio_url = tts_result["audio_url"]
            tts_chars = tts_result["tts_chars"]
            tts_voice = tts_result["tts_voice"]
            tts_ms    = tts_result["duration_ms"]
        except Exception as e:
            logger.error(f"TTS failed: {e} — returning text only")
            warning = (warning or "") + " Audio unavailable — TTS failed"

        return {
            "transcript": request.query,
            "response_text": response_text,
            "audio_url": audio_url,
            "detected_language": detected_language,
            "warning": warning,
            "usage": {
                "llm_input_tokens":  llm_result["input_tokens"],
                "llm_output_tokens": llm_result["output_tokens"],
                "tts_chars":         tts_chars,
                "tts_voice":         tts_voice,
                "timing": {
                    "stt_ms": 0,
                    "llm_ms": llm_result.get("duration_ms", 0),
                    "tts_ms": tts_ms,
                },
            },
        }

    except Exception as e:
        logger.error(f"Text query error: {e}")
        raise HTTPException(status_code=500, detail=str(e))
