import { useTrainingCategories } from '../hooks/useModules';
import { ModuleListCard } from './ModuleListCard';
import { ModuleListSkeleton } from './ModuleListSkeleton';
import { Button } from '@/components/common/Button';

export function TrainingZone() {
  const { data: categories, isLoading, isError, refetch } = useTrainingCategories();

  return (
    <div className="flex flex-col w-full min-h-screen">
      {/* Header Area */}
      <div className="bg-[#2D2D2D] text-white px-10 py-8">
        <h1 className="text-2xl font-bold mb-3">Training Zone</h1>
        <p className="text-slate-300 max-w-4xl text-[15px] leading-relaxed mb-4">
          Develop and refine your leadership, management, sales, and workplace skills through immersive AI-driven practice sessions. After each exercise, receive personalized insights and reflection from your AI coach.
        </p>
        <ul className="text-slate-300 text-sm list-disc pl-5">
          <li>Web-Based Modules: Accessible directly in your browser — no installation needed.</li>
        </ul>
      </div>

      {/* Content Area */}
      <div className="px-10 py-8 bg-[#F8FAFC] flex-1">
        {isLoading && (
          <div className="flex flex-col">
            <ModuleListSkeleton />
            <ModuleListSkeleton />
            <ModuleListSkeleton />
            <ModuleListSkeleton />
          </div>
        )}

        {isError && (
          <div className="w-full p-8 bg-white border border-red-100 rounded-md shadow-sm flex flex-col items-center justify-center text-center mt-4">
            <h3 className="text-red-600 font-bold text-lg mb-2">Failed to load modules</h3>
            <p className="text-slate-600 mb-6 max-w-md">
              We encountered an issue while trying to fetch the training modules. Please check your connection and try again.
            </p>
            <Button variant="primary" onClick={() => refetch()} className="bg-red-600 hover:bg-red-700 px-8 py-2.5 rounded-full shadow-sm text-sm font-medium">
              Retry
            </Button>
          </div>
        )}

        {!isLoading && !isError && categories?.length === 0 && (
          <div className="w-full p-12 bg-white border border-slate-200 rounded-md shadow-sm flex flex-col items-center justify-center text-center mt-4">
            <h3 className="text-xl font-bold text-[#1D1F4C] mb-2">No modules available</h3>
            <p className="text-slate-500">There are currently no training modules assigned to your profile.</p>
          </div>
        )}

        {!isLoading && !isError && categories && categories.length > 0 && (
          <div className="flex flex-col">
            {categories.map((category) => (
              <ModuleListCard key={category.id} category={category} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
