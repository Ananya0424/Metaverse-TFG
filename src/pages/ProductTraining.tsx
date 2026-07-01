import { useState, useRef, useEffect } from 'react';
import { Mic, Send, Bot, User, Loader2 } from 'lucide-react';
import { AvatarViewer } from '../components/training/AvatarViewer';
import api from '@/services/api';

const BACKEND_URL = import.meta.env.PROD ? '' : 'http://localhost:5000';

export function ProductTraining() {
  const [messages, setMessages] = useState<{role: 'user' | 'bot', text: string}[]>([
    { role: 'bot', text: 'Hello! I am your V-Guard Fan training assistant. How can I help you today?' }
  ]);
  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendTextQuery = async () => {
    if (!inputText.trim() || isProcessing) return;
    const text = inputText;
    setInputText('');
    setMessages(prev => [...prev, { role: 'user', text }]);
    setIsProcessing(true);

    try {
      const res = await api.post('/training/text-query', { query: text });
      const data = res.data;
      if (data.response_text) {
        setMessages(prev => [...prev, { role: 'bot', text: data.response_text }]);
        if (data.audio_url) {
          setAudioUrl(BACKEND_URL + data.audio_url);
        }
      }
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { role: 'bot', text: 'Sorry, I encountered an error.' }]);
    } finally {
      setIsProcessing(false);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
      
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      recorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        audioChunksRef.current = [];
        
        if (audioBlob.size < 1500) {
            setMessages(prev => [...prev, { role: 'bot', text: 'Recording too short.' }]);
            return;
        }

        setIsProcessing(true);
        const formData = new FormData();
        formData.append('audio', audioBlob, 'recording.webm');

        try {
          const res = await api.post('/training/voice-query', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          });
          const data = res.data;
          if (data.transcript) {
            setMessages(prev => [...prev, { role: 'user', text: data.transcript }]);
          }
          if (data.response_text) {
            setMessages(prev => [...prev, { role: 'bot', text: data.response_text }]);
            if (data.audio_url) {
                setAudioUrl(BACKEND_URL + data.audio_url);
            }
          }
        } catch (err) {
          console.error(err);
          setMessages(prev => [...prev, { role: 'bot', text: 'Sorry, voice processing failed.' }]);
        } finally {
          setIsProcessing(false);
        }
      };

      mediaRecorderRef.current = recorder;
      recorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error(err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
    }
  };

  return (
    <div className="h-full flex flex-col p-6 space-y-4">
      <h1 className="text-2xl font-bold text-[#1D1F4C]">V-Guard Fan Assistant</h1>
      
      <div className="flex-1 flex gap-6 min-h-0">
        <div className="w-1/2 flex flex-col rounded-2xl overflow-hidden shadow-sm border border-slate-200">
          <AvatarViewer audioSrc={audioUrl} onPlaybackEnd={() => setAudioUrl(null)} />
        </div>

        <div className="w-1/2 flex flex-col bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] rounded-2xl p-4 flex gap-3 ${
                  msg.role === 'user' 
                    ? 'bg-blue-600 text-white rounded-tr-sm' 
                    : 'bg-slate-100 text-slate-800 rounded-tl-sm'
                }`}>
                  {msg.role === 'bot' && <Bot className="w-5 h-5 shrink-0 mt-0.5 text-blue-600" />}
                  <p>{msg.text}</p>
                  {msg.role === 'user' && <User className="w-5 h-5 shrink-0 mt-0.5 text-white/80" />}
                </div>
              </div>
            ))}
            {isProcessing && (
              <div className="flex justify-start">
                <div className="bg-slate-100 rounded-2xl rounded-tl-sm p-4 flex items-center gap-3 text-slate-500">
                  <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
                  <p>Processing...</p>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center gap-2">
            <button
              onMouseDown={startRecording}
              onMouseUp={stopRecording}
              onMouseLeave={stopRecording}
              onTouchStart={startRecording}
              onTouchEnd={stopRecording}
              className={`p-4 rounded-full transition-all ${
                isRecording 
                  ? 'bg-red-500 text-white shadow-lg scale-110 animate-pulse' 
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
              title="Hold to talk"
            >
              <Mic className="w-6 h-6" />
            </button>
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendTextQuery()}
              placeholder="Ask a question about V-Guard fans..."
              className="flex-1 p-4 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
              disabled={isRecording || isProcessing}
            />
            <button
              onClick={sendTextQuery}
              disabled={!inputText.trim() || isRecording || isProcessing}
              className="p-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
