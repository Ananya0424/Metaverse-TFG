import { Outlet } from 'react-router-dom';
import { Header } from './Header';

export function LandingLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-[#0b0822] text-white">
      <Header />
      <main className="flex-grow pt-20">
        <Outlet />
      </main>
    </div>
  );
}
