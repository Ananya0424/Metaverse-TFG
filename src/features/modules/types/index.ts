export type SubModuleStatus = 'available' | 'locked' | 'completed';

export interface SubModule {
  id: string;
  title: string;
  status: SubModuleStatus;
}

export interface TrainingCategory {
  id: string;
  title: string;
  description: string;
  imageUrl: string | null;
  duration?: string;
  lessonsCount?: number;
  subModules?: SubModule[];
}
