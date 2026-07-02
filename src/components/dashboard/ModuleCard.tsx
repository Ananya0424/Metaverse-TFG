import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { useNavigate } from 'react-router-dom';
import type { ModuleData } from '@/data/dashboard';

export function ModuleCard({ 
  title, 
  progressValue,
  score, 
  scoreColor,
  image,
  moduleId,
  reportId,
}: ModuleData) {
  const navigate = useNavigate();
  const displayProgressText = `${progressValue}%`;
  const displayScore = score;
  const displayScoreColor = scoreColor;
  
  // Get first letter of title for the big background block
  const initial = title.charAt(0).toUpperCase();

  return (
    <Card className="bg-white border border-slate-100 p-0 overflow-hidden flex flex-col h-full shadow-[0_4px_25px_rgba(0,0,0,0.04)] hover:shadow-xl hover:border-[#FFD600]/30 transition-all duration-300 rounded-3xl group">
      {/* Top Banner with Image or Initial */}
      <div className="h-[180px] relative w-full shrink-0 flex items-center justify-center overflow-hidden">
        {image ? (
          <img src={image} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[#1D1F4C] to-[#2A2D6C] flex items-center justify-center">
            <span className="text-7xl font-bold text-white/10 drop-shadow-sm">{initial}</span>
          </div>
        )}
        
        {/* WEB Badge top right */}
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-[#1D1F4C] text-[10px] font-bold px-3 py-1 rounded-full shadow-sm z-10">
          WEB
        </div>
      </div>

      <div className="p-7 flex flex-col flex-1">
        <h3 className="font-extrabold text-[#1D1F4C] text-lg mb-6 line-clamp-2 leading-tight">
          {title}
        </h3>

        <div className="space-y-3 flex-1">
          <div className="flex justify-between items-center text-xs font-bold bg-[#F8F9FA] p-3 rounded-xl border border-slate-100 group-hover:bg-white group-hover:border-[#FFD600]/20 transition-colors">
            <div>
              <span className="text-slate-400 block mb-1 uppercase tracking-wider text-[10px]">Progress</span>
              <span className="text-[#1D1F4C] text-sm">{displayProgressText}</span>
            </div>
            <span className="bg-[#1D1F4C] text-[#FFD600] text-[10px] px-2.5 py-1 rounded-md">WEB</span>
          </div>

          <div className="flex justify-between items-center text-xs font-bold bg-[#F8F9FA] p-3 rounded-xl border border-slate-100 group-hover:bg-white group-hover:border-[#FFD600]/20 transition-colors">
            <div>
              <span className="text-slate-400 block mb-1 uppercase tracking-wider text-[10px]">Overall Score</span>
              <span className={`${displayScoreColor} text-sm`}>{displayScore}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mt-6">
          <Button 
            variant="primary" 
            className="w-full py-3 text-sm bg-[#1D1F4C] hover:bg-[#2A2D6C] text-white rounded-xl border-none shadow-none font-bold transition-colors"
            onClick={() => moduleId && navigate(`/dashboard/training/${moduleId}`)}
          >
            Continue
          </Button>
          <Button 
            variant="primary" 
            className="w-full py-3 text-sm bg-[#FFD600] hover:bg-[#e6c100] text-[#1D1F4C] rounded-xl border-none shadow-[0_4px_14px_rgba(255,214,0,0.3)] hover:shadow-[0_4px_20px_rgba(255,214,0,0.5)] font-bold transition-all"
            onClick={() => reportId && navigate(`/dashboard/reports/${reportId}`)}
          >
            View Result
          </Button>
        </div>
      </div>
    </Card>
  );
}
