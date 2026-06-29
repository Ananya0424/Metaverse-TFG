
import { Outlet } from 'react-router-dom';
import { Header } from './Header';

export function LandingLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-background-light">
      <Header />
      <main className="flex-grow pt-20">
        <Outlet />
      </main>
    </div>
  );
}
