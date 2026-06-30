import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { ArrowLeft, Loader2 } from 'lucide-react';

export function Simulation() {
  const { moduleId } = useParams<{ moduleId: string }>();
  const navigate = useNavigate();
  const { token } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState('');

  // We fetch the profile just to get the user's name for Unity
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { default: api } = await import('@/services/api');
        const response = await api.get('/users/profile');
        if (response.data && response.data.name) {
          setUserName(response.data.name);
        }
      } catch (err) {
        console.error('Failed to fetch profile', err);
      }
    };
    fetchUser();
  }, []);

  // Construct the URL to load the WebGL index-2.html with query parameters
  const getIframeUrl = () => {
    const encodedToken = encodeURIComponent(token || '');
    const encodedName = encodeURIComponent(userName);
    // You could also add `&module=0&sub=0` if needed by Unity logic
    return `/webgl/index-2.html?token=${encodedToken}&name=${encodedName}&moduleId=${moduleId}`;
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#1D1F4C] flex flex-col h-screen w-screen overflow-hidden">
      {/* Header Bar */}
      <div className="h-14 bg-[#141539] border-b border-white/10 flex items-center px-6 shrink-0 justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(`/dashboard/training/${moduleId}`)}
            className="flex items-center text-slate-300 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            <span className="font-semibold text-sm">Exit Simulation</span>
          </button>
        </div>
        <div className="text-white/60 text-xs font-medium uppercase tracking-widest">
          Metaverse911 VR Training
        </div>
      </div>

      {/* iframe container */}
      <div className="flex-1 relative bg-black">
        {loading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#1D1F4C]">
            <Loader2 className="w-10 h-10 text-[#1A4BFF] animate-spin mb-4" />
            <p className="text-white font-medium">Initializing immersive environment...</p>
          </div>
        )}
        
        <iframe 
          src={getIframeUrl()}
          className="w-full h-full border-none"
          allow="fullscreen; autoplay; camera; microphone"
          onLoad={() => setLoading(false)}
        />
      </div>
    </div>
  );
}
