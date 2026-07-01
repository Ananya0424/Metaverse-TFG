import { AvatarLoader } from './avatar-loader.js';
import { ChatInterface } from './chat-interface.js';
import { VoiceRecorder } from './voice-recorder.js';
import { APIClient } from './api-client.js';
import { API_BASE_URL, AVATAR_MODELS } from './config.js';

// ── Pricing rates (paid tier — used for max-cost planning) ───────────────────
// Gemini 2.0 Flash: free up to 1,500 req/day; paid rates shown when over limit
const RATES = {
  llm_input:  0.000000075,  // Gemini 2.0 Flash  $0.075 / 1M tokens
  llm_output: 0.000000300,  // Gemini 2.0 Flash  $0.30  / 1M tokens
  tts: {
    'Chirp3-HD': 0.000030,  // Google Chirp 3 HD  $30 / 1M chars
    'Neural2':   0.000016,  // Google Neural2     $16 / 1M chars
    'Wavenet':   0.000016,  // Google WaveNet     $16 / 1M chars
    'Studio':    0.000160,  // Google Studio     $160 / 1M chars
    'Standard':  0.000004,  // Google Standard     $4 / 1M chars
    'default':   0.000016,
  },
};

const GEMINI_FREE_LIMIT  = 1500;
const DAILY_KEY          = 'vguard_daily_usage';
const MODEL_PREFS_KEY    = 'vguard_model_prefs';
const LANG_KEY           = 'vguard_language';

const MODEL_OPTIONS = {
  stt: [
    { val: 'whisper-large-v3',       label: 'Whisper v3',  note: 'Best accuracy' },
    { val: 'whisper-large-v3-turbo', label: 'Turbo',       note: 'Faster' },
  ],
  llm: [
    { val: 'gemini-2.0-flash',        label: 'Gemini Flash', note: 'Free 1500/day' },
    { val: 'llama-3.3-70b-versatile', label: 'Llama 3.3',   note: 'Free' },
    { val: 'llama-3.1-8b-instant',    label: 'Llama 8B',    note: 'Fastest' },
  ],
  tts: [
    { val: 'Chirp3-HD', label: 'Chirp HD',  note: '$$$' },
    { val: 'Neural2',   label: 'Neural2',   note: '$$'  },
    { val: 'Standard',  label: 'Standard',  note: '$'   },
  ],
};

function loadModelPrefs() {
  try {
    const raw = localStorage.getItem(MODEL_PREFS_KEY);
    if (raw) return JSON.parse(raw);
  } catch (_) {}
  return { stt: 'whisper-large-v3', llm: 'gemini-2.0-flash', tts: 'Chirp3-HD' };
}

function saveModelPrefs(prefs) {
  try { localStorage.setItem(MODEL_PREFS_KEY, JSON.stringify(prefs)); } catch (_) {}
}

function _ttsRate(voiceName) {
  if (!voiceName) return RATES.tts['default'];
  for (const [key, rate] of Object.entries(RATES.tts)) {
    if (key !== 'default' && voiceName.includes(key)) return rate;
  }
  return RATES.tts['default'];
}

// ── localStorage daily tracker ───────────────────────────────────────────────

function _todayStr() {
  return new Date().toISOString().slice(0, 10);   // "2026-04-20"
}

function _freshDaily() {
  return {
    date:              _todayStr(),
    gemini_requests:   0,
    groq_requests:     0,
    stt_requests:      0,
    llm_input_tokens:  0,
    llm_output_tokens: 0,
    tts_chars:         0,
    tts_cost:          0,
    llm_cost:          0,
    total_cost:        0,
    // timing
    call_count:        0,
    stt_ms_total:      0,
    llm_ms_total:      0,
    tts_ms_total:      0,
    last_stt_ms:       0,
    last_llm_ms:       0,
    last_tts_ms:       0,
  };
}

function _msLabel(ms) {
  return ms >= 1000 ? `${(ms / 1000).toFixed(1)}s` : `${ms}ms`;
}

