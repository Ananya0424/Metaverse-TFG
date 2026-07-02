import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { Button } from '@/components/common/Button';
import { SignupModal } from '@/components/auth/SignupModal';
import { ArrowRight, PlayCircle, Mic, BarChart3, Brain, Trophy, Users } from 'lucide-react';

// Floating dashboard mini-cards to replace the avatar
const floatingCards = [
  {
    icon: BarChart3,
    title: 'Performance Score',
    value: '92%',
    sub: '+12% this month',
    color: '#FFD600',
    style: { top: '8%', right: '5%' },
    delay: 0.5,
  },
  {
    icon: Trophy,
    title: 'Modules Completed',
    value: '14 / 20',
    sub: 'Leadership track',
    color: '#a78bfa',
    style: { top: '35%', right: '2%' },
    delay: 0.7,
  },
  {
    icon: Mic,
    title: 'Speaking Pace',
    value: '142 WPM',
    sub: 'Good — keep it up!',
    color: '#34d399',
    style: { bottom: '30%', right: '8%' },
    delay: 0.9,
  },
  {
    icon: Brain,
    title: 'AI Feedback Ready',
    value: '3 Reports',
    sub: 'Tap to review',
    color: '#60a5fa',
    style: { bottom: '10%', right: '15%' },
    delay: 1.1,
  },
];

