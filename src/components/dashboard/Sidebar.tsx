import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, BookOpen, FileText, Settings, HelpCircle, LogOut } from 'lucide-react';
import { cn } from '@/utils/cn';
import logoImg from '@/assets/images/logo.png';
import { USER_PROFILE } from '@/data/dashboard';
import { useAuth } from '@/hooks/useAuth';

const MAIN_NAV = [
  { label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard', end: true },
  { label: 'Training', icon: BookOpen, href: '/dashboard/training' },
  { label: 'Reports', icon: FileText, href: '/dashboard/reports' },
];

const SETTINGS_NAV = [
  { label: 'Settings', icon: Settings, href: '/dashboard/settings' },
  { label: 'Help Center', icon: HelpCircle, href: '/dashboard/help' },
];

export function Sidebar() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const mockName = localStorage.getItem('mock_user_name');
  const mockEmail = localStorage.getItem('mock_user_email');
  const displayName = mockName || USER_PROFILE.name;
  const displayEmail = mockEmail || USER_PROFILE.email;
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <aside className="w-[260px] bg-white h-screen flex flex-col fixed left-0 top-0 z-40">
      {/* Logo */}
      <div className="h-20 flex items-center px-8 border-b border-transparent">
        <img src={logoImg} alt="TFG Logo" className="h-8 w-auto object-contain" />
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-8 space-y-8 overflow-y-auto">
        <div className="space-y-2">
          {MAIN_NAV.map((item) => (
            <NavLink
              key={item.label}
              to={item.href}
              end={item.end}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-4 py-3.5 rounded-lg text-sm font-medium transition-colors",
                  isActive 
                    ? "bg-[#F4F7FE] text-[#1A74E3]" 
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                )
              }
            >
              <item.icon className="w-[22px] h-[22px]" />
              <span className="text-[15px]">{item.label}</span>
            </NavLink>
          ))}
        </div>

        <div>
          <h4 className="px-4 text-xs font-bold text-slate-400 mb-4 tracking-wider">SETTINGS</h4>
          <div className="space-y-2">
            {SETTINGS_NAV.map((item) => (
              <NavLink
                key={item.label}
                to={item.href}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 px-4 py-3.5 rounded-lg text-sm font-medium transition-colors",
                    isActive 
                      ? "bg-[#F4F7FE] text-[#1A74E3]" 
                      : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                  )
                }
              >
                <item.icon className="w-[22px] h-[22px]" />
                <span className="text-[15px]">{item.label}</span>
              </NavLink>
            ))}
            <button 
              onClick={() => {
                logout();
                navigate('/login');
              }}
              className="flex items-center gap-3 px-4 py-3.5 rounded-lg text-[15px] font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-colors w-full text-left"
            >
              <LogOut className="w-[22px] h-[22px]" />
              Log Out
            </button>
          </div>
        </div>
      </nav>

      {/* User Profile */}
      <div className="p-6 border-t border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#1A4BFF] text-white flex items-center justify-center shrink-0 font-bold text-lg">
            {initial}
          </div>
          <div className="flex flex-col truncate w-full">
            <span className="text-sm font-bold text-[#1D1F4C] truncate">{displayName}</span>
            <span className="text-xs text-slate-500 truncate" title={displayEmail}>{displayEmail}</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
