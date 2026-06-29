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
  // If it's a new registered user, zero out their progress
  const isMockUser = !!localStorage.getItem('mock_user_email');
  
  const displayProgressText = isMockUser ? '0%' : `${progressValue}%`;
  const displayScore = isMockUser ? '0' : score;
  const displayScoreColor = isMockUser ? 'text-slate-400' : scoreColor;
  
  // Get first letter of title for the big background block
  const initial = title.charAt(0).toUpperCase();

  return (
    <Card className="bg-white border-slate-100 p-0 overflow-hidden flex flex-col h-full shadow-[0_2px_10px_rgba(0,0,0,0.06)] hover:shadow-lg transition-shadow rounded-2xl">
      {/* Top Banner with Image or Initial */}
      <div className="h-[180px] relative w-full shrink-0 flex items-center justify-center overflow-hidden">
        {image ? (
          <img src={image} alt={title} className="w-full h-full object-cover" />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[#3B5BFF] to-[#5942FF] flex items-center justify-center">
            <span className="text-6xl font-bold text-white drop-shadow-sm">{initial}</span>
          </div>
        )}
        
        {/* WEB Badge top right */}
        <div className="absolute top-4 right-4 bg-white text-slate-800 text-[10px] font-bold px-3 py-1 rounded-full shadow-sm z-10">
          WEB
        </div>
      </div>

      <div className="p-6 flex flex-col flex-1">
        <h3 className="font-bold text-[#1A74E3] text-lg mb-6 line-clamp-1">
          {title}
        </h3>

        <div className="space-y-3 flex-1">
          <div className="flex justify-between items-center text-xs font-bold">
            <div>
              <span className="text-[#1D1F4C]">Lesson Completed </span>
              <span className={isMockUser ? "text-slate-400" : "text-yellow-500"}>{displayProgressText}</span>
            </div>
            <span className="bg-[#8C9EFF] text-white text-[10px] px-2 py-0.5 rounded-sm">WEB</span>
          </div>

          <div className="flex justify-between items-center text-xs font-bold">
            <div>
              <span className="text-[#1D1F4C]">Overall Score </span>
              <span className={displayScoreColor}>{displayScore}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mt-8">
          <Button 
            variant="primary" 
            className="w-full py-2.5 text-sm bg-[#1A4BFF] hover:bg-blue-700 rounded-full border-none shadow-none font-semibold"
            onClick={() => moduleId && navigate(`/dashboard/training/${moduleId}`)}
          >
            Continue
          </Button>
          <Button 
            variant="primary" 
            className="w-full py-2.5 text-sm bg-[#FFC107] hover:bg-yellow-500 text-slate-900 rounded-full border-none shadow-none font-semibold"
            onClick={() => reportId && navigate(`/dashboard/reports/${reportId}`)}
          >
            View Result
          </Button>
        </div>
      </div>
    </Card>
  );
}