export function Hero() {
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);

  return (
    <section
      aria-label="Hero Section"
      className="relative min-h-[95vh] flex flex-col md:flex-row items-center overflow-hidden bg-[#0b0822]"
    >
      {/* ── Immersive Background ── */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[900px] h-[900px] bg-[#1a1344] rounded-full blur-[150px] opacity-80" />
        <div className="absolute bottom-[-20%] right-[-5%] w-[700px] h-[700px] bg-[#FFD600]/8 rounded-full blur-[150px]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_20%,transparent_100%)]" />
      </div>

      <div className="container mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center w-full relative z-10 pt-12 md:pt-0 gap-12">

        {/* ── Left: Text Content ── */}
        <div className="flex-1 flex flex-col justify-center z-20 max-w-[600px]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm mb-8 w-fit"
          >
            <span className="w-2 h-2 rounded-full bg-[#FFD600] animate-pulse" />
            <span className="text-sm font-medium text-slate-300">The Future of Training is Here</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, type: 'spring', bounce: 0.4 }}
            className="font-['Montserrat',sans-serif] font-[800] text-[52px] md:text-[68px] lg:text-[80px] leading-[1.05] tracking-tight mb-8 text-white"
          >
            Mixed Reality AI
            <br />
            <span className="text-[#FFD600] relative inline-block mt-2">
              Powered Learning
              <svg className="absolute w-full h-[20px] -bottom-3 left-0 opacity-70" viewBox="0 0 354 18" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
                <path d="M2.20302 11.2365C58.625 3.32943 189.658 -2.48496 351.696 9.47954C352.488 9.53835 352.548 10.6696 351.776 10.7937C246.069 12.4924 100.91 16.5332 2.22239 12.8732C1.51731 12.8468 1.48792 11.336 2.20302 11.2365Z" fill="#FFD600" />
              </svg>
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-slate-400 leading-relaxed mb-12 max-w-[520px]"
          >
            Empowering students, educators, and professionals with AI-driven skill development and immersive industry-aligned education.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap items-center gap-5 md:gap-6"
          >
            <Button
              onClick={() => setIsSignupModalOpen(true)}
              className="group bg-[#FFD600] hover:bg-[#e6c100] text-[#0b0822] px-8 py-0 h-[56px] rounded-full text-[16px] font-bold transition-all duration-300 shadow-[0_0_25px_rgba(255,214,0,0.35)] hover:shadow-[0_0_40px_rgba(255,214,0,0.55)] flex items-center gap-2 hover:scale-105"
            >
              Get Started Now
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Link to="/login" className="block">
              <Button className="bg-transparent hover:bg-white/5 border border-white/20 text-white px-8 py-0 h-[56px] rounded-full text-[16px] font-medium transition-all duration-300 flex items-center gap-2 backdrop-blur-sm">
                <PlayCircle className="w-5 h-5" />
                Existing User Login
              </Button>
            </Link>
          </motion.div>

          {/* Trust badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex items-center gap-6 mt-10 pt-10 border-t border-white/5"
          >
            <div className="flex -space-x-2">
              {['#FFD600', '#a78bfa', '#34d399', '#60a5fa'].map((c, i) => (
                <div key={i} className="w-8 h-8 rounded-full border-2 border-[#0b0822] flex items-center justify-center" style={{ background: c }}>
                  <Users className="w-3.5 h-3.5 text-[#0b0822]" />
                </div>
              ))}
            </div>
            <div>
              <p className="text-white text-sm font-semibold">10,000+ Professionals</p>
              <p className="text-slate-500 text-xs">already training on TFG</p>
            </div>
          </motion.div>
        </div>

        {/* ── Right: Floating Dashboard Cards ── */}
        <div className="flex-1 flex justify-center lg:justify-end items-center w-full relative mt-8 md:mt-0 min-h-[480px] md:min-h-[560px]">
          {/* Central glow orb */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, delay: 0.3 }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
          >
            <div className="w-[320px] h-[320px] rounded-full bg-[#FFD600]/10 blur-[80px]" />
          </motion.div>

          {/* Central illustration - abstract rings */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="relative w-[300px] h-[300px] flex items-center justify-center"
          >
            {[280, 220, 160, 100].map((size, i) => (
              <motion.div
                key={size}
                className="absolute rounded-full border border-[#FFD600]/10"
                style={{ width: size, height: size }}
                animate={{ rotate: i % 2 === 0 ? 360 : -360 }}
                transition={{ duration: 20 + i * 5, repeat: Infinity, ease: 'linear' }}
              />
            ))}
            {/* Center badge */}
            <div className="relative z-10 w-20 h-20 rounded-2xl bg-[#FFD600]/10 border border-[#FFD600]/30 flex flex-col items-center justify-center backdrop-blur-sm">
              <Brain className="w-8 h-8 text-[#FFD600]" />
              <span className="text-[9px] text-[#FFD600] font-bold mt-1">AI CORE</span>
            </div>

            {/* Floating orbit dots */}
            {[0, 60, 120, 180, 240, 300].map((deg, i) => (
              <motion.div
                key={deg}
                className="absolute w-2 h-2 rounded-full bg-[#FFD600]"
                style={{
                  top: `${50 - 45 * Math.sin((deg * Math.PI) / 180)}%`,
                  left: `${50 + 45 * Math.cos((deg * Math.PI) / 180)}%`,
                  opacity: 0.4 + (i % 3) * 0.2
                }}
                animate={{ scale: [1, 1.5, 1] }}
                transition={{ duration: 2, delay: i * 0.3, repeat: Infinity }}
              />
            ))}
          </motion.div>

          {/* Floating metric cards */}
          {floatingCards.map(({ icon: Icon, title, value, sub, color, style, delay }) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, scale: 0.7, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: [0, -8, 0] }}
              transition={{
                opacity: { duration: 0.5, delay },
                scale: { duration: 0.5, delay },
                y: { duration: 4 + Math.random() * 2, repeat: Infinity, ease: 'easeInOut', delay: delay + 0.5 },
              }}
              className="absolute bg-[#0b0822]/90 backdrop-blur-md border border-white/10 rounded-2xl p-4 shadow-2xl min-w-[160px]"
              style={style}
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: `${color}22` }}>
                  <Icon className="w-4 h-4" style={{ color }} />
                </div>
                <span className="text-slate-400 text-[11px] font-medium">{title}</span>
              </div>
              <p className="text-white font-bold text-lg leading-none">{value}</p>
              <p className="text-[11px] mt-1" style={{ color }}>{sub}</p>
            </motion.div>
          ))}
        </div>
      </div>

      <SignupModal isOpen={isSignupModalOpen} onClose={() => setIsSignupModalOpen(false)} />
    </section>
  );
}
