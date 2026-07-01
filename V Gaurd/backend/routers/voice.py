import os
import tempfile
from fastapi import APIRouter, HTTPException, UploadFile, File, Form
from openai import RateLimitError as OpenAIRateLimitError
from backend.services import stt_service, language_detector, rag_service, llm_service, tts_service
from backend.utils.logger import logger

router = APIRouter()


@router.post("/voice-query")
async def voice_query(
    audio: UploadFile = File(...),
    language: str = Form(default="auto"),
    response_length: str = Form(default="medium"),
    stt_model: str = Form(default="whisper-large-v3"),
    llm_model: str = Form(default="gemini-2.0-flash"),
    tts_quality: str = Form(default="Chirp3-HD"),
):
    tmp_path = None
    try:
        # Save uploaded audio to temp file
        suffix = os.path.splitext(audio.filename or "audio.webm")[1] or ".webm"
        with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
            tmp.write(await audio.read())
            tmp_path = tmp.name

        # STT transcription — pass selected language so Whisper uses it directly
        stt_lang = None if (language == "auto" or not language) else language
        stt_result = stt_service.transcribe(tmp_path, language=stt_lang, model=stt_model)
        transcript = stt_result["text"]
        stt_ms = stt_result["duration_ms"]
        if not transcript:
            raise HTTPException(status_code=422, detail="Could not transcribe audio")

        # Language: use selection if explicit, otherwise auto-detect from transcript
        if stt_lang:
            detected_language = stt_lang
        else:
            detected_language = language_detector.detect_language(transcript)

        # RAG retrieval with fallback
        warning = None
        try:
            context = rag_service.retrieve(transcript, detected_language)
        except OpenAIRateLimitError:
            logger.error("OpenAI credits depleted — falling back to no context")
            context = []
            warning = "RAG unavailable — OpenAI credits depleted"

        # LLM generation
        llm_result = llm_service.generate(transcript, context, detected_language, response_length, model=llm_model)
        response_text = llm_result["text"]

        # TTS synthesis with fallback
        audio_url = None
        tts_chars = 0
        tts_voice = None
        tts_ms = 0
        try:
            tts_result = tts_service.synthesize(response_text, detected_language, tts_quality=tts_quality)
            audio_url = tts_result["audio_url"]
            tts_chars = tts_result["tts_chars"]
            tts_voice = tts_result["tts_voice"]
            tts_ms    = tts_result["duration_ms"]
        except Exception as e:
            logger.error(f"TTS failed: {e} — returning text only")
            warning = (warning or "") + " Audio unavailable — TTS failed"

        sources = [
            {"source": c.get("source", ""), "source_type": c.get("source_type", "")}
            for c in context
        ]

        return {
            "transcript": transcript,
            "response_text": response_text,
            "audio_url": audio_url,
            "detected_language": detected_language,
            "sources": sources,
            "warning": warning,
            "usage": {
                "llm_input_tokens":  llm_result["input_tokens"],
                "llm_output_tokens": llm_result["output_tokens"],
                "tts_chars":         tts_chars,
                "tts_voice":         tts_voice,
                "timing": {
                    "stt_ms": stt_ms,
                    "llm_ms": llm_result.get("duration_ms", 0),
                    "tts_ms": tts_ms,
                },
            },
        }

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Voice query error: {e}")
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        if tmp_path and os.path.exists(tmp_path):
            os.remove(tmp_path)
