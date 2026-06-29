import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '@/services/api';
import { UserReport } from '@/data/reports';
import { Button } from '@/components/common/Button';

import module1Img from '@/assets/images/modules/Rectangle 2758.png';
import module2Img from '@/assets/images/modules/Rectangle 2758 (1).png';
import module3Img from '@/assets/images/modules/Rectangle 2758 (2).png';
import module4Img from '@/assets/images/modules/Rectangle 2758 (3).png';
import module5Img from '@/assets/images/modules/Rectangle 2758 (4).png';
import module6Img from '@/assets/images/modules/Rectangle 2758 (5).png';
import module7Img from '@/assets/images/modules/Rectangle 2758 (6).png';
import module8Img from '@/assets/images/modules/Rectangle 2758 (7).png';

const IMAGE_MAP: Record<string, string> = {
  'Leadership & Management Skills': module1Img,
  'Innovation': module2Img,
  'Sales Excellence': module3Img,
  'Customer Experience': module4Img,
  'Workplace Skills': module5Img,
  'Employability': module6Img,
  'Coaching': module7Img,
  'Functional Mentoring': module8Img
};

export function Reports() {
  const [reports, setReports] = useState<UserReport[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await api.get('/reports');
        const formatted = response.data.map((r: any) => ({
          ...r,
          date: new Date(r.updatedAt || Date.now()).toLocaleDateString(),
          imageUrl: IMAGE_MAP[r.module?.title] || module1Img,
          lessonCompleted: Math.round(((r.lessonCompleted || 0) / (r.module?.totalLessons || 1)) * 100) || 100
        }));
        setReports(formatted);
      } catch (error) {
        console.error('Error fetching reports:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);
  return (
    <div className="flex flex-col w-full min-h-screen bg-white">
      {/* Header Area */}
      <div className="px-10 py-8 border-b border-slate-100">
        <h1 className="text-[28px] font-bold text-[#1D1F4C] mb-2">Performance Reports</h1>
        <p className="text-slate-500 text-[15px]">
          Review your training session analytics
        </p>
      </div>

      {/* Reports Grid */}
      <div className="px-10 py-8 bg-[#F8FAFC] flex-1">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : reports.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reports.map((report) => (
              <ReportCard key={report._id || report.reportId} report={report} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-slate-200 rounded-2xl bg-white">
            <h3 className="text-[#1D1F4C] font-bold text-lg mb-2">No Reports Generated Yet</h3>
            <p className="text-slate-500 text-sm">Complete a training module to see your performance analytics here.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function ReportCard({ report }: { report: UserReport }) {
  const navigate = useNavigate();
  const title = report.module?.title || 'Unknown Module';
  const initial = title.charAt(0).toUpperCase();

  // Helper to determine score color
  const getScoreColor = (score: string) => {
    const s = score.toLowerCase();
    if (s.includes('good') || s.includes('excellent')) return 'text-green-500';
    if (s.includes('average')) return 'text-yellow-500';
    if (s.includes('poor')) return 'text-red-500';
    return 'text-[#1A4BFF]';
  };

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-[0_2px_10px_rgba(0,0,0,0.06)] border border-slate-100 flex flex-col hover:shadow-lg transition-shadow">
      {/* Top Banner */}
      <div className="h-[200px] bg-[#3B5BFF] relative flex items-center justify-center shrink-0">
        {report.imageUrl ? (
          <img src={report.imageUrl} alt={title} className="w-full h-full object-cover" />
        ) : (
          <span className="text-7xl font-bold text-white">{initial}</span>
        )}
        
        {/* Type Badge top right */}
        <div className="absolute top-4 right-4 bg-white text-slate-800 text-[11px] font-bold px-3 py-1.5 rounded-full shadow-sm">
          WEB
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-1">
        <h3 className="font-bold text-[#1A74E3] text-lg mb-6 line-clamp-1">
          {title}
        </h3>

        <div className="space-y-3 flex-1">
          <div className="flex justify-between items-center text-[13px] font-bold">
            <div>
              <span className="text-[#1D1F4C]">Lesson Completed </span>
              <span className="text-yellow-500 ml-1">{report.lessonCompleted}%</span>
            </div>
            <span className="bg-[#1A74E3] text-white text-[10px] px-2.5 py-1 rounded-sm">WEB</span>
          </div>

          <div className="flex justify-between items-center text-[13px] font-bold">
            <div>
              <span className="text-[#1D1F4C]">Overall Score </span>
              <span className={`ml-1 ${getScoreColor(report.overallScore)}`}>{report.overallScore}</span>
            </div>
          </div>

          <div className="pt-4 text-slate-400 text-[11px] font-medium">
            {report.date}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3 mt-6">
          <Button 
            variant="primary" 
            className="w-full py-2.5 text-[13px] bg-[#1A4BFF] hover:bg-blue-700 rounded-full font-semibold border-none shadow-none"
            onClick={() => navigate(`/dashboard/training/${report.module?._id}`)}
          >
            Continue
          </Button>
          <Button 
            variant="primary" 
            className="w-full py-2.5 text-[13px] bg-[#FFC107] hover:bg-yellow-500 text-slate-900 rounded-full font-semibold border-none shadow-none"
            onClick={() => navigate(`/dashboard/reports/${report._id || report.reportId}`)}
          >
            View Result
          </Button>
        </div>
      </div>
    </div>
  );
}
