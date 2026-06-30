import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Header } from '@/components/layout/Header';
import aiHuman from '@/assets/images/ai-human.png';
import api from '@/services/api';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [forgotPasswordSuccess, setForgotPasswordSuccess] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    try {
      const response = await api.post('/auth/login', { email, password });
      
      if (response.data && response.data.token) {
        login(response.data.token);
        navigate('/dashboard', { replace: true });
      } else {
        setError('Unexpected response from server.');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid email or password.');
    }
  };

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your email address first.');
      return;
    }
    setError('');
    // Simulate sending an email
    setForgotPasswordSuccess('If an account exists with this email, a reset link has been sent.');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F4EE] overflow-hidden relative">
      <Header />
      
      {/* Main Content Area */}
      <div className="flex-1 flex pt-[72px] relative w-full max-w-[1400px] mx-auto">
        
        {/* Left Side - AI Character & Decor */}
        <div className="hidden lg:block lg:w-[55%] relative">
          {/* Decorative arch/doorway effect could go here if we had the asset, 
              using ai-human for now as the main character */}
          <img 
            src={aiHuman} 
            alt="AI Assistant" 
            className="absolute bottom-0 left-10 h-[90%] w-auto object-contain z-10 drop-shadow-2xl"
          />
        </div>

        {/* Right Side - Login Box */}
        <div className="w-full lg:w-[45%] flex items-center justify-center relative z-20 px-6">
          <div className="w-full max-w-[480px] bg-white shadow-[0_10px_40px_rgba(0,0,0,0.08)] rounded-xl p-8 lg:p-10 relative lg:-ml-10">
            
            <h2 className="text-[26px] font-bold text-[#1D1F4C] mb-8">
              {isForgotPassword ? 'Reset Password' : 'Login Details'}
            </h2>

            {error && (
              <div className="mb-6 p-3 bg-red-50 text-red-600 text-sm rounded-md border border-red-200">
                {error}
              </div>
            )}
            
            {forgotPasswordSuccess && (
              <div className="mb-6 p-3 bg-green-50 text-green-600 text-sm rounded-md border border-green-200">
                {forgotPasswordSuccess}
              </div>
            )}

            {!isForgotPassword ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Email Field */}
                  <div>
                    <label className="block text-[14px] font-bold text-[#1D1F4C] mb-2" htmlFor="email">
                      Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 border border-slate-200 focus:ring-1 focus:ring-[#1A74E3] focus:border-[#1A74E3] outline-none transition-all text-[14px] placeholder-slate-400"
                      placeholder="Email"
                    />
                  </div>

                  {/* Password Field */}
                  <div>
                    <label className="block text-[14px] font-bold text-[#1D1F4C] mb-2" htmlFor="password">
                      Password
                    </label>
                    <input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-4 py-3 border border-slate-200 focus:ring-1 focus:ring-[#1A74E3] focus:border-[#1A74E3] outline-none transition-all text-[14px] placeholder-slate-400"
                      placeholder="Password"
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <button 
                  type="submit" 
                  className="w-full py-3 bg-[#1A74E3] hover:bg-blue-700 text-white font-bold text-[15px] transition-colors mt-2"
                >
                  Login
                </button>

                {/* Forgot Password */}
                <div className="pt-2">
                  <button 
                    type="button"
                    onClick={() => { setError(''); setForgotPasswordSuccess(''); setIsForgotPassword(true); }}
                    className="text-[#1A74E3] text-[14px] hover:underline bg-transparent border-none p-0 cursor-pointer"
                  >
                    Forgot Password?
                  </button>
                </div>

                {/* Terms Footer */}
                <div className="pt-5">
                  <p className="text-[12px] text-slate-500 text-center leading-relaxed">
                    By sending the request you confirm you accept our{' '}
                    <a href="#" className="text-[#1A74E3] hover:underline">Terms of Service</a>{' '}
                    and{' '}
                    <a href="#" className="text-[#1A74E3] hover:underline">Privacy Policy</a>.
                  </p>
                </div>
              </form>
            ) : (
              <form onSubmit={handleForgotPassword} className="space-y-6">
                <div>
                  <p className="text-[14px] text-slate-600 mb-4">
                    Enter your email address and we'll send you a link to reset your password.
                  </p>
                  <label className="block text-[14px] font-bold text-[#1D1F4C] mb-2" htmlFor="reset-email">
                    Email Address
                  </label>
                  <input
                    id="reset-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 border border-slate-200 focus:ring-1 focus:ring-[#1A74E3] focus:border-[#1A74E3] outline-none transition-all text-[14px] placeholder-slate-400"
                    placeholder="Enter your email"
                  />
                </div>

                <div className="flex flex-col gap-3">
                  <button 
                    type="submit" 
                    className="w-full py-3 bg-[#1A74E3] hover:bg-blue-700 text-white font-bold text-[15px] transition-colors"
                  >
                    Send Reset Link
                  </button>
                  <button 
                    type="button"
                    onClick={() => { setError(''); setForgotPasswordSuccess(''); setIsForgotPassword(false); }}
                    className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[15px] transition-colors"
                  >
                    Back to Login
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
