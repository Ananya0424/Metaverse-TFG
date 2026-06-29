import { useState, useEffect } from 'react';
import { ModuleCard } from './ModuleCard';
import { Link } from 'react-router-dom';
import api from '@/services/api';
import type { ModuleData } from '@/data/dashboard';

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

export function TrainingModules() {
  const [recentReports, setRecentReports] = useState<ModuleData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await api.get('/reports');
        // Map backend Report to ModuleData format for the Dashboard card
        const formattedData: ModuleData[] = response.data.map((report: any) => ({
          id: report._id,
          reportId: report._id,
          moduleId: report.module?._id,
          title: report.module?.title || 'Unknown Module',
          progressText: `Lessons Completed: ${report.module?.totalLessons ? Math.round((report.lessonCompleted || 0) / report.module.totalLessons * 100) : 100}%`,
          progressValue: report.lessonCompleted || 100, // Assuming 100 if completed
          score: report.overallScore || 'Average',
          scoreColor: 'text-yellow-500', // Default color, can map based on score
          lastAccessed: new Date(report.updatedAt).toLocaleDateString(),
          image: IMAGE_MAP[report.module?.title] || module1Img,
        }));
        
        // Take top 3 for dashboard
        setRecentReports(formattedData.slice(0, 3));
      } catch (error) {
        console.error('Error fetching dashboard reports:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);
  return (
    <div className="px-10 pb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-[#1D1F4C]">Training Modules</h2>
        <Link 
          to="/dashboard/training" 
          className="text-sm font-medium text-slate-500 hover:text-[#1A74E3] transition-colors"
        >
          See All Modules &gt;
        </Link>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : recentReports.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recentReports.map((module) => (
            <ModuleCard key={module.id} {...module} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-40 border-2 border-dashed border-slate-200 rounded-2xl bg-white">
          <h3 className="text-[#1D1F4C] font-bold text-lg mb-1">No Recent Activity</h3>
          <p className="text-slate-500 text-sm">You haven't started any modules yet.</p>
        </div>
      )}
    </div>
  );
}
