import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { Button } from '@/components/common/Button';
import aiHuman from '@/assets/images/ai-human.png';
import { SignupModal } from '@/components/auth/SignupModal';
import { ArrowRight, PlayCircle, Mic, BarChart3, Trophy, Users } from 'lucide-react';

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
    icon: BarChart3,
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

        {/* ── Right: Triangle Avatar Formation ── */}
        <div className="flex-1 flex justify-center lg:justify-end items-end w-full relative mt-8 md:mt-0 min-h-[500px] md:min-h-[580px] overflow-visible">

          {/* Background glow behind avatars */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[500px] h-[400px] bg-[#FFD600]/10 blur-[100px] rounded-full pointer-events-none" />

          {/* ── LEFT Avatar (behind, left side) ── */}
          <motion.div
            initial={{ opacity: 0, x: -40, y: 20 }}
            animate={{ opacity: 1, x: 0, y: [0, -6, 0] }}
            transition={{
              opacity: { duration: 0.7, delay: 0.5 },
              x: { duration: 0.7, delay: 0.5 },
              y: { duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 },
            }}
            className="absolute bottom-0 z-10"
            style={{ left: '2%' }}
          >
            {/* Subtle glow ring */}
            <div className="absolute inset-x-0 bottom-0 h-20 bg-[#FFD600]/15 blur-2xl rounded-full mx-4" />
            <img
              src={aiHuman}
              alt="AI Trainer Left"
              className="h-[340px] md:h-[400px] w-auto object-contain drop-shadow-[0_10px_30px_rgba(0,0,0,0.6)]"
              style={{ filter: 'brightness(0.55) saturate(0.7)' }}
            />
          </motion.div>

          {/* ── RIGHT Avatar (behind, right side) ── */}
          <motion.div
            initial={{ opacity: 0, x: 40, y: 20 }}
            animate={{ opacity: 1, x: 0, y: [0, -8, 0] }}
            transition={{
              opacity: { duration: 0.7, delay: 0.6 },
              x: { duration: 0.7, delay: 0.6 },
              y: { duration: 5.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 },
            }}
            className="absolute bottom-0 z-10"
            style={{ right: '2%' }}
          >
            <div className="absolute inset-x-0 bottom-0 h-20 bg-[#FFD600]/15 blur-2xl rounded-full mx-4" />
            <img
              src={aiHuman}
              alt="AI Trainer Right"
              className="h-[340px] md:h-[400px] w-auto object-contain drop-shadow-[0_10px_30px_rgba(0,0,0,0.6)] scale-x-[-1]"
              style={{ filter: 'brightness(0.55) saturate(0.7)' }}
            />
          </motion.div>

          {/* ── CENTER Avatar (front, main) ── */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: [0, -10, 0] }}
            transition={{
              opacity: { duration: 0.8, delay: 0.4 },
              y: { duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 0.8 },
            }}
            className="absolute bottom-0 z-20"
            style={{ left: '50%', transform: 'translateX(-50%)' }}
          >
            {/* Strong glow under main avatar */}
            <div className="absolute inset-x-0 bottom-0 h-24 bg-[#FFD600]/25 blur-3xl rounded-full mx-2" />
            <img
              src={aiHuman}
              alt="AI Trainer Center"
              className="h-[420px] md:h-[500px] w-auto object-contain drop-shadow-[0_0_40px_rgba(255,214,0,0.25)]"
            />
          </motion.div>

          {/* ── Floating stat cards (on top of avatars) ── */}
          {floatingCards.map(({ icon: Icon, title, value, sub, color, style, delay }) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1, y: [0, -6, 0] }}
              transition={{
                opacity: { duration: 0.5, delay },
                scale: { duration: 0.5, delay },
                y: { duration: 4, repeat: Infinity, ease: 'easeInOut', delay: delay + 0.5 },
              }}
              className="absolute bg-[#0b0822]/90 backdrop-blur-md border border-white/10 rounded-2xl p-4 shadow-2xl min-w-[150px] z-30"
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
