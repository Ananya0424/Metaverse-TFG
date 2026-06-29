import { CheckCircle2, RefreshCw, Folder } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

import module1Img from '@/assets/images/modules/Rectangle 2758.png';
import module2Img from '@/assets/images/modules/Rectangle 2758 (1).png';
import module3Img from '@/assets/images/modules/Rectangle 2758 (2).png';

export const USER_PROFILE = {
  name: "Ananya Sharma",
  email: "ananyasharma242004@gmail.com",
  avatar: null, // Placeholder
};

export interface MetricData {
  title: string;
  value: string | number;
  icon: LucideIcon;
  valueColor: string;
}

export const SUMMARY_METRICS: MetricData[] = [
  {
    title: "Learning Modules Completed",
    value: 2,
    icon: CheckCircle2,
    valueColor: "text-slate-800",
  },
  {
    title: "Modules In Progress",
    value: 2,
    icon: RefreshCw,
    valueColor: "text-green-500",
  },
  {
    title: "Total Courses Available",
    value: 8,
    icon: Folder,
    valueColor: "text-red-500",
  },
  // TODO: Designer confirmation required. This card appears duplicated in the Figma screenshot.
  {
    title: "Total Courses Available",
    value: 8,
    icon: Folder,
    valueColor: "text-red-500",
  }
];

export interface ModuleData {
  id: string;
  title: string;
  progressText: string;
  progressValue: number;
  score: string;
  scoreColor: string;
  lastAccessed: string;
  image: null | string;
  moduleId?: string;
  reportId?: string;
}

export const RECENT_MODULES: ModuleData[] = [
  {
    id: "1",
    title: "Leadership & Management",
    progressText: "Lessons Completed: 50%",
    progressValue: 50,
    score: "Average",
    scoreColor: "text-yellow-600",
    lastAccessed: "Apr 11, 2023, 9:22 am",
    image: module1Img,
  },
  {
    id: "2",
    title: "Innovation",
    progressText: "Lessons Completed: 100%",
    progressValue: 100,
    score: "Good",
    scoreColor: "text-green-600",
    lastAccessed: "June 25, 2023, 10:15 am",
    image: module2Img,
  },
  {
    id: "3",
    title: "Sales Excellence",
    progressText: "Lessons Completed: 100%",
    progressValue: 100,
    score: "Good",
    scoreColor: "text-green-600",
    lastAccessed: "June 20, 2023, 10:00 am",
    image: module3Img,
  }
];
