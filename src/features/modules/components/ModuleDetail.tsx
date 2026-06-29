import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Star, Lock, CheckCircle, Clock, BookOpen } from 'lucide-react';
import { modulesService } from '../services/modules.service';
import type { TrainingCategory, SubModule } from '../types';
import { Button } from '@/components/common/Button';

export function ModuleDetail() {
  const { moduleId } = useParams<{ moduleId: string }>();
  const [category, setCategory] = useState<TrainingCategory | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategory = async () => {
      setLoading(true);
      if (moduleId) {
        const data = await modulesService.getCategoryById(moduleId);
        setCategory(data || null);
      }
      setLoading(false);
    };

    fetchCategory();
  }, [moduleId]);

  if (loading) {
    return <div className="p-10 text-slate-500 font-medium">Loading module details...</div>;
  }

  if (!category) {
    return <div className="p-10 text-red-500 font-medium">Module not found.</div>;
  }

  return (
    <div className="flex flex-col w-full min-h-screen bg-[#F8FAFC]">
      {/* Header Area */}
      <div className="bg-white px-10 py-6 border-b border-slate-200">
        <Link to="/dashboard/training" className="inline-flex items-center text-slate-500 hover:text-slate-700 transition-colors mb-6 text-sm font-medium">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Training
        </Link>
        <h1 className="text-[32px] font-bold text-[#1D1F4C] mb-3">{category.title}</h1>
        <p className="text-slate-500 text-[15px]">{category.description}</p>
      </div>

      {/* Content Area */}
      <div className="px-10 py-8 flex flex-col lg:flex-row gap-8">
        
        {/* Left Side: Submodules */}
        <div className="flex-1">
          <h2 className="text-[#1A4BFF] text-sm font-bold tracking-wide mb-6 uppercase">
            Sub Category (Modules)
          </h2>
          
          {category.subModules && category.subModules.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {category.subModules.map((subMod) => (
                <SubModuleCard key={subMod.id} module={subMod} />
              ))}
            </div>
          ) : (
            <div className="p-8 text-center border border-slate-200 rounded-lg bg-white">
              <p className="text-slate-500">No sub-modules available yet.</p>
            </div>
          )}

          <div className="mt-12">
            <Button variant="primary" className="bg-[#1A4BFF] hover:bg-blue-700 text-white rounded-full px-8 py-3 font-semibold w-auto min-w-[200px]">
              Continue Module
            </Button>
          </div>
        </div>

        {/* Right Side: Info Card */}
        <div className="w-full lg:w-[320px] shrink-0">
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            <h3 className="font-bold text-[#1D1F4C] text-[15px] mb-6">Module Info</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center text-slate-500">
                  <Clock className="w-4 h-4 mr-3" />
                  <span className="text-[13px] font-medium">Duration</span>
                </div>
                <span className="font-bold text-[#1D1F4C] text-[13px]">{category.duration || 'N/A'}</span>
              </div>
              
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center text-slate-500">
                  <BookOpen className="w-4 h-4 mr-3" />
                  <span className="text-[13px] font-medium">Lessons</span>
                </div>
                <span className="font-bold text-[#1D1F4C] text-[13px]">{category.lessonsCount || 0}</span>
              </div>
              
              <div className="flex items-center justify-between pt-2">
                <span className="text-slate-500 text-[13px] font-medium">Type</span>
                <span className="bg-blue-50 text-[#1A4BFF] text-[10px] font-bold px-3 py-1 rounded-sm">
                  WEB
                </span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

function SubModuleCard({ module }: { module: SubModule }) {
  if (module.status === 'available') {
    return (
      <div className="flex rounded-md overflow-hidden shadow-sm h-14">
        <div className="w-14 bg-[#FACC15] shrink-0 flex items-center justify-center border-r border-yellow-500/20">
          <Star className="w-5 h-5 text-slate-900" />
        </div>
        <div className="flex-1 bg-[#FACC15] flex items-center px-4 font-semibold text-slate-900 text-sm">
          {module.title}
        </div>
      </div>
    );
  }

  if (module.status === 'completed') {
    return (
      <div className="flex rounded-md overflow-hidden shadow-sm h-14">
        <div className="w-14 bg-[#22C55E] shrink-0 flex items-center justify-center border-r border-green-600/20">
          <CheckCircle className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1 bg-[#22C55E] flex items-center px-4 font-semibold text-white text-sm">
          {module.title}
        </div>
      </div>
    );
  }

  // locked
  return (
    <div className="flex rounded-md overflow-hidden shadow-sm h-14 opacity-75">
      <div className="w-14 bg-slate-200 shrink-0 flex items-center justify-center border-r border-white/50">
        <Lock className="w-5 h-5 text-white" />
      </div>
      <div className="flex-1 bg-slate-300 flex items-center px-4 font-semibold text-white text-sm">
        {module.title}
      </div>
    </div>
  );
}
