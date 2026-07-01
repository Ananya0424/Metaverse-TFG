import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { Button } from '@/components/common/Button';
import aiHuman from '@/assets/images/ai-human.png';
import { SignupModal } from '@/components/auth/SignupModal';
import { PlayCircle, ArrowRight } from 'lucide-react';

export function Hero() {
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);

  const handleNewUser = () => {
    setIsSignupModalOpen(true);
  };

  return (
    <section 
      aria-label="Hero Section"
      className="relative min-h-[90vh] md:min-h-[95vh] flex flex-col md:flex-row items-center overflow-hidden bg-[#0b0822]"
    >
      {/* Immersive Dark Background with Glowing Accents */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Subtle glowing orbs */}
        <div className="absolute top-[-20%] left-[-10%] w-[1000px] h-[1000px] bg-[#1a1344] rounded-full blur-[150px] opacity-80" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[800px] h-[800px] bg-[#FFD600]/10 rounded-full blur-[150px] opacity-60" />
        
        {/* Grid pattern for tech feel */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_20%,transparent_100%)]" />
      </div>

      <div className="container mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center w-full relative z-10 pt-12 md:pt-0">
        
        {/* Text Content */}
        <div className="flex-1 flex flex-col justify-center pb-10 md:pb-0 z-20">
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
            transition={{ duration: 0.8, delay: 0.1, type: "spring", bounce: 0.4 }}
            className="font-['Montserrat',sans-serif] font-[800] text-[56px] md:text-[72px] lg:text-[84px] leading-[1.05] tracking-tight mb-8 text-white"
          >
            Mixed Reality AI
            <br />
            <span className="text-[#FFD600] relative inline-block mt-2">
              Powered Learning
              <svg className="absolute w-full h-[24px] -bottom-4 left-0 opacity-80" viewBox="0 0 354 18" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
                <path d="M2.20302 11.2365C58.625 3.32943 189.658 -2.48496 351.696 9.47954C352.488 9.53835 352.548 10.6696 351.776 10.7937C246.069 12.4924 100.91 16.5332 2.22239 12.8732C1.51731 12.8468 1.48792 11.336 2.20302 11.2365Z" fill="#FFD600"/>
              </svg>
            </span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, type: "spring", bounce: 0.3 }}
            className="text-lg md:text-xl lg:text-2xl text-slate-300 leading-relaxed mb-12 max-w-[540px] font-light"
          >
            Empowering students, educators, and professionals with AI-driven skill development and immersive industry-aligned education.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, type: "spring", bounce: 0.3 }}
            className="flex flex-wrap items-center gap-5 md:gap-6"
          >
            <Button 
              onClick={handleNewUser}
              className="group bg-[#FFD600] hover:bg-[#e6c100] text-[#0b0822] px-8 py-0 h-[56px] rounded-full text-[16px] font-bold transition-all duration-300 shadow-[0_0_20px_rgba(255,214,0,0.3)] hover:shadow-[0_0_30px_rgba(255,214,0,0.5)] flex items-center gap-2 hover:scale-105"
            >
              Get Started Now
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Link to="/login" className="block">
              <Button 
                className="bg-transparent hover:bg-white/5 border border-white/20 text-white px-8 py-0 h-[56px] rounded-full text-[16px] font-medium transition-all duration-300 flex items-center gap-2 backdrop-blur-sm"
              >
                <PlayCircle className="w-5 h-5" />
                Existing User Login
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* Visual Content - Floating in Space */}
        <div className="flex-1 flex justify-center lg:justify-end items-center w-full relative mt-12 md:mt-0">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="relative w-full max-w-[600px] lg:max-w-[800px]"
          >
            {/* Ambient glow behind image */}
            <div className="absolute inset-0 bg-[#FFD600]/20 blur-[100px] rounded-full" />
            
            <motion.img 
              src={aiHuman}
              alt="Mixed Reality AI Character"
              animate={{ 
                y: [0, -15, 0],
              }}
              transition={{ 
                duration: 6, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
              className="relative w-full h-auto object-contain drop-shadow-[0_0_40px_rgba(0,0,0,0.5)] z-20"
            />
          </motion.div>
        </div>

      </div>

      <SignupModal 
        isOpen={isSignupModalOpen} 
        onClose={() => setIsSignupModalOpen(false)} 
      />
    </section>
  );
}