function loadDaily() {
  try {
    const raw = localStorage.getItem(DAILY_KEY);
    if (raw) {
      const d = JSON.parse(raw);
      if (d.date === _todayStr()) return d;
    }
  } catch (_) {}
  return _freshDaily();
}

function saveDaily(d) {
  try { localStorage.setItem(DAILY_KEY, JSON.stringify(d)); } catch (_) {}
}

function resetDaily() {
  saveDaily(_freshDaily());
}

// ── Main app ─────────────────────────────────────────────────────────────────

class VGuardAssistant {
  constructor() {
    this.currentLanguage = 'ta';
    this.isRecording     = false;
    this.isProcessing    = false;
    this._avatarIndex    = 0;

    this.avatar   = new AvatarLoader('avatar-container');
    this.chat     = new ChatInterface('chat-messages');
    this.recorder = new VoiceRecorder();
    this.api      = new APIClient();

    this._currentAudio = null;
  }

  init() {
    this.avatar.init();           // start Three.js loading immediately
    this._renderDailyPanel();
    this._startMidnightWatcher();

    // Always show language modal on startup so user can confirm/change
    const saved = localStorage.getItem(LANG_KEY);
    if (saved) this.currentLanguage = saved;
    this._showLangModal();
  }

  _showLangModal() {
    const modal = document.getElementById('lang-modal');
    modal.classList.remove('hidden');

    // Pre-highlight last saved language
    const saved = localStorage.getItem(LANG_KEY);
    if (saved) {
      modal.querySelectorAll('.lang-choice-btn.available').forEach((b) => {
        b.classList.toggle('selected', b.dataset.lang === saved);
      });
    }

    modal.querySelectorAll('.lang-choice-btn.available').forEach((btn) => {
      btn.addEventListener('click', () => {
        this.currentLanguage = btn.dataset.lang;
        localStorage.setItem(LANG_KEY, this.currentLanguage);
        modal.classList.add('hidden');
        this._syncLangButtons();
        this._beginAfterLang();
      }, { once: true });
    });
  }

  _beginAfterLang() {
    this.avatar.onReady(() => {
      this.avatar.loadExternalAnimation(
        '/models/animations/F_Standing_Idle_001.glb',
        'idle',
        () => this.avatar._playAnimation('idle')
      );
      this.avatar.loadExternalAnimation(
        '/models/animations/F_Talking_Variations_001.glb',
        'Talking1'
      );
      this._playWelcome();
    });
    this._bindEvents();
  }

  _syncLangButtons() {
    document.querySelectorAll('.lang-btn').forEach((btn) => {
      btn.classList.toggle('active', btn.dataset.lang === this.currentLanguage);
    });
  }

  // ── Daily usage ────────────────────────────────────────────────────────────

  _addUsage(usage, isStt = false) {
    const d = loadDaily();

    if (isStt) {
      d.stt_requests += 1;
    }

    if (usage) {
      const inp   = usage.llm_input_tokens  || 0;
      const out   = usage.llm_output_tokens || 0;
      const chars = usage.tts_chars         || 0;
      const t     = usage.timing            || {};

      const totalReq = d.gemini_requests + d.groq_requests;
      const llmCost  = totalReq >= GEMINI_FREE_LIMIT
        ? inp * RATES.llm_input + out * RATES.llm_output : 0;
      const ttsCost  = chars * _ttsRate(usage.tts_voice);

      d.gemini_requests   += 1;
      d.llm_input_tokens  += inp;
      d.llm_output_tokens += out;
      d.tts_chars         += chars;
      d.tts_cost          += ttsCost;
      d.llm_cost          += llmCost;
      d.total_cost        += llmCost + ttsCost;

      // timing
      d.call_count   += 1;
      d.stt_ms_total += t.stt_ms || 0;
      d.llm_ms_total += t.llm_ms || 0;
      d.tts_ms_total += t.tts_ms || 0;
      d.last_stt_ms   = t.stt_ms || 0;
      d.last_llm_ms   = t.llm_ms || 0;
      d.last_tts_ms   = t.tts_ms || 0;
    }

    saveDaily(d);
    this._renderDailyPanel(d);
  }

