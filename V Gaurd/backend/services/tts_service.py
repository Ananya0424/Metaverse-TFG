import os
import time
import uuid
from google.cloud import texttospeech
from backend.config import get_settings
from backend.utils.logger import logger

VOICE_MAP = {
    "ta": {
        "Chirp3-HD": {"language_code": "ta-IN", "name": "ta-IN-Wavenet-D"},   # male (Chirp3-HD names unverified for ta-IN)
        "Neural2":   {"language_code": "ta-IN", "name": "ta-IN-Wavenet-B"},   # male
        "Standard":  {"language_code": "ta-IN", "name": "ta-IN-Standard-B"},  # male
    },
    "en": {
        "Chirp3-HD": {"language_code": "en-IN", "name": "en-IN-Neural2-B"},   # male (Neural2-B confirmed male for en-IN)
        "Neural2":   {"language_code": "en-IN", "name": "en-IN-Neural2-B"},   # male
        "Standard":  {"language_code": "en-IN", "name": "en-IN-Standard-B"},  # male
    },
}

AUDIO_OUTPUT_DIR = os.path.join(
    os.path.dirname(__file__), "..", "..", "frontend", "static", "audio"
)


def synthesize(text: str, language: str, tts_quality: str = "Chirp3-HD") -> dict:
    """Convert text to speech and save as MP3. tts_quality: Chirp3-HD | Neural2 | Standard"""
    lang_voices = VOICE_MAP.get(language, VOICE_MAP["en"])
    voice_config = lang_voices.get(tts_quality, lang_voices["Chirp3-HD"])

    os.makedirs(AUDIO_OUTPUT_DIR, exist_ok=True)

    try:
        from google.api_core.client_options import ClientOptions
        settings = get_settings()
        client_opts = ClientOptions(api_key=settings.google_tts_api_key) if settings.google_tts_api_key else None
        client = texttospeech.TextToSpeechClient(client_options=client_opts)

        synthesis_input = texttospeech.SynthesisInput(text=text)
        voice = texttospeech.VoiceSelectionParams(
            language_code=voice_config["language_code"],
            name=voice_config["name"],
            # SSML gender not used when voice name is explicitly specified
            ssml_gender=texttospeech.SsmlVoiceGender.SSML_VOICE_GENDER_UNSPECIFIED,
        )
        audio_config = texttospeech.AudioConfig(
            audio_encoding=texttospeech.AudioEncoding.MP3
        )

        t0 = time.perf_counter()
        response = client.synthesize_speech(
            input=synthesis_input,
            voice=voice,
            audio_config=audio_config,
        )
        duration_ms = int((time.perf_counter() - t0) * 1000)

        filename = f"{uuid.uuid4()}.mp3"
        file_path = os.path.join(AUDIO_OUTPUT_DIR, filename)
        with open(file_path, "wb") as f:
            f.write(response.audio_content)

        chars = len(text)
        voice_name = voice_config["name"]
        # Rate per character: Chirp3-HD=$0.000030, Standard=$0.000004
        if "Chirp3-HD" in voice_name:
            rate = 0.000030
        elif "Studio" in voice_name:
            rate = 0.000160
        elif "Neural2" in voice_name or "Wavenet" in voice_name:
            rate = 0.000016
        else:
            rate = 0.000004  # Standard
        cost = chars * rate
        logger.info(
            f"[TTS] Google {voice_name} | chars={chars} | {duration_ms}ms | cost=${cost:.6f}"
        )
        return {
            "audio_url":   f"/static/audio/{filename}",
            "tts_chars":   chars,
            "tts_voice":   voice_name,
            "duration_ms": duration_ms,
        }

    except Exception as e:
        logger.error(f"TTS synthesis failed: {e}")
        raise
