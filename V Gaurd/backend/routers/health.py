from fastapi import APIRouter
from groq import Groq
from openai import OpenAI, RateLimitError as OpenAIRateLimitError
from google.cloud import texttospeech
from backend.config import get_settings

router = APIRouter()


@router.get("/health")
async def health_check():
    settings = get_settings()
    status = {"status": "healthy", "services": {}}

    # Check Groq (STT + LLM)
    try:
        client = Groq(api_key=settings.groq_api_key)
        client.models.list()
        status["services"]["groq"] = "healthy"
    except Exception as e:
        status["services"]["groq"] = f"error: {str(e)}"
        status["status"] = "unhealthy"

    # Check OpenAI (embeddings)
    try:
        openai_client = OpenAI(api_key=settings.openai_api_key)
        openai_client.embeddings.create(
            model="text-embedding-3-small",
            input="health check",
        )
        status["services"]["openai"] = "healthy"
    except OpenAIRateLimitError:
        status["services"]["openai"] = "⚠️ CREDITS DEPLETED - Add payment"
        status["status"] = "degraded"
    except Exception as e:
        status["services"]["openai"] = f"error: {str(e)}"
        status["status"] = "unhealthy"

    # Check Google Cloud TTS
    try:
        tts_client = texttospeech.TextToSpeechClient()
        tts_client.synthesize_speech(
            input=texttospeech.SynthesisInput(text="test"),
            voice=texttospeech.VoiceSelectionParams(
                language_code="en-IN",
                name="en-IN-Standard-D",
            ),
            audio_config=texttospeech.AudioConfig(
                audio_encoding=texttospeech.AudioEncoding.MP3
            ),
        )
        status["services"]["google_tts"] = "healthy"
    except Exception as e:
        status["services"]["google_tts"] = f"⚠️ {str(e)}"
        status["status"] = "degraded"

    return status
