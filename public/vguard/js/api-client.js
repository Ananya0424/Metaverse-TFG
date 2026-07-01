import { API_BASE_URL } from './config.js';

export class APIClient {
  async sendVoiceQuery(audioBlob, language = 'auto', responseLength = 'medium', modelPrefs = {}) {
    const cleanBlob = new Blob([audioBlob], { type: 'audio/webm' });
    const formData = new FormData();
    formData.append('audio', cleanBlob, 'recording.webm');
    formData.append('language', language);
    formData.append('response_length', responseLength);
    formData.append('stt_model',   modelPrefs.stt  || 'whisper-large-v3');
    formData.append('llm_model',   modelPrefs.llm  || 'gemini-2.0-flash');
    formData.append('tts_quality', modelPrefs.tts  || 'Chirp3-HD');

    const response = await fetch(`${API_BASE_URL}/api/training/voice-query`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({ detail: response.statusText }));
      throw new Error(err.detail || 'Voice query failed');
    }
    return response.json();
  }

  async sendTextQuery(text, language = 'auto', responseLength = 'medium', modelPrefs = {}) {
    const response = await fetch(`${API_BASE_URL}/api/training/text-query`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: text,
        language,
        response_length: responseLength,
        llm_model:   modelPrefs.llm || 'gemini-2.0-flash',
        tts_quality: modelPrefs.tts || 'Chirp3-HD',
      }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({ detail: response.statusText }));
      throw new Error(err.detail || 'Text query failed');
    }
    return response.json();
  }
}
