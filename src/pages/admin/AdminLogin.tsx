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
      <div className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] bg-[#FFD600]/10 rounded-full blur-[120px] pointer-events-none" /> 
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-[#1D1F4C]/5 rounded-full blur-[100px] pointer-events-none" /> 
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        className="w-full max-w-md bg-white border border-slate-100 p-10 rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.08)] relative z-10"
      > 
        <div className="text-center mb-10"> 
          <div className="bg-[#1D1F4C] inline-block p-4 rounded-xl mb-6 shadow-sm">
            <img src={logoImg} alt="TFG" className="h-8 mx-auto object-contain" /> 
          </div>
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#1D1F4C]/5 text-[#1D1F4C] mb-4"> 
            <Shield size={24} /> 
          </div> 
          <h2 className="text-2xl font-extrabold text-[#1D1F4C] mb-2">Admin Portal</h2> 
          <p className="text-slate-500 text-sm font-medium">Restricted Access Area</p> 
        </div> 

        <form onSubmit={handleLogin} className="space-y-6"> 
          <div> 
            <label className="block text-sm font-bold text-[#1D1F4C] mb-2 uppercase tracking-wider text-[11px]">Access Key</label> 
            <div className="relative"> 
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"> 
                <Lock className="h-4 w-4 text-slate-400" /> 
              </div> 
              <input 
                type="password" 
                value={password} 
                onChange={(e) => { setPassword(e.target.value); setError(''); }} 
                className="block w-full pl-11 pr-4 py-3.5 bg-[#F8F9FA] border border-slate-200 rounded-xl text-[#1D1F4C] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#FFD600]/40 focus:border-[#FFD600] transition-all font-medium" 
                placeholder="Enter admin passcode" 
                required 
              /> 
            </div> 
            {error && <p className="mt-3 text-sm text-red-500 font-medium bg-red-50 p-2.5 rounded-lg border border-red-100 text-center">⚠️ {error}</p>} 
          </div> 
          
          <Button 
            type="submit" 
            className="w-full bg-[#1D1F4C] hover:bg-[#2A2D6C] text-white font-bold py-4 text-lg rounded-xl transition-all shadow-[0_4px_14px_rgba(29,31,76,0.2)] hover:shadow-[0_6px_20px_rgba(29,31,76,0.3)]"
          > 
            Authenticate 
          </Button> 
        </form> 
      </motion.div> 
    </div> 
  ); 
}