  _renderDailyPanel(d = loadDaily()) {
    const totalReq  = d.gemini_requests + d.groq_requests;
    const remaining = Math.max(0, GEMINI_FREE_LIMIT - totalReq);
    const totalTok  = d.llm_input_tokens + d.llm_output_tokens;
    const overLimit = totalReq >= GEMINI_FREE_LIMIT;

    const n    = d.call_count || 1;
    const avgStt = d.stt_ms_total / n;
    const avgLlm = d.llm_ms_total / n;
    const avgTts = d.tts_ms_total / n;
    const lastTotal = d.last_stt_ms + d.last_llm_ms + d.last_tts_ms;
    const avgTotal  = avgStt + avgLlm + avgTts;

    _setText('d-llm-req',    `${totalReq.toLocaleString()} / ${GEMINI_FREE_LIMIT.toLocaleString()} req`);
    _setText('d-llm-tokens', `${totalTok.toLocaleString()} tokens`);
    _setText('d-llm-cost',   overLimit ? `$${d.llm_cost.toFixed(6)}` : '$0.000000');
    _setText('d-llm-speed',  d.call_count ? `${_msLabel(d.last_llm_ms)} · avg ${_msLabel(avgLlm)}` : '—');
    _setText('d-stt-req',    `${d.stt_requests} req`);
    _setText('d-stt-speed',  d.stt_requests ? `${_msLabel(d.last_stt_ms)} · avg ${_msLabel(avgStt)}` : '—');
    _setText('d-tts-chars',  `${d.tts_chars.toLocaleString()} chars`);
    _setText('d-tts-cost',   `$${d.tts_cost.toFixed(6)}`);
    _setText('d-tts-speed',  d.call_count ? `${_msLabel(d.last_tts_ms)} · avg ${_msLabel(avgTts)}` : '—');
    _setText('d-total',      `$${d.total_cost.toFixed(6)}`);
    _setText('d-total-speed', d.call_count
      ? `Last ${_msLabel(lastTotal)} · avg ${_msLabel(avgTotal)}` : '');
    _setText('d-remaining',  remaining > 0
      ? `${remaining.toLocaleString()} free req remaining`
      : `Free limit reached — paying $${(RATES.llm_input * 1000 + RATES.llm_output * 200).toFixed(6)}/req`
    );

    const badge = document.getElementById('d-llm-badge');
    if (badge) {
      if (overLimit) {
        badge.textContent = 'PAID';
        badge.className   = 'ds-badge ds-paid';
      } else {
        badge.textContent = 'FREE';
        badge.className   = 'ds-badge ds-free';
      }
    }
  }

  _initModelToggles() {
    const prefs = loadModelPrefs();
    document.querySelectorAll('.model-toggles').forEach((group) => {
      const prefKey = group.dataset.pref;
      if (!prefKey) return;
      // mark active
      group.querySelectorAll('.model-btn').forEach((btn) => {
        btn.classList.toggle('active', btn.dataset.val === prefs[prefKey]);
        btn.addEventListener('click', () => {
          const updated = loadModelPrefs();
          updated[prefKey] = btn.dataset.val;
          saveModelPrefs(updated);
          group.querySelectorAll('.model-btn').forEach((b) => b.classList.remove('active'));
          btn.classList.add('active');
        });
      });
    });
  }

  _startMidnightWatcher() {
    setInterval(() => {
      const d = loadDaily();
      if (d.date !== _todayStr()) {
        resetDaily();
        this._renderDailyPanel();
      }
    }, 60_000);   // check every minute
  }

  // ── Welcome ────────────────────────────────────────────────────────────────

