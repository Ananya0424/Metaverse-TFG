import { useNavigate } from 'react-router-dom';
import { Mic, Search, Check, Upload, Code, Palette, LineChart } from 'lucide-react';

export function CareerCoach() {
  const navigate = useNavigate();

  return (
    <div className="p-10 max-w-[1400px] mx-auto w-full min-h-screen bg-[#F8FAFC]">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-[32px] font-bold text-[#1D1F4C]">Career Coach & AI Interview</h1>
        <div className="bg-[#81AAE6] text-[#1D1F4C] font-bold px-4 py-2 rounded-full text-sm">
          50% Completed
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Column - Recommended Jobs */}
        <div className="flex-1">
          <h2 className="text-xl font-bold text-[#1D1F4C] mb-6">Recommended Jobs</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Job Card 1 */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col">
              <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center mb-4">
                <Code className="w-6 h-6 text-slate-700" />
              </div>
              <h3 className="font-bold text-[#1D1F4C] text-[15px] mb-2">Frontend Developer</h3>
              <p className="text-slate-500 text-[13px] mb-1">Company: TFG Technologies</p>
              <p className="text-slate-500 text-[13px] mb-4">Location: Remote</p>
              <p className="text-slate-500 text-[13px] mb-6 line-clamp-2">Skills: HTML, CSS, JavaScript, React</p>
              
              <div className="mt-auto">
                <button 
                  onClick={() => navigate('/dashboard/career-coach/interview')}
                  className="bg-[#FFCC00] hover:bg-[#F0C000] text-[#1D1F4C] text-xs font-bold py-2.5 px-4 rounded-full flex items-center transition-colors"
                >
                  <Mic className="w-3.5 h-3.5 mr-2" />
                  Start Interview
                </button>
              </div>
            </div>

            {/* Job Card 2 */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col">
              <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center mb-4">
                <LineChart className="w-6 h-6 text-slate-700" />
              </div>
              <h3 className="font-bold text-[#1D1F4C] text-[15px] mb-2">Sales Executive</h3>
              <p className="text-slate-500 text-[13px] mb-1">Company: TFG Solutions</p>
              <p className="text-slate-500 text-[13px] mb-4">Location: Bangalore</p>
              <p className="text-slate-500 text-[13px] mb-6 line-clamp-2">Skills: Negotiation, Pitching, CRM</p>
              
              <div className="mt-auto">
                <button 
                  onClick={() => navigate('/dashboard/career-coach/interview')}
                  className="bg-[#FFCC00] hover:bg-[#F0C000] text-[#1D1F4C] text-xs font-bold py-2.5 px-4 rounded-full flex items-center transition-colors"
                >
                  <Mic className="w-3.5 h-3.5 mr-2" />
                  Start Interview
                </button>
              </div>
            </div>

            {/* Job Card 3 */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col">
              <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center mb-4">
                <Palette className="w-6 h-6 text-slate-700" />
              </div>
              <h3 className="font-bold text-[#1D1F4C] text-[15px] mb-2">UI/UX Designer</h3>
              <p className="text-slate-500 text-[13px] mb-1">Company: TFG Innovation Labs</p>
              <p className="text-slate-500 text-[13px] mb-4">Location: Hybrid</p>
              <p className="text-slate-500 text-[13px] mb-6 line-clamp-2">Skills: Figma, Prototyping, UX Research</p>
              
              <div className="mt-auto">
                <button 
                  onClick={() => navigate('/dashboard/career-coach/interview')}
                  className="bg-[#FFCC00] hover:bg-[#F0C000] text-[#1D1F4C] text-xs font-bold py-2.5 px-4 rounded-full flex items-center transition-colors"
                >
                  <Mic className="w-3.5 h-3.5 mr-2" />
                  Start Interview
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* Right Column - Resume Upload */}
        <div className="w-full lg:w-[320px] shrink-0">
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 relative overflow-hidden">
            <h3 className="font-bold text-[#1D1F4C] text-lg mb-3">Upload Resume</h3>
            <p className="text-[13px] text-slate-500 mb-6 leading-relaxed">
              Upload your latest resume to start AI-powered interview preparation.
            </p>
            
            <div className="border border-slate-200 rounded-xl h-[60px] flex items-center justify-center mb-4 border-dashed bg-slate-50 cursor-pointer hover:bg-slate-100 transition-colors">
               <Upload className="w-5 h-5 text-slate-400" />
            </div>
            
            <button className="w-full bg-[#FFCC00] hover:bg-[#F0C000] text-[#1D1F4C] text-sm font-bold py-3 rounded-lg transition-colors mb-10">
              Upload Resume
            </button>

            <h4 className="font-bold text-[#1D1F4C] text-[15px] mb-4">AI Resume Analysis</h4>
            <div className="space-y-3">
              <div className="flex items-start">
                <Check className="w-4 h-4 text-slate-800 mt-0.5 mr-2 shrink-0" />
                <span className="text-[13px] text-slate-700">Skill Gap Detection</span>
              </div>
              <div className="flex items-start">
                <Check className="w-4 h-4 text-slate-800 mt-0.5 mr-2 shrink-0" />
                <span className="text-[13px] text-slate-700">Resume Improvement Suggestions</span>
              </div>
              <div className="flex items-start">
                <Check className="w-4 h-4 text-slate-800 mt-0.5 mr-2 shrink-0" />
                <span className="text-[13px] text-slate-700">ATS Optimization Score</span>
              </div>
              <div className="flex items-start">
                <Check className="w-4 h-4 text-slate-800 mt-0.5 mr-2 shrink-0" />
                <span className="text-[13px] text-slate-700">Recommended Job Roles</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <hr className="border-t border-slate-300 my-10 border-2" />

      {/* Find Your Dream Job Section */}
      <div className="bg-white rounded-3xl p-10 shadow-sm border border-slate-100 max-w-4xl">
        <h2 className="text-[28px] font-bold text-[#1D1F4C] mb-2">Find Your Dream Job</h2>
        <p className="text-slate-500 text-sm mb-8">Search jobs using role name or job description</p>

        <div className="space-y-6">
          <div>
            <label className="block text-[#1D1F4C] text-sm font-bold mb-2">Search by Role</label>
            <input 
              type="text" 
              placeholder="e.g. Frontend Developer" 
              className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#FFCC00]"
            />
          </div>

          <div>
            <label className="block text-[#1D1F4C] text-sm font-bold mb-2">Paste Job Description</label>
            <textarea 
              placeholder="Paste complete job description here..." 
              rows={4}
              className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#FFCC00] resize-none"
            ></textarea>
          </div>

          <button className="w-full bg-[#FFCC00] hover:bg-[#F0C000] text-[#1D1F4C] text-[15px] font-bold py-4 rounded-xl flex items-center justify-center transition-colors">
            <Search className="w-5 h-5 mr-2" />
            Search Jobs
          </button>
        </div>
      </div>
    </div>
  );
}
