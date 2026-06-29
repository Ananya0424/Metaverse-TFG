import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/common/Button';
import { ImagePlaceholder } from '@/components/common/ImagePlaceholder';
import type { TrainingCategory } from '../types';

interface ModuleListCardProps {
  category: TrainingCategory;
}

export function ModuleListCard({ category }: ModuleListCardProps) {
  const navigate = useNavigate();

  return (
    <div className="flex bg-white border border-slate-200 overflow-hidden mb-[-1px] relative z-10 transition-colors">
      {/* Thumbnail */}
      <div className="w-[300px] shrink-0 bg-slate-100 flex items-center justify-center overflow-hidden">
        {category.imageUrl ? (
          <img src={category.imageUrl} alt={category.title} className="w-full h-full object-cover" />
        ) : (
          <ImagePlaceholder />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 px-8 py-7 flex flex-col justify-center">
        <h3 className="text-[17px] font-bold text-[#1D1F4C] mb-2">{category.title}</h3>
        <p className="text-[#5B6B79] text-[13px] leading-relaxed max-w-[90%]">
          {category.description}
        </p>
      </div>

      {/* Action */}
      <div className="w-[200px] shrink-0 flex items-center justify-center px-6">
        <Button 
          variant="primary" 
          className="w-full bg-[#1A74E3] hover:bg-blue-700 py-2.5 rounded-full text-sm font-medium"
          onClick={() => navigate(`/dashboard/training/${category.id}`)}
        >
          Start Experience
        </Button>
      </div>
    </div>
  );
}
