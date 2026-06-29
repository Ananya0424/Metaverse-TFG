import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Clock, Calendar } from 'lucide-react';
import api from '@/services/api';
import { UserReport } from '@/data/reports';

export function ReportDetail() {
  const { reportId } = useParams<{ reportId: string }>();
  const [report, setReport] = useState<UserReport | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const response = await api.get(`/reports/${reportId}`);
        const data = response.data;
        setReport({
          ...data,
          date: new Date(data.updatedAt || Date.now()).toLocaleDateString()
        });
      } catch (error) {
        console.error('Error fetching report detail:', error);
      } finally {
        setLoading(false);
      }
    };
    if (reportId) fetchReport();
  }, [reportId]);

  if (loading) {
    return <div className="p-10 flex justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>;
  }

  if (!report) {
    return <div className="p-10 text-red-500 font-medium">Report not found.</div>;
  }

  return (
    <div className="flex flex-col w-full min-h-screen bg-white">
      {/* Header Area */}
      <div className="px-10 py-6 border-b border-slate-100 flex items-center justify-between">
        <Link 
          to="/dashboard/reports" 
          className="inline-flex items-center bg-[#FF3B30] text-white px-5 py-2.5 rounded-md hover:bg-red-600 transition-colors font-medium text-[15px]"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back
        </Link>
        
        {/* Placeholder for top right clock icon (from screenshot) */}
        <div className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center relative shadow-sm">
          <Clock className="w-5 h-5 text-slate-500" />
          <div className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></div>
        </div>
      </div>

      <div className="px-10 py-8 bg-white max-w-6xl mx-auto w-full">
        <h1 className="text-3xl font-bold text-[#1D1F4C] text-center mb-10">Report</h1>
        
        {/* Top Stats Grid & Transcript layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column (Stats & Charts) */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            
            {/* Top 3 Cards */}
            <div className="grid grid-cols-3 gap-6">
              {/* Interaction Time */}
              <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm flex flex-col justify-between h-[130px]">
                <h3 className="text-[#1D1F4C] font-bold text-[13px] leading-tight">Interaction<br/>Time</h3>
                <div className="flex items-end justify-between mt-auto">
                  <span className="text-[32px] font-bold text-[#1D1F4C] leading-none">{report.interactionTime}</span>
                  <Clock className="w-7 h-7 text-slate-300" />
                </div>
              </div>

              {/* Overall Score */}
              <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm flex flex-col justify-between h-[130px]">
                <h3 className="text-[#1D1F4C] font-bold text-[13px]">Overall Score</h3>
                <div className="flex items-end justify-between mt-auto">
                  <span className="text-[32px] font-bold text-green-500 leading-none">{report.overallScore}</span>
                  <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[8px] border-b-slate-300 mb-1"></div>
                </div>
              </div>

              {/* Date & Time */}
              <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm flex flex-col justify-between h-[130px]">
                <h3 className="text-[#1D1F4C] font-bold text-[13px]">Date & Time</h3>
                <div className="flex items-end justify-between mt-auto">
                  <div className="flex flex-col text-[13px] font-bold text-[#1D1F4C] leading-tight">
                    <span>{report.date || new Date().toLocaleDateString()}</span>
                  </div>
                  <Calendar className="w-6 h-6 text-slate-300" />
                </div>
              </div>
            </div>

            {/* Donut Charts */}
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-[#F8FAFC] border border-slate-100 rounded-2xl p-6 shadow-sm flex flex-col items-center justify-center">
                <h3 className="text-[#1D1F4C] font-bold text-[15px] mb-6 w-full text-left">Speaking Pace</h3>
                <div className="relative w-32 h-32 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="64" cy="64" r="52" fill="none" stroke="#E2E8F0" strokeWidth="16" />
                    <circle cx="64" cy="64" r="52" fill="none" stroke="#1A4BFF" strokeWidth="16" strokeDasharray="326" strokeDashoffset="80" strokeLinecap="round" />
                  </svg>
                  <div className="absolute flex flex-col items-center">
                    <span className="text-2xl font-bold text-[#1A4BFF] leading-none">{report.speakingPace?.wpm || 0}</span>
                    <span className="text-[10px] font-bold text-slate-400 mt-1">WPM</span>
                  </div>
                </div>
              </div>

              <div className="bg-[#F8FAFC] border border-slate-100 rounded-2xl p-6 shadow-sm flex flex-col items-center justify-center">
                <h3 className="text-[#1D1F4C] font-bold text-[15px] mb-6 w-full text-left">Filler Words</h3>
                <div className="relative w-32 h-32 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="64" cy="64" r="52" fill="none" stroke="#E2E8F0" strokeWidth="16" />
                  </svg>
                  <span className="absolute text-2xl font-bold text-[#1A4BFF]">{report.fillerWords?.count || 0}</span>
                </div>
              </div>
            </div>
            
          </div>

          {/* Right Column (Transcript) */}
          <div className="lg:col-span-5 h-[410px]">
            <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm h-full flex flex-col overflow-hidden">
              <h3 className="text-[#1A4BFF] font-bold text-lg mb-6">Transcript</h3>
              <div className="flex-1 overflow-y-auto pr-2 space-y-6">
                <div className="text-[15px] text-slate-600 whitespace-pre-wrap leading-relaxed">
                  {report.transcript}
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Competencies & Feedback Row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8">
          
          {/* Competency Bars */}
          <div className="lg:col-span-7 bg-[#F8FAFC] border border-slate-100 rounded-2xl p-8 shadow-sm">
            <div className="space-y-8">
              {Object.entries(report.skills || {}).map(([key, level]) => (
                <div key={key} className="flex flex-col gap-2">
                  <h4 className="font-bold text-[#1D1F4C] text-[15px] capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </h4>
                  <div className="flex rounded-md overflow-hidden bg-white border border-slate-200">
                    {['Novice', 'Intermediate', 'Advanced', 'Expert'].map((lvl) => {
                      const isActive = level.toLowerCase() === lvl.toLowerCase();
                      return (
                        <div 
                          key={lvl} 
                          className={`flex-1 text-center py-2 text-[11px] font-bold transition-colors ${
                            isActive 
                              ? 'bg-[#67A3FA] text-white border-r border-[#67A3FA]' 
                              : 'text-slate-400 border-r border-slate-100 last:border-r-0'
                          }`}
                        >
                          {lvl}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Detailed Feedback */}
          <div className="lg:col-span-5 bg-[#F8FAFC] border border-slate-100 rounded-2xl p-8 shadow-sm">
            <h3 className="text-[#1A4BFF] font-bold text-lg mb-4">Detailed Feedback</h3>
            <p className="text-slate-600 text-[14px] leading-relaxed">
              {report.feedback}
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
