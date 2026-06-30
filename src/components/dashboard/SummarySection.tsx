import { CheckCircle2, ChevronDown, ChevronUp, Layers } from 'lucide-react';
import { useTrainingCategories } from '@/features/modules/hooks/useModules';
import { useState, useEffect } from 'react';
import api from '@/services/api';

export function SummarySection() {
  const { data: categories = [] } = useTrainingCategories();
  
  // Dynamic metrics
  const totalCourses = categories.length;
  const [completed, setCompleted] = useState(0);
  const [inProgress, setInProgress] = useState(0);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await api.get('/reports');
        if (response.data && response.data.length > 0) {
           setCompleted(response.data.length);
           setInProgress(0); // If they have reports, they completed them (simulation finishes)
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchReports();
  }, []);

  return (
    <div className="px-10 py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Completed Card */}
        <div className="bg-white rounded-xl p-6 border border-slate-100 shadow-sm flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-[#1D1F4C] leading-tight mb-4">
              Learning Modules<br/>Completed
            </h3>
            <div className="text-5xl font-bold text-[#1D1F4C]">
              {completed}
            </div>
          </div>
          <div className="w-16 h-16 rounded-full border-4 border-slate-100 flex items-center justify-center">
            <CheckCircle2 className="w-8 h-8 text-slate-300" />
          </div>
        </div>

        {/* In Progress Card */}
        <div className="bg-white rounded-xl p-6 border border-slate-100 shadow-sm flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-[#1D1F4C] leading-tight mb-4">
              Modules in Progress
            </h3>
            <div className="text-5xl font-bold text-green-500 mt-8">
              {inProgress}
            </div>
          </div>
          <div className="flex flex-col gap-2 text-slate-300">
            <ChevronUp className="w-12 h-12 -mb-6" />
            <ChevronDown className="w-12 h-12" />
          </div>
        </div>

        {/* Total Courses Card */}
        <div className="bg-white rounded-xl p-6 border border-slate-100 shadow-sm flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-[#1D1F4C] leading-tight mb-4">
              Total Courses Available
            </h3>
            <div className="text-5xl font-bold text-red-600 mt-8">
              {totalCourses}
            </div>
          </div>
          <div className="text-slate-300">
            <Layers className="w-12 h-12" />
          </div>
        </div>

      </div>
    </div>
  );
}
