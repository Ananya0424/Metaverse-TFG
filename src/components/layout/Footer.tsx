import { Link } from 'react-router-dom';
import logoImg from '@/assets/images/logo.png';
export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-8 border-t border-slate-800">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          
          {/* Brand Info */}
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-6">
              <img src={logoImg} alt="TFG Logo" className="h-8 w-auto object-contain brightness-0 invert" />
            </Link>
            <p className="text-sm text-slate-400 mb-6 max-w-sm">
              WebGL VR Learning Platform featuring immersive training experiences in Leadership, Innovation, Sales, and Customer Experience.
            </p>
          </div>

          {/* Platform Links */}
          <div className="col-span-1">
            <h4 className="text-white font-semibold mb-6">Platform</h4>
            <ul className="space-y-4 text-sm">
              <li><Link to="/modules" className="hover:text-primary transition-colors">Learning Modules</Link></li>
              <li><Link to="/reports" className="hover:text-primary transition-colors">Performance Reports</Link></li>
              <li><Link to="/login" className="hover:text-primary transition-colors">Login</Link></li>
              <li><Link to="/register" className="hover:text-primary transition-colors">Register</Link></li>
            </ul>
          </div>

          {/* Module Categories */}
          <div className="col-span-1">
            <h4 className="text-white font-semibold mb-6">Module Categories</h4>
            <ul className="space-y-4 text-sm text-slate-400">
              <li>Leadership & Management</li>
              <li>Innovation</li>
              <li>Sales Excellence</li>
              <li>Customer Experience</li>
            </ul>
          </div>

        </div>

        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row items-center justify-between text-sm text-slate-500">
          <p>&copy; {currentYear} TFG VR Learning Platform. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
