import { useNavigate } from 'react-router-dom';
import { Mic, Video, FileText, ArrowRight, User } from 'lucide-react';

export function MockInterview() {
  const navigate = useNavigate();

  return (
    <div className="relative w-full h-[calc(100vh-64px)] overflow-hidden bg-slate-900">
      {/* Background Placeholder for Office */}
      <div className="absolute inset-0 opacity-40 bg-[url('https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80')] bg-cover bg-center"></div>
      
      {/* Top Badges */}
      <div className="absolute top-6 left-6 z-10">
        <div className="bg-[#FFCC00] text-[#1D1F4C] font-bold px-6 py-2.5 rounded-xl text-lg shadow-lg">
          TFG Career Coach
        </div>
      </div>
      <div className="absolute top-6 right-6 z-10">
        <div className="bg-[#FFCC00] text-[#1D1F4C] font-bold px-6 py-2.5 rounded-xl text-lg shadow-lg">
          Frontend Developer Interview
        </div>
      </div>

      {/* Main Content Area */}
      <div className="absolute inset-0 z-10 flex p-8 pt-24 gap-8 pointer-events-none">
        
        {/* Left Analytics Panel */}
        <div className="w-[320px] pointer-events-auto flex flex-col gap-6">
          <div className="bg-white rounded-3xl p-6 shadow-xl">
            <h3 className="font-bold text-[#1D1F4C] text-lg mb-6">Interview Analytics</h3>
            
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm font-bold text-[#1D1F4C] mb-2">
                  <span>Communication</span>
                  <span>88%</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-[#FFCC00] rounded-full" style={{ width: '88%' }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-sm font-bold text-[#1D1F4C] mb-2">
                  <span>Confidence</span>
                  <span>92%</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-[#FFCC00] rounded-full" style={{ width: '92%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm font-bold text-[#1D1F4C] mb-2">
                  <span>Technical Skills</span>
                  <span>84%</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-[#FFCC00] rounded-full" style={{ width: '84%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm font-bold text-[#1D1F4C] mb-2">
                  <span>Problem Solving</span>
                  <span>89%</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-[#FFCC00] rounded-full" style={{ width: '89%' }}></div>
                </div>
              </div>
            </div>

            <div className="mt-8 border border-slate-200 border-dashed rounded-xl p-4 flex flex-col items-center justify-center bg-slate-50">
              <div className="flex items-center text-slate-500 text-sm mb-2 font-medium">
                <FileText className="w-4 h-4 mr-2" />
                Resume Uploaded
              </div>
              <div className="text-[#1D1F4C] font-bold text-sm">Frontend_Resume.pdf</div>
            </div>
          </div>
        </div>

        {/* Center Avatar Placeholder */}
        <div className="flex-1 flex items-end justify-center pb-10">
           {/* Here you would normally render the 3D model */}
           <div className="w-[400px] h-[600px] bg-white/10 backdrop-blur-sm border border-white/20 rounded-[40px] flex items-center justify-center">
              <User className="w-32 h-32 text-white/50" />
           </div>
        </div>

        {/* Right Chat Panel */}
        <div className="w-[450px] pointer-events-auto h-full flex flex-col">
          <div className="bg-white rounded-[32px] shadow-2xl flex flex-col h-full overflow-hidden border border-slate-100">
            {/* Chat Header */}
            <div className="bg-[#FFF8D6] p-6 pb-8">
              <h2 className="text-xl font-bold text-[#1D1F4C] mb-2">AI Mock Interview</h2>
              <p className="text-[#1D1F4C] text-sm">AI interviewer asking questions based on your resume and job description.</p>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 p-6 overflow-y-auto bg-white flex flex-col gap-4 -mt-4">
              
              {/* Bot Message */}
              <div className="bg-[#FFF8D6] rounded-2xl p-4 self-start max-w-[90%] relative">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 rounded-full bg-[#FFCC00] flex items-center justify-center shrink-0">
                    <User className="w-3.5 h-3.5 text-[#1D1F4C]" />
                  </div>
                  <span className="font-bold text-[#1D1F4C] text-sm">TFG Interviewer</span>
                </div>
                <p className="text-[#1D1F4C] text-sm mb-4">Welcome to your Frontend Developer mock interview session.</p>
                <p className="text-[#1D1F4C] text-sm mb-4">I reviewed your resume and noticed experience in HTML, CSS, JavaScript and React.</p>
                <p className="text-[#1D1F4C] text-sm">Can you introduce yourself and explain one challenging project you worked on recently?</p>
              </div>

              {/* User Message */}
              <div className="bg-[#E6F0FF] rounded-2xl p-4 self-end max-w-[90%]">
                <p className="text-[#1D1F4C] text-sm">Sure. I recently developed an AI coaching platform using HTML, CSS and JavaScript where users can interact with AI modules and practice interviews.</p>
              </div>

              {/* Bot Message */}
              <div className="bg-[#FFF8D6] rounded-2xl p-4 self-start max-w-[90%] relative">
                <p className="text-[#1D1F4C] text-sm mb-4">That's interesting.</p>
                <p className="text-[#1D1F4C] text-sm">How did you handle responsive design and improve the user experience in your project?</p>
              </div>

              {/* Suggestions */}
              <div className="flex gap-2 mt-2 flex-wrap">
                <button className="bg-slate-100 hover:bg-slate-200 text-[#1D1F4C] text-[13px] px-4 py-2 rounded-full font-medium transition-colors">
                  Tell me about yourself
                </button>
                <button className="bg-slate-100 hover:bg-slate-200 text-[#1D1F4C] text-[13px] px-4 py-2 rounded-full font-medium transition-colors">
                  Explain your strengths
                </button>
              </div>
            </div>

            {/* Chat Input */}
            <div className="p-6 pt-2 bg-white">
              <div className="flex gap-3 mb-4">
                <input 
                  type="text" 
                  placeholder="Type your answer..." 
                  className="flex-1 border border-slate-200 rounded-xl px-4 text-sm focus:outline-none focus:border-[#FFCC00]"
                />
                <button className="w-12 h-12 bg-[#FFCC00] hover:bg-[#F0C000] rounded-xl flex items-center justify-center shrink-0 transition-colors">
                  <ArrowRight className="w-5 h-5 text-[#1D1F4C]" />
                </button>
              </div>

              {/* Bottom Actions */}
              <div className="grid grid-cols-3 gap-2">
                <button className="bg-[#1D1F4C] hover:bg-[#2A2D6C] text-white text-[11px] font-bold py-3 px-2 rounded-xl flex flex-col items-center justify-center gap-1.5 transition-colors">
                  <Mic className="w-4 h-4" />
                  Voice Interview
                </button>
                <button className="bg-[#1D1F4C] hover:bg-[#2A2D6C] text-white text-[11px] font-bold py-3 px-2 rounded-xl flex flex-col items-center justify-center gap-1.5 transition-colors">
                  <Video className="w-4 h-4" />
                  Video Interview
                </button>
                <button 
                  onClick={() => navigate('/dashboard/career-coach/report')}
                  className="bg-[#1D1F4C] hover:bg-[#2A2D6C] text-white text-[11px] font-bold py-3 px-2 rounded-xl flex flex-col items-center justify-center gap-1.5 transition-colors text-center"
                >
                  <FileText className="w-4 h-4 text-[#FFCC00]" />
                  End & Generate
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
