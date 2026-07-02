import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { Button } from '@/components/common/Button';
import heroAvatars from '@/assets/images/hero-avatars.jpg';
import { SignupModal } from '@/components/auth/SignupModal';
import { ArrowRight, PlayCircle, BarChart3, Trophy, Mic, Users } from 'lucide-react';

export function Hero() {
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);

  return (
    <section
      aria-label="Hero Section"
      className="relative min-h-screen flex flex-col md:flex-row items-center overflow-hidden bg-white"
    >
      {/* Soft background shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(255,214,0,0.12) 0%, transparent 70%)' }} />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(29,31,76,0.05) 0%, transparent 70%)' }} />
      </div>

      <div className="container mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center w-full relative z-10 gap-8 min-h-screen">

        {/* ── Left: Text Content ── */}
        <div className="flex-1 flex flex-col justify-center pt-28 md:pt-0 z-20">

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#FFD600]/20 border border-[#FFD600]/40 mb-7 w-fit"
          >
            <span className="w-2 h-2 rounded-full bg-[#FFD600] animate-pulse" />
            <span className="text-sm font-semibold text-[#1D1F4C]">The Future of Training is Here</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-extrabold text-[48px] md:text-[60px] lg:text-[72px] leading-[1.08] tracking-tight mb-7 text-[#1D1F4C]"
          >
            Mixed Reality AI
            <br />
            <span className="relative inline-block">
              <span className="text-[#FFD600]">Powered Learning</span>
              <svg className="absolute w-full h-[14px] -bottom-2 left-0" viewBox="0 0 354 14" fill="none" preserveAspectRatio="none">
                <path d="M2 8C58 2 190 -1 352 7C246 9 101 12 2 9Z" fill="#FFD600" opacity="0.5"/>
              </svg>
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-slate-500 leading-relaxed mb-10 max-w-[500px]"
          >
            Empowering students, educators, and professionals with AI-driven skill development and immersive industry-aligned education.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-wrap items-center gap-4"
          >
            <Button
              onClick={() => setIsSignupModalOpen(true)}
              className="group bg-[#FFD600] hover:bg-[#e6c100] text-[#1D1F4C] px-8 h-[52px] rounded-full text-[15px] font-bold transition-all shadow-[0_4px_20px_rgba(255,214,0,0.45)] hover:shadow-[0_6px_28px_rgba(255,214,0,0.6)] flex items-center gap-2 hover:scale-105"
            >
              Get Started Now
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Link to="/login">
              <Button className="bg-white hover:bg-slate-50 border-2 border-[#1D1F4C]/15 text-[#1D1F4C] px-8 h-[52px] rounded-full text-[15px] font-semibold transition-all flex items-center gap-2 shadow-sm">
                <PlayCircle className="w-5 h-5 text-[#1D1F4C]" />
                Existing User Login
              </Button>
            </Link>
          </motion.div>

          {/* Trust strip */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex items-center gap-5 mt-10 pt-8 border-t border-slate-100"
          >
            <div className="flex -space-x-2">
              {['#FFD600', '#1D1F4C', '#34d399', '#60a5fa'].map((c, i) => (
                <div key={i} className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-bold" style={{ background: c }}>
                  <Users className="w-3.5 h-3.5 text-white" />
                </div>
              ))}
            </div>
            <div>
              <p className="text-[#1D1F4C] text-sm font-bold">Trusted by Enterprises</p>
              <p className="text-slate-400 text-xs">across EMEA & APAC Region</p>
            </div>
          </motion.div>

          {/* Mini stat pills */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="flex flex-wrap gap-3 mt-6"
          >
            {[
              { icon: BarChart3, label: '25+ Solutions' },
              { icon: Trophy, label: '1st in EMEA & APAC' },
              { icon: Mic, label: 'AI-Powered Feedback' },
            ].map(({ icon: Icon, label }) => (
              <span key={label} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#F8F9FA] border border-slate-100 rounded-full text-xs font-semibold text-[#1D1F4C]">
                <Icon className="w-3.5 h-3.5 text-[#FFD600]" />
                {label}
              </span>
            ))}
          </motion.div>
        </div>

        {/* ── Right: Single Clean Avatar + Decorative Cards ── */}
        <div className="flex-1 relative flex items-end justify-center min-h-[520px] md:min-h-screen">

          {/* Yellow decorative arc behind avatar */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[380px] h-[380px] rounded-full border-[3px] border-dashed border-[#FFD600]/20 pointer-events-none" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[280px] h-[280px] rounded-full bg-[#FFD600]/8 blur-[60px] pointer-events-none" />

          {/* The Avatars — user provided 3D image */}
          <div className="relative z-20 h-[460px] md:h-[600px] w-full flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                opacity: { duration: 0.8, delay: 0.4 },
                y: { duration: 0.8, delay: 0.4 },
              }}
              className="relative w-full max-w-[550px] aspect-square md:aspect-auto md:h-full z-10"
            >
              <img 
                src={heroAvatars} 
                alt="TFG AI Mentors" 
                className="w-full h-full object-contain drop-shadow-[0_20px_40px_rgba(29,31,76,0.12)] mix-blend-multiply" 
              />
            </motion.div>
          </div>

          {/* Floating card — top left of avatar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0, y: [0, -5, 0] }}
            transition={{ opacity: { delay: 0.8, duration: 0.5 }, x: { delay: 0.8, duration: 0.5 }, y: { duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1 } }}
            className="absolute top-[18%] left-[2%] z-30 bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.1)] border border-slate-100 p-4 min-w-[155px]"
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="w-7 h-7 rounded-lg bg-[#FFD600]/20 flex items-center justify-center">
                <BarChart3 className="w-4 h-4 text-[#1D1F4C]" />
              </div>
              <span className="text-slate-400 text-[11px] font-medium">Performance Score</span>
            </div>
            <p className="text-[#1D1F4C] font-bold text-xl leading-none">92%</p>
            <p className="text-[#FFD600] text-[11px] mt-1 font-semibold">+12% this month</p>
          </motion.div>

          {/* Floating card — mid right */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0, y: [0, -7, 0] }}
            transition={{ opacity: { delay: 1, duration: 0.5 }, x: { delay: 1, duration: 0.5 }, y: { duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1.2 } }}
            className="absolute top-[38%] right-[2%] z-30 bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.1)] border border-slate-100 p-4 min-w-[155px]"
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="w-7 h-7 rounded-lg bg-[#FFD600]/20 flex items-center justify-center">
                <Trophy className="w-4 h-4 text-[#1D1F4C]" />
              </div>
              <span className="text-slate-400 text-[11px] font-medium">Modules Completed</span>
            </div>
            <p className="text-[#1D1F4C] font-bold text-xl leading-none">14 / 20</p>
            <p className="text-[#FFD600] text-[11px] mt-1 font-semibold">Leadership track</p>
          </motion.div>

          {/* Floating card — bottom left */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0, y: [0, -5, 0] }}
            transition={{ opacity: { delay: 1.2, duration: 0.5 }, x: { delay: 1.2, duration: 0.5 }, y: { duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 1.5 } }}
            className="absolute bottom-[18%] left-[3%] z-30 bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.1)] border border-slate-100 p-4 min-w-[155px]"
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="w-7 h-7 rounded-lg bg-[#FFD600]/20 flex items-center justify-center">
                <Mic className="w-4 h-4 text-[#1D1F4C]" />
              </div>
              <span className="text-slate-400 text-[11px] font-medium">Speaking Pace</span>
            </div>
            <p className="text-[#1D1F4C] font-bold text-xl leading-none">142 WPM</p>
            <p className="text-[#FFD600] text-[11px] mt-1 font-semibold">Good — keep it up!</p>
          </motion.div>
        </div>
      </div>

      <SignupModal isOpen={isSignupModalOpen} onClose={() => setIsSignupModalOpen(false)} />
    </section>
  );
}
