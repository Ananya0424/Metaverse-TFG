import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, BookOpen, FileText, Settings, HelpCircle, LogOut, Layers, User } from 'lucide-react';
import { cn } from '@/utils/cn';
import logoImg from '@/assets/images/logo.png';
import { USER_PROFILE } from '@/data/dashboard';
import { useAuth } from '@/hooks/useAuth';

const MAIN_NAV = [
  { label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard', end: true },
  { label: 'Training', icon: BookOpen, href: '/dashboard/training' },
  { label: 'Reports', icon: FileText, href: '/dashboard/reports' },
  { label: 'Career Coach', icon: Layers, href: '/dashboard/career-coach' },
  { label: 'Product Training', icon: User, href: '/dashboard/product-training' },
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
    <aside className="w-[260px] bg-[#1D1F4C] h-screen flex flex-col fixed left-0 top-0 z-40 shadow-xl overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute top-[-10%] left-[-10%] w-[300px] h-[300px] bg-[#FFD600] rounded-full blur-[100px]" />
      </div>

      {/* Logo */}
      <div className="h-24 flex items-center px-8 border-b border-white/10 relative z-10">
        <img src={logoImg} alt="TFG Logo" className="h-9 w-auto object-contain brightness-0 invert" />
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-8 space-y-8 overflow-y-auto relative z-10">
        <div className="space-y-2">
          {MAIN_NAV.map((item) => (
            <NavLink
              key={item.label}
              to={item.href}
              end={item.end}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-semibold transition-all duration-300",
                  isActive 
                    ? "bg-[#FFD600]/15 text-[#FFD600]" 
                    : "text-slate-300 hover:bg-white/5 hover:text-white"
                )
              }
            >
              <item.icon className={cn("w-5 h-5", "transition-transform duration-300")} />
              <span className="text-[15px]">{item.label}</span>
            </NavLink>
          ))}
        </div>

        <div>
          <h4 className="px-4 text-xs font-bold text-slate-400 mb-4 tracking-widest uppercase">Settings</h4>
          <div className="space-y-2">
            {SETTINGS_NAV.map((item) => (
              <NavLink
                key={item.label}
                to={item.href}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-semibold transition-all duration-300",
                    isActive 
                      ? "bg-[#FFD600]/15 text-[#FFD600]" 
                      : "text-slate-300 hover:bg-white/5 hover:text-white"
                  )
                }
              >
                <item.icon className="w-5 h-5" />
                <span className="text-[15px]">{item.label}</span>
              </NavLink>
            ))}
            <button 
              onClick={() => {
                logout();
                navigate('/login');
              }}
              className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-[15px] font-semibold text-red-400 hover:bg-red-400/10 transition-colors w-full text-left mt-2"
            >
              <LogOut className="w-5 h-5" />
              Log Out
            </button>
          </div>
        </div>
      </nav>

      {/* User Profile */}
      <div className="p-6 border-t border-white/10 bg-black/10 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#FFD600] text-[#1D1F4C] flex items-center justify-center shrink-0 font-bold text-lg shadow-sm">
            {initial}
          </div>
          <div className="flex flex-col w-full overflow-hidden">
            <span className="text-sm font-bold text-white truncate">{displayName}</span>
            <span className="text-xs text-slate-400 truncate" title={displayEmail}>{displayEmail}</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
