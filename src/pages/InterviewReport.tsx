import { Download, RotateCcw, Briefcase } from 'lucide-react';

export function InterviewReport() {
  return (
    <div className="p-10 max-w-[1200px] mx-auto w-full min-h-screen bg-[#F8FAFC]">
      {/* Header */}
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-[28px] font-bold text-[#FFCC00]">TFG Interview Report</h1>
        <div className="bg-[#2ECC71] text-white font-bold px-4 py-2 rounded-full text-sm">
          Interview Completed
        </div>
      </div>

      <div className="bg-white rounded-3xl p-10 shadow-sm border border-slate-100">
        
        {/* Candidate Profile */}
        <div className="flex items-center gap-6 mb-10">
          <div className="w-24 h-24 rounded-full bg-slate-200 overflow-hidden shrink-0 border-4 border-slate-50">
             <img src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80" alt="Candidate" className="w-full h-full object-cover" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-[#1D1F4C] mb-1">Neeshu</h2>
            <p className="text-slate-600 text-sm mb-1">Applied Role: Frontend Developer</p>
            <p className="text-slate-600 text-sm">Interview Type: HR + Technical + Behavioral</p>
          </div>
        </div>

        {/* Score Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          <div className="bg-[#FFF8D6] rounded-2xl p-6 text-center">
            <div className="text-4xl font-bold text-[#FFCC00] mb-2">88%</div>
            <div className="text-[#1D1F4C] text-sm font-medium">Communication</div>
          </div>
          <div className="bg-[#FFF8D6] rounded-2xl p-6 text-center">
            <div className="text-4xl font-bold text-[#FFCC00] mb-2">91%</div>
            <div className="text-[#1D1F4C] text-sm font-medium">Confidence</div>
          </div>
          <div className="bg-[#FFF8D6] rounded-2xl p-6 text-center">
            <div className="text-4xl font-bold text-[#FFCC00] mb-2">84%</div>
            <div className="text-[#1D1F4C] text-sm font-medium">Technical Skills</div>
          </div>
          <div className="bg-[#FFF8D6] rounded-2xl p-6 text-center">
            <div className="text-4xl font-bold text-[#FFCC00] mb-2">89%</div>
            <div className="text-[#1D1F4C] text-sm font-medium">Problem Solving</div>
          </div>
        </div>

        {/* Strengths & Areas to Improve */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <div className="bg-slate-50 rounded-2xl p-8 border border-slate-100">
            <h3 className="font-bold text-[#1D1F4C] text-lg mb-6">Strengths</h3>
            <ul className="space-y-4">
              <li className="flex items-start text-sm text-[#1D1F4C]">
                <span className="mr-2 mt-0.5 text-slate-400">•</span> Strong communication skills
              </li>
              <li className="flex items-start text-sm text-[#1D1F4C]">
                <span className="mr-2 mt-0.5 text-slate-400">•</span> Good confidence level
              </li>
              <li className="flex items-start text-sm text-[#1D1F4C]">
                <span className="mr-2 mt-0.5 text-slate-400">•</span> Clear project explanations
              </li>
              <li className="flex items-start text-sm text-[#1D1F4C]">
                <span className="mr-2 mt-0.5 text-slate-400">•</span> Good understanding of frontend concepts
              </li>
              <li className="flex items-start text-sm text-[#1D1F4C]">
                <span className="mr-2 mt-0.5 text-slate-400">•</span> Positive attitude during interview
              </li>
            </ul>
          </div>

          <div className="bg-slate-50 rounded-2xl p-8 border border-slate-100">
            <h3 className="font-bold text-[#1D1F4C] text-lg mb-6">Areas To Improve</h3>
            <ul className="space-y-4">
              <li className="flex items-start text-sm text-[#1D1F4C]">
                <span className="mr-2 mt-0.5 text-slate-400">•</span> Improve React optimization concepts
              </li>
              <li className="flex items-start text-sm text-[#1D1F4C]">
                <span className="mr-2 mt-0.5 text-slate-400">•</span> Give shorter technical answers
              </li>
              <li className="flex items-start text-sm text-[#1D1F4C]">
                <span className="mr-2 mt-0.5 text-slate-400">•</span> Practice advanced JavaScript questions
              </li>
              <li className="flex items-start text-sm text-[#1D1F4C]">
                <span className="mr-2 mt-0.5 text-slate-400">•</span> Improve system design explanations
              </li>
              <li className="flex items-start text-sm text-[#1D1F4C]">
                <span className="mr-2 mt-0.5 text-slate-400">•</span> Increase confidence in coding rounds
              </li>
            </ul>
          </div>
        </div>

        {/* Question Review */}
        <div className="mb-10">
          <h3 className="font-bold text-[#1D1F4C] text-xl mb-6">Interview Question Review</h3>
          
          <div className="space-y-4">
            <div className="bg-slate-50 rounded-xl p-6 border border-slate-100">
              <h4 className="font-bold text-[#1D1F4C] text-sm mb-2">1. Tell me about yourself</h4>
              <p className="text-slate-600 text-[13px]">You answered confidently and structured your introduction well.</p>
            </div>
            
            <div className="bg-slate-50 rounded-xl p-6 border border-slate-100">
              <h4 className="font-bold text-[#1D1F4C] text-sm mb-2">2. Explain a challenging project</h4>
              <p className="text-slate-600 text-[13px]">Good explanation of your AI coaching platform project with clear problem-solving examples.</p>
            </div>

            <div className="bg-slate-50 rounded-xl p-6 border border-slate-100">
              <h4 className="font-bold text-[#1D1F4C] text-sm mb-2">3. How do you handle responsive design?</h4>
              <p className="text-slate-600 text-[13px]">You demonstrated good practical knowledge using media queries and flexible layouts.</p>
            </div>
          </div>
        </div>

        {/* Summary Box */}
        <div className="bg-[#FFF8D6] rounded-2xl p-8 mb-10">
          <h3 className="font-bold text-[#1D1F4C] text-lg mb-4">AI Interview Summary</h3>
          <p className="text-[#1D1F4C] text-[13px] leading-relaxed">
            You performed very well in the mock interview session. Your communication and confidence were strong throughout the interview. You demonstrated practical frontend development knowledge and explained your projects clearly. The AI recommends improving advanced React concepts and practicing technical coding rounds for even better performance. Overall Interview Readiness Score: <strong className="font-bold">88%</strong>
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          <button className="bg-[#FFCC00] hover:bg-[#F0C000] text-[#1D1F4C] font-bold py-3.5 px-6 rounded-xl flex items-center transition-colors text-sm">
            <Download className="w-4 h-4 mr-2" />
            Download PDF Report
          </button>
          
          <button className="bg-[#1D1F4C] hover:bg-[#2A2D6C] text-white font-bold py-3.5 px-6 rounded-xl flex items-center transition-colors text-sm">
            <RotateCcw className="w-4 h-4 mr-2" />
            Retake Interview
          </button>
          
          <button className="bg-[#1D1F4C] hover:bg-[#2A2D6C] text-white font-bold py-3.5 px-6 rounded-xl flex items-center transition-colors text-sm">
            <Briefcase className="w-4 h-4 mr-2 text-[#FFCC00]" />
            Apply For Jobs
          </button>
        </div>

      </div>
    </div>
  );
}
