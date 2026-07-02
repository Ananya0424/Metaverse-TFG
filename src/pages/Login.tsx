import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { motion } from 'framer-motion';
import logoImg from '@/assets/images/logo.png';
import api from '@/services/api';
import { Eye, EyeOff, Mail, Lock, Zap, Shield, Trophy, Brain } from 'lucide-react';

const features = [
  { icon: Brain, title: 'AI-Powered Training', desc: 'Personalized learning paths driven by advanced AI' },
  { icon: Zap, title: 'Mixed Reality', desc: 'Immersive VR & AR simulations for real-world skill building' },
  { icon: Trophy, title: 'Performance Analytics', desc: 'Detailed reports and feedback on every session' },
  { icon: Shield, title: 'Industry Certified', desc: 'Recognized by top enterprises worldwide' },
];

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
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
    setIsLoading(true);
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
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your email address first.');
      return;
    }
    setError('');
    setForgotPasswordSuccess('If an account exists with this email, a reset link has been sent.');
  };

  return (
    <div className="min-h-screen flex bg-[#050410] overflow-hidden">

      {/* ── Left Panel ── */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-12 overflow-hidden">

        {/* Animated background blobs */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[-15%] left-[-15%] w-[700px] h-[700px] bg-[#FFD600]/8 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-15%] right-[-15%] w-[600px] h-[600px] bg-[#4f46e5]/15 rounded-full blur-[120px]" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px]" />
        </div>

        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10"
        >
          <Link to="/">
            <img src={logoImg} alt="TFG Logo" className="h-12 w-auto object-contain drop-shadow-[0_0_15px_rgba(255,214,0,0.5)]" />
          </Link>
        </motion.div>

        {/* Center Content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative z-10"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#FFD600]/10 border border-[#FFD600]/20 mb-6">
            <span className="w-2 h-2 rounded-full bg-[#FFD600] animate-pulse" />
            <span className="text-sm text-[#FFD600] font-medium">AI-Powered Learning Platform</span>
          </div>

          <h1 className="text-[52px] font-extrabold text-white leading-tight mb-6 tracking-tight">
            Train Smarter.<br />
            <span className="text-[#FFD600]">Grow Faster.</span>
          </h1>

          <p className="text-slate-400 text-lg leading-relaxed mb-10 max-w-md">
            Step into the future of professional development. Experience immersive AI-driven training built for real-world excellence.
          </p>

          {/* Feature Cards */}
          <div className="grid grid-cols-2 gap-4">
            {features.map(({ icon: Icon, title, desc }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + i * 0.1 }}
                className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-4 backdrop-blur-sm hover:bg-white/[0.07] hover:border-[#FFD600]/20 transition-all duration-300 group"
              >
                <div className="w-9 h-9 rounded-xl bg-[#FFD600]/10 flex items-center justify-center mb-3 group-hover:bg-[#FFD600]/20 transition-colors">
                  <Icon className="w-5 h-5 text-[#FFD600]" />
                </div>
                <p className="text-white font-semibold text-sm mb-1">{title}</p>
                <p className="text-slate-500 text-xs leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Bottom Quote */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="relative z-10"
        >
          <p className="text-slate-600 text-sm">
            © 2025 TFG MR-AI Platform. All rights reserved.
          </p>
        </motion.div>
      </div>

      {/* ── Divider Line ── */}
      <div className="hidden lg:block w-px bg-gradient-to-b from-transparent via-white/10 to-transparent self-stretch" />

      {/* ── Right Panel – Form ── */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12 relative">
        {/* Background accent */}
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-[#FFD600]/5 rounded-full blur-[100px] pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="w-full max-w-[440px] relative z-10"
        >
          {/* Mobile Logo */}
          <div className="lg:hidden mb-8 flex justify-center">
            <Link to="/">
              <img src={logoImg} alt="TFG Logo" className="h-10 w-auto object-contain drop-shadow-[0_0_15px_rgba(255,214,0,0.5)]" />
            </Link>
          </div>

          {/* Header */}
          <div className="mb-8">
            <h2 className="text-[32px] font-bold text-white tracking-tight mb-2">
              {isForgotPassword ? '🔑 Reset Password' : 'Welcome Back'}
            </h2>
            <p className="text-slate-400 text-[15px]">
              {isForgotPassword
                ? 'Enter your email to receive a reset link.'
                : 'Sign in to continue your learning journey.'}
            </p>
          </div>

          {/* Alerts */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-red-500/10 text-red-400 text-sm rounded-2xl border border-red-500/20 flex items-center gap-3"
            >
              <span className="text-lg">⚠️</span> {error}
            </motion.div>
          )}
          {forgotPasswordSuccess && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-green-500/10 text-green-400 text-sm rounded-2xl border border-green-500/20 flex items-center gap-3"
            >
              <span className="text-lg">✅</span> {forgotPasswordSuccess}
            </motion.div>
          )}

          {!isForgotPassword ? (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2" htmlFor="email">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-11 pr-4 py-3.5 bg-white/[0.05] border border-white/10 rounded-2xl focus:ring-2 focus:ring-[#FFD600]/50 focus:border-[#FFD600]/50 outline-none transition-all text-white text-[14px] placeholder-slate-600 hover:border-white/20"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2" htmlFor="password">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-11 pr-12 py-3.5 bg-white/[0.05] border border-white/10 rounded-2xl focus:ring-2 focus:ring-[#FFD600]/50 focus:border-[#FFD600]/50 outline-none transition-all text-white text-[14px] placeholder-slate-600 hover:border-white/20"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Forgot Password link */}
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => { setError(''); setForgotPasswordSuccess(''); setIsForgotPassword(true); }}
                  className="text-[13px] text-slate-400 hover:text-[#FFD600] transition-colors"
                >
                  Forgot Password?
                </button>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 bg-[#FFD600] hover:bg-[#e6c100] disabled:opacity-60 text-[#050410] rounded-2xl font-bold text-[15px] transition-all duration-300 shadow-[0_0_30px_rgba(255,214,0,0.3)] hover:shadow-[0_0_40px_rgba(255,214,0,0.5)] hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <><span className="w-4 h-4 border-2 border-[#050410]/30 border-t-[#050410] rounded-full animate-spin" /> Signing In...</>
                ) : (
                  'Sign In →'
                )}
              </button>

              {/* Terms */}
              <p className="text-[12px] text-slate-600 text-center leading-relaxed pt-2">
                By signing in you accept our{' '}
                <a href="#" className="text-slate-400 hover:text-[#FFD600] transition-colors">Terms of Service</a>
                {' '}and{' '}
                <a href="#" className="text-slate-400 hover:text-[#FFD600] transition-colors">Privacy Policy</a>.
              </p>
            </form>
          ) : (
            <form onSubmit={handleForgotPassword} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2" htmlFor="reset-email">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    id="reset-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-11 pr-4 py-3.5 bg-white/[0.05] border border-white/10 rounded-2xl focus:ring-2 focus:ring-[#FFD600]/50 focus:border-[#FFD600]/50 outline-none transition-all text-white text-[14px] placeholder-slate-600"
                    placeholder="you@example.com"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full py-4 bg-[#FFD600] hover:bg-[#e6c100] text-[#050410] rounded-2xl font-bold text-[15px] transition-all shadow-[0_0_30px_rgba(255,214,0,0.3)] hover:shadow-[0_0_40px_rgba(255,214,0,0.5)] hover:scale-[1.02]"
              >
                Send Reset Link
              </button>
              <button
                type="button"
                onClick={() => { setError(''); setForgotPasswordSuccess(''); setIsForgotPassword(false); }}
                className="w-full py-4 bg-white/[0.05] hover:bg-white/10 border border-white/10 text-white rounded-2xl font-semibold text-[15px] transition-all"
              >
                ← Back to Sign In
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </div>
  );
}
