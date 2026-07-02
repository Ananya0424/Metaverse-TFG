import { CheckCircle2, Layers, PlayCircle } from 'lucide-react';
import { useTrainingCategories } from '@/features/modules/hooks/useModules';
import { useState, useEffect } from 'react';
import api from '@/services/api';
import { motion } from 'framer-motion';

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
    <div className="px-10 py-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Completed Card */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-3xl p-7 border border-slate-100 shadow-[0_4px_25px_rgba(0,0,0,0.03)] flex items-center justify-between group hover:shadow-lg transition-all duration-300">
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
              Completed Modules
            </h3>
            <div className="text-[40px] font-extrabold text-[#1D1F4C] leading-none">
              {completed}
            </div>
          </div>
          <div className="w-16 h-16 rounded-2xl bg-[#FFD600]/10 flex items-center justify-center group-hover:bg-[#FFD600] transition-colors duration-300">
            <CheckCircle2 className="w-8 h-8 text-[#FFD600] group-hover:text-[#1D1F4C]" />
          </div>
        </motion.div>

        {/* In Progress Card */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-3xl p-7 border border-slate-100 shadow-[0_4px_25px_rgba(0,0,0,0.03)] flex items-center justify-between group hover:shadow-lg transition-all duration-300">
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
              In Progress
            </h3>
            <div className="text-[40px] font-extrabold text-[#1D1F4C] leading-none">
              {inProgress}
            </div>
          </div>
          <div className="w-16 h-16 rounded-2xl bg-[#FFD600]/10 flex items-center justify-center group-hover:bg-[#FFD600] transition-colors duration-300">
             <PlayCircle className="w-8 h-8 text-[#FFD600] group-hover:text-[#1D1F4C]" />
          </div>
        </motion.div>

        {/* Total Courses Card */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white rounded-3xl p-7 border border-slate-100 shadow-[0_4px_25px_rgba(0,0,0,0.03)] flex items-center justify-between group hover:shadow-lg transition-all duration-300">
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
              Total Courses
            </h3>
            <div className="text-[40px] font-extrabold text-[#1D1F4C] leading-none">
              {totalCourses}
            </div>
          </div>
          <div className="w-16 h-16 rounded-2xl bg-[#FFD600]/10 flex items-center justify-center group-hover:bg-[#FFD600] transition-colors duration-300">
            <Layers className="w-8 h-8 text-[#FFD600] group-hover:text-[#1D1F4C]" />
          </div>
        </motion.div>

      </div>
    </div>
  );
}
