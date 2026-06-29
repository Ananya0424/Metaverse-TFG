import { Outlet } from 'react-router-dom';
import { Sidebar } from '@/components/dashboard/Sidebar';

export function DashboardLayout() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex">
      <Sidebar />
      <main className="flex-1 ml-[280px]">
        <Outlet />
      </main>
    </div>
  );
}
