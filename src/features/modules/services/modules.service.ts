import type { TrainingCategory } from '../types';
import api from '@/services/api';

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



export const modulesService = {
  async getCategories(): Promise<TrainingCategory[]> {
    try {
      const response = await api.get('/modules');
      return response.data.map((mod: any) => ({
        ...mod,
        id: mod._id,
        imageUrl: IMAGE_MAP[mod.title] || module1Img,
        lessonsCount: mod.totalLessons
      }));
    } catch (error) {
      console.error('Error fetching modules:', error);
      return [];
    }
  },

  async getCategoryById(id: string): Promise<TrainingCategory | undefined> {
    try {
      const response = await api.get(`/modules/${id}`);
      const mod = response.data;
      return {
        ...mod,
        id: mod._id,
        imageUrl: IMAGE_MAP[mod.title] || module1Img,
        lessonsCount: mod.totalLessons
      };
    } catch (error) {
      console.error('Error fetching module:', error);
      return undefined;
    }
  }
};
