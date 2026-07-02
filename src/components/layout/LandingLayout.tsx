import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';
import { LandingContent } from '@/components/ui/LandingContent';

export function LandingLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-white text-[#1D1F4C]">
      <Header />
      <main className="flex-grow">
        <Outlet />
        <LandingContent />
      </main>
      <Footer />
    </div>
  );
}
