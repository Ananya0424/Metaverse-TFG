import re
import time
from groq import Groq
from backend.config import get_settings
from backend.utils.logger import logger


def clean_transcript(text: str) -> str:
    """Fix STT misinterpretations: brand name variants and Tamil phonetic
    spellings of common English product terms."""

    # ── 1. V-Guard brand name corrections ────────────────────────────────────
    vguard_variants = [
        r'\bwe\s*guard\b', r'\bwe\s*god\b', r'\bv\s*god\b', r'\bb\s*guard\b',
        r'\bvigard\b', r'\bvee\s*guard\b', r'\bv\s*yard\b', r'\bv\s*card\b',
        r'\bbee\s*guard\b', r'\bvegard\b', r'\bvigar\b', r'\bvigaard\b',
        r'\bwe\s*gard\b', r'\bv\s*gard\b', r'\bvieguard\b', r'\bv\s*guard\b',
        r'\bwee\s*guard\b', r'\bwee\s*gard\b', r'\bthe\s*guard\b', r'\bdi\s*guard\b',
        r'\bவி\s*கார்டு\b', r'\bவிகார்டு\b', r'\bவீ\s*கார்டு\b',
        r'\bவிகார்ட்\b', r'\bவி\s*காட்\b', r'\bவி\s*கார்ட்\b',
        r'\bvee\s*kaadu\b', r'\bvi\s*kaad\b', r'\bvi\s*kard\b',
    ]
    text = re.compile('|'.join(vguard_variants), re.IGNORECASE).sub('V-Guard', text)

    # ── 2. Tamil phonetic → English product terms ─────────────────────────────
    # Each tuple: (compiled_pattern, replacement)
    tamil_to_english = [
        # product / products
        (re.compile(r'பிராடுக்[டட்][்ஸஸ்]*[யா]?', re.IGNORECASE), 'product'),
        (re.compile(r'ப்ரொடக்[டட்][்ஸஸ்]*[யா]?', re.IGNORECASE), 'product'),
        (re.compile(r'ப்ராடக்[டட்][்ஸஸ்]*[யா]?', re.IGNORECASE), 'product'),

        # category / categories
        (re.compile(r'கேட்டக்கிரி[ஸ்லாம்]*', re.IGNORECASE), 'category'),
        (re.compile(r'கேட்டகிரி[ஸ்]*', re.IGNORECASE), 'category'),
        (re.compile(r'கேட்டகரி[ஸ்]*', re.IGNORECASE), 'category'),
        (re.compile(r'கட்டகிரி[ஸ்]*', re.IGNORECASE), 'category'),

        # fan / fans
        (re.compile(r'ஃபேன்[ஸ்]*\b', re.IGNORECASE), 'fan'),
        (re.compile(r'பேன்[ஸ்]*\b', re.IGNORECASE), 'fan'),

        # ceiling
        (re.compile(r'சீலிங்[்கு]*', re.IGNORECASE), 'ceiling'),
        (re.compile(r'சீலின்[க்கு]*', re.IGNORECASE), 'ceiling'),

        # BLDC
        (re.compile(r'பி\.எல்\.டி\.சி\.?', re.IGNORECASE), 'BLDC'),
        (re.compile(r'பிஎல்டிசி', re.IGNORECASE), 'BLDC'),

        # motor
        (re.compile(r'மோட்டார்', re.IGNORECASE), 'motor'),
        (re.compile(r'மோட்டர்', re.IGNORECASE), 'motor'),

        # inverter
        (re.compile(r'இன்வெர்ட்டர்', re.IGNORECASE), 'inverter'),
        (re.compile(r'இன்வர்ட்டர்', re.IGNORECASE), 'inverter'),

        # remote
        (re.compile(r'ரிமோட்[்டு]*', re.IGNORECASE), 'remote'),

        # warranty
        (re.compile(r'வாரண்டி', re.IGNORECASE), 'warranty'),
        (re.compile(r'வாரன்டி', re.IGNORECASE), 'warranty'),

        # voltage
        (re.compile(r'வோல்டேஜ்', re.IGNORECASE), 'voltage'),
        (re.compile(r'வோல்ட்டேஜ்', re.IGNORECASE), 'voltage'),

        # model / models
        (re.compile(r'மாடல்[்ஸ்]*', re.IGNORECASE), 'model'),

        # price
        (re.compile(r'பிரைஸ்', re.IGNORECASE), 'price'),

        # rating
        (re.compile(r'ரேட்டிங்[்கு]*', re.IGNORECASE), 'rating'),

        # feature / features
        (re.compile(r'ஃபீச்சர்[ஸ்]*', re.IGNORECASE), 'feature'),
        (re.compile(r'பீச்சர்[ஸ்]*', re.IGNORECASE), 'feature'),

        # specification / specifications
        (re.compile(r'ஸ்பெசிஃபிகேஷன்[ஸ்]*', re.IGNORECASE), 'specification'),
        (re.compile(r'ஸ்பெஸிஃபிகேஷன்[ஸ்]*', re.IGNORECASE), 'specification'),
    ]

    for pattern, replacement in tamil_to_english:
        text = pattern.sub(replacement, text)

    return text

def transcribe(audio_file_path: str, language: str = None, model: str = "whisper-large-v3") -> str:
    """Transcribe audio file to text using Groq Whisper large-v3.
    Pass language (ISO 639-1) to improve accuracy; None = auto-detect.
    """
    settings = get_settings()
    client = Groq(api_key=settings.groq_api_key)
    try:
        t0 = time.perf_counter()
        with open(audio_file_path, "rb") as audio_file:
            params = dict(
                model=model,
                file=("recording.webm", audio_file, "audio/webm"),
                prompt=(
                    "V-Guard, BLDC fan, ceiling fan, product, category, product category, "
                    "motor, inverter, remote, voltage, warranty, model, price, rating, "
                    "feature, specification, sweep, RPM, wattage, coating, regulator, timer, "
                    "INSIGHT-G, ENVIRO, GLADO, FINESTA, AIRHEW, ROMANZA, HUSHER, VEEMAGIK, "
                    "konjam product category solla mudiyuma, "
                    "BLDC fan price enna, ceiling fan specifications, "
                    "inverter il enga neram, warranty ethanai varusham, "
                    "product category ellam solunga, fan models list pannga."
                )
            )
            if language and language != "auto":
                params["language"] = language
            transcription = client.audio.transcriptions.create(**params)
        
        duration_ms = int((time.perf_counter() - t0) * 1000)
        cleaned_text = clean_transcript(transcription.text)
        logger.info(
            f"[STT] Groq {model} | chars_out={len(cleaned_text)} | {duration_ms}ms | cost=$0.000000 (free)"
        )
        return {"text": cleaned_text, "duration_ms": duration_ms}
    except Exception as e:
        logger.error(f"STT transcription failed: {e}")
        return ""
