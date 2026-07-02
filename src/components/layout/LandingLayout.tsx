import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';
import { LandingContent } from '@/components/ui/LandingContent';

export function LandingLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-[#0b0822] text-white">
      <Header />
      <main className="flex-grow pt-20">
        <Outlet />
        <LandingContent />
      </main>
      <Footer />
    </div>
  );
}