  async _playWelcome() {
    try {
      const prefs = loadModelPrefs();
      const res = await fetch(
        `${API_BASE_URL}/api/welcome?language=${this.currentLanguage}&tts_quality=${prefs.tts || 'Chirp3-HD'}`
      );
      if (!res.ok) return;
      const data = await res.json();
      if (data.audio_url) {
        this.chat.addMessage(data.response_text, 'bot');
        this._playAudio(data.audio_url);
      }
    } catch (_) {}
  }

  _getResponseLength() {
    return document.getElementById('length-select').value;
  }

  // ── Events ─────────────────────────────────────────────────────────────────

  _bindEvents() {
    document.querySelectorAll('.lang-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.lang-btn').forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        this.currentLanguage = btn.dataset.lang;
        localStorage.setItem(LANG_KEY, this.currentLanguage);
      });
    });

    document.getElementById('stop-btn').addEventListener('click', () => this._stopAudio());

    document.getElementById('avatar-toggle-btn').addEventListener('click', () => {
      const btn = document.getElementById('avatar-toggle-btn');
      if (btn.classList.contains('switching')) return;
      this._avatarIndex = (this._avatarIndex + 1) % AVATAR_MODELS.length;
      const next = AVATAR_MODELS[this._avatarIndex];
      btn.classList.add('switching');
      btn.title = `Switching to ${next.label}...`;
      this._stopAudio();
      this.avatar.switchAvatar(next.path, () => {
        this.avatar.loadExternalAnimation('/models/animations/F_Standing_Idle_001.glb', 'idle',
          () => this.avatar._playAnimation('idle'));
        this.avatar.loadExternalAnimation('/models/animations/F_Talking_Variations_001.glb', 'Talking1');
        btn.classList.remove('switching');
        btn.title = `Switch avatar (${AVATAR_MODELS[(this._avatarIndex + 1) % AVATAR_MODELS.length].label} next)`;
      });
    });

    document.getElementById('usage-settings-btn').addEventListener('click', () => {
      this._renderDailyPanel();
      document.getElementById('usage-modal').classList.remove('hidden');
    });

    document.getElementById('usage-modal-close').addEventListener('click', () => {
      document.getElementById('usage-modal').classList.add('hidden');
    });

    document.getElementById('usage-modal').addEventListener('click', (e) => {
      if (e.target === e.currentTarget)
        document.getElementById('usage-modal').classList.add('hidden');
    });

    document.getElementById('reset-daily-btn').addEventListener('click', () => {
      resetDaily();
      this._renderDailyPanel();
    });

    document.getElementById('change-lang-btn').addEventListener('click', () => {
      document.getElementById('usage-modal').classList.add('hidden');
      localStorage.removeItem(LANG_KEY);
      this._showLangModal();
    });

    this._initModelToggles();

    const micBtn = document.getElementById('mic-btn');
    micBtn.addEventListener('mousedown', (e) => { e.preventDefault(); this._startRecording(); });
    micBtn.addEventListener('mouseup',   () => this._stopRecording());
    micBtn.addEventListener('mouseleave',() => { if (this.isRecording) this._stopRecording(); });
    micBtn.addEventListener('touchstart',(e) => { e.preventDefault(); this._startRecording(); }, { passive: false });
    micBtn.addEventListener('touchend',  () => this._stopRecording());

    document.getElementById('send-btn').addEventListener('click', () => this._sendText());
    document.getElementById('text-input').addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); this._sendText(); }
    });
  }

  // ── Voice recording ────────────────────────────────────────────────────────

  async _startRecording() {
    if (this.isRecording || this.isProcessing) return;
    try {
      await this.recorder.start();
      this.isRecording = true;
      document.getElementById('mic-btn').classList.add('recording');
      this._setStatus('Listening...', 'listening');
    } catch (err) {
      this.chat.addMessage(`Microphone error: ${err.message}`, 'bot');
    }
  }

  async _stopRecording() {
    if (!this.isRecording) return;
    this.isRecording = false;
    document.getElementById('mic-btn').classList.remove('recording');

    try {
      const audioBlob = await this.recorder.stop();
      if (audioBlob.size < 1500) {
        this._setStatus('Ready');
        this.chat.addMessage('Recording too short — hold the mic button while speaking.', 'bot');
        return;
      }
      await this._processVoice(audioBlob);
    } catch (err) {
      this._setStatus('Ready');
      this.chat.addMessage(`Recording error: ${err.message}`, 'bot');
    }
  }

  async _processVoice(audioBlob) {
    this.isProcessing = true;
    this._setStatus('Processing...', 'processing');
    this.chat.showTyping();

    try {
      const data = await this.api.sendVoiceQuery(audioBlob, this.currentLanguage, this._getResponseLength(), loadModelPrefs());
      this.chat.hideTyping();

      if (data.transcript)    this.chat.addMessage(data.transcript, 'user');
      if (data.response_text) this.chat.addMessage(data.response_text, 'bot');
      if (data.warning)       this.chat.addWarning(data.warning);
      if (data.audio_url)     this._playAudio(data.audio_url);

      // Track STT + LLM/TTS usage
      this._addUsage(data.usage || null, true);
    } catch (err) {
      this.chat.hideTyping();
      this.chat.addMessage(`Error: ${err.message}`, 'bot');
    } finally {
      this.isProcessing = false;
      this._setStatus('Ready');
    }
  }

  // ── Text query ─────────────────────────────────────────────────────────────

  async _sendText() {
    const input = document.getElementById('text-input');
    const text  = input.value.trim();
    if (!text || this.isProcessing) return;

    input.value = '';
    this.chat.addMessage(text, 'user');
    this.isProcessing = true;
    this._setStatus('Processing...', 'processing');
    this.chat.showTyping();

    try {
      const data = await this.api.sendTextQuery(text, this.currentLanguage, this._getResponseLength(), loadModelPrefs());
      this.chat.hideTyping();

      if (data.response_text) this.chat.addMessage(data.response_text, 'bot');
      if (data.warning)       this.chat.addWarning(data.warning);
      if (data.audio_url)     this._playAudio(data.audio_url);

      this._addUsage(data.usage || null, false);
    } catch (err) {
      this.chat.hideTyping();
      this.chat.addMessage(`Error: ${err.message}`, 'bot');
    } finally {
      this.isProcessing = false;
      this._setStatus('Ready');
    }
  }

  // ── Audio playback ─────────────────────────────────────────────────────────

  _playAudio(audioUrl) {
    this._stopAudio();
    const audio = new Audio();
    audio.preload = 'auto';
    this._currentAudio = audio;

    const stopBtn = document.getElementById('stop-btn');
    stopBtn.classList.remove('hidden');

    audio.addEventListener('ended', () => {
      this._currentAudio = null;
      stopBtn.classList.add('hidden');
      this.avatar.stopLipSync();
    });
    audio.addEventListener('error', () => {
      this._currentAudio = null;
      stopBtn.classList.add('hidden');
      this.avatar.stopLipSync();
    });
    audio.addEventListener('canplaythrough', () => {
      this.avatar.startLipSync(audio);
      audio.play().catch((e) => {
        console.warn('Audio playback failed:', e);
        stopBtn.classList.add('hidden');
        this.avatar.stopLipSync();
      });
    }, { once: true });

    audio.src = `${API_BASE_URL}${audioUrl}`;
    audio.load();
  }

  _stopAudio() {
    if (this._currentAudio) {
      this._currentAudio.pause();
      this._currentAudio.currentTime = 0;
      this._currentAudio = null;
    }
    document.getElementById('stop-btn').classList.add('hidden');
    this.avatar.stopLipSync();
  }

  _setStatus(text, modifier = '') {
    const badge = document.getElementById('status-badge');
    badge.textContent = text;
    badge.className   = 'status-badge' + (modifier ? ` ${modifier}` : '');
  }
}

function _setText(id, val) {
  const el = document.getElementById(id);
  if (el) el.textContent = val;
}

const app = new VGuardAssistant();
app.init();
