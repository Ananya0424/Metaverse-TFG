from langdetect import detect, LangDetectException
from backend.utils.logger import logger

# Only Tamil and English supported — all other detections fall back to English
SUPPORTED_LANGUAGES = {"en", "ta"}


def detect_language(text: str) -> str:
    """Detect language of input text. Returns 'ta' or 'en' only."""
    if not text or not text.strip():
        return "en"
    try:
        lang = detect(text)
        if lang in SUPPORTED_LANGUAGES:
            return lang
        return "en"
    except LangDetectException:
        logger.warning("Language detection failed, defaulting to 'en'")
        return "en"
