import { WelcomeBanner } from '@/components/dashboard/WelcomeBanner';
import { SummarySection } from '@/components/dashboard/SummarySection';
import { TrainingModules } from '@/components/dashboard/TrainingModules';

export function Dashboard() {
  return (
    <div className="flex flex-col w-full">
      <WelcomeBanner />
      <SummarySection />
      <TrainingModules />
    </div>
  );
}
