import { useQuery } from '@tanstack/react-query';
import { modulesService } from '../services/modules.service';
import type { TrainingCategory } from '../types';

export const useTrainingCategories = () => {
  return useQuery<TrainingCategory[], Error>({
    queryKey: ['trainingCategories'],
    queryFn: () => modulesService.getCategories(),
  });
};
