import { USER_PROFILE } from '@/data/dashboard';
import { motion } from 'framer-motion';

export function WelcomeBanner() {
  const mockName = localStorage.getItem('mock_user_name');
  const displayName = mockName || USER_PROFILE.name;

  return (
    <div className="px-10 pt-10 pb-4">
      <div className="bg-[#1D1F4C] px-10 py-10 rounded-3xl shadow-lg relative overflow-hidden">
        {/* Abstract pattern */}
        <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-[-50%] right-[-10%] w-[400px] h-[400px] bg-[#FFD600]/15 rounded-full blur-[80px]" />
            <div className="absolute bottom-[-50%] left-[-10%] w-[300px] h-[300px] bg-white/5 rounded-full blur-[60px]" />
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,214,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,214,0,0.03)_1px,transparent_1px)] bg-[size:30px_30px]" />
        </div>
        
        <div className="relative z-10">
            <motion.h1 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl font-extrabold text-white mb-3 tracking-tight"
            >
              Welcome back, <span className="text-[#FFD600]">{displayName}</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-slate-300 font-medium text-base max-w-lg leading-relaxed"
            >
              Ready to enhance your skills today? We've prepared a personalized learning path based on your latest performance.
            </motion.p>
        </div>
      </div>
    </div>
  );
}
