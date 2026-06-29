import { Headset, BarChart, Globe, LucideIcon } from 'lucide-react';

export interface FeatureData {
  title: string;
  description: string;
  icon: LucideIcon;
}

export const FEATURES_DATA: FeatureData[] = [
  {
    title: 'Immersive VR Modules',
    description: 'Experience hands-on training in lifelike environments for leadership, sales, and customer experience.',
    icon: Headset,
  },
  {
    title: 'AI-Driven Analytics',
    description: 'Track performance in real-time with our advanced AI analysis to measure skill improvement accurately.',
    icon: BarChart,
  },
  {
    title: 'Enterprise Scalability',
    description: 'Deploy training across your entire organization seamlessly with secure, cloud-based infrastructure.',
    icon: Globe,
  }
];
