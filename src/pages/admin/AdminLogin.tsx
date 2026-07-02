import { useState } from 'react'; 
import { useNavigate } from 'react-router-dom'; 
import { motion } from 'framer-motion'; 
import { Shield, Lock } from 'lucide-react'; 
import { Button } from '@/components/common/Button'; 
import logoImg from '@/assets/images/logo.png'; 

export function AdminLogin() { 
  const [password, setPassword] = useState(''); 
  const [error, setError] = useState(''); 
  const navigate = useNavigate(); 

  const handleLogin = (e: React.FormEvent) => { 
    e.preventDefault(); 
    if (password === 'admin123' || password === 'tfgadmin2024') { 
      localStorage.setItem('isAdminAuthenticated', 'true'); 
      navigate('/admin/dashboard'); 
    } else { 
      setError('Invalid Admin Credentials'); 
    } 
  }; 

  return ( 
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col justify-center items-center px-4 relative overflow-hidden"> 
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] bg-[#FFD600]/10 rounded-full blur-[120px]" /> 
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-[#1D1F4C]/10 rounded-full blur-[100px]" /> 
        <div className="absolute inset-0 bg-[linear-gradient(rgba(29,31,76,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(29,31,76,0.03)_1px,transparent_1px)] bg-[size:30px_30px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        className="w-full max-w-md bg-[#1D1F4C] border border-white/10 p-10 rounded-[2.5rem] shadow-[0_20px_60px_rgba(29,31,76,0.3)] relative z-10 overflow-hidden"
      > 
        {/* Card inner glow */}
        <div className="absolute top-[-50px] left-[-50px] w-[150px] h-[150px] bg-[#FFD600]/20 rounded-full blur-[50px] pointer-events-none" />

        <div className="text-center mb-10 relative z-10"> 
          <img src={logoImg} alt="TFG" className="h-10 mx-auto object-contain mb-8" /> 
          
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white/5 text-[#FFD600] mb-5 border border-white/10 shadow-sm"> 
            <Shield size={28} /> 
          </div> 
          <h2 className="text-[28px] font-extrabold text-white mb-2 tracking-tight">Admin Portal</h2> 
          <p className="text-slate-400 text-[13px] font-bold uppercase tracking-widest">Restricted Access Area</p> 
        </div> 

        <form onSubmit={handleLogin} className="space-y-6 relative z-10"> 
          <div> 
            <div className="relative"> 
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"> 
                <Lock className="h-5 w-5 text-slate-400" /> 
              </div> 
              <input 
                type="password" 
                value={password} 
                onChange={(e) => { setPassword(e.target.value); setError(''); }} 
                className="block w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#FFD600]/40 focus:border-[#FFD600]/60 focus:bg-white/10 transition-all font-medium text-lg" 
                placeholder="Enter admin passcode" 
                required 
              /> 
            </div> 
            {error && <p className="mt-4 text-sm text-red-400 font-bold bg-red-400/10 p-3 rounded-xl border border-red-400/20 text-center">⚠️ {error}</p>} 
          </div> 
          
          <Button 
            type="submit" 
            className="w-full bg-[#FFD600] hover:bg-[#e6c100] text-[#1D1F4C] font-extrabold py-4 text-lg rounded-2xl transition-all shadow-[0_4px_14px_rgba(255,214,0,0.2)] hover:shadow-[0_6px_20px_rgba(255,214,0,0.4)] hover:scale-[1.02]"
          > 
            Authenticate 
          </Button> 
        </form> 
      </motion.div> 
    </div> 
  ); 
}
