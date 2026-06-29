import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { Button } from '@/components/common/Button';
import aiHuman from '@/assets/images/ai-human.png';
import { SignupModal } from '@/components/auth/SignupModal';

export function Hero() {
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);

  const handleNewUser = () => {
    setIsSignupModalOpen(true);
  };

  return (
    <section 
      aria-label="Hero Section"
      className="relative min-h-[90vh] md:min-h-screen flex flex-col md:flex-row items-stretch overflow-hidden bg-slate-50"
    >
      {/* Refined Premium Enterprise Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Soft radial gradients */}
        <div className="absolute top-[-10%] right-[0%] w-[800px] h-[800px] bg-blue-500/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[800px] h-[800px] bg-indigo-500/5 rounded-full blur-[120px]" />
        
        {/* Extremely subtle grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.015)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_70%_70%_at_50%_50%,#000_10%,transparent_100%)]" />
        
        <div className="absolute inset-0 bg-white/40 backdrop-blur-3xl" />
      </div>

      <div className="container mx-auto px-6 md:px-12 flex flex-col md:flex-row w-full relative z-10 pt-24 md:pt-0">
        
        {/* Text Content */}
        <div className="flex-1 flex flex-col justify-center pb-10 md:pb-20 md:pt-10 max-w-xl">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
            className="font-['Montserrat',sans-serif] font-[700] text-[52px] md:text-[68px] leading-[1.1] tracking-tight mb-6 md:mb-8"
          >
            <span className="text-[#1A1344] block">Mixed Reality AI</span>
            <span className="text-[#FFD600] relative inline-block mt-1">
              Powered Learning
              <svg className="absolute w-full h-[18px] -bottom-3 left-0" viewBox="0 0 354 18" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
                <path d="M2.20302 11.2365C58.625 3.32943 189.658 -2.48496 351.696 9.47954C352.488 9.53835 352.548 10.6696 351.776 10.7937C246.069 12.4924 100.91 16.5332 2.22239 12.8732C1.51731 12.8468 1.48792 11.336 2.20302 11.2365Z" fill="#FFD600"/>
              </svg>
            </span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, type: "spring", bounce: 0.3 }}
            className="text-lg md:text-xl text-slate-600 leading-relaxed mb-10 max-w-[480px]"
          >
            Empowering students, educators, and professionals with AI-driven skill development and industry-aligned education.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, type: "spring", bounce: 0.3 }}
            className="flex flex-wrap items-center gap-5 md:gap-8"
          >
            <Button 
              onClick={handleNewUser}
              className="bg-[#1c1744] hover:bg-[#2a2165] text-white px-10 py-0 h-[48px] rounded-full text-[15px] font-semibold transition-all duration-300"
            >
              New User
            </Button>
            <Link to="/login" className="block">
              <Button 
                className="bg-white hover:bg-slate-50 border border-slate-200 text-[#1A74E3] px-12 py-0 h-[48px] rounded-full text-[15px] font-semibold transition-all duration-300"
              >
                Login
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* Visual Content - Perfectly Anchored to bottom */}
        <div className="flex-1 flex justify-end items-end w-full">
          <motion.img 
            src={aiHuman}
            alt="Mixed Reality AI Character"
            initial={{ opacity: 0, x: 50, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2, type: "spring", bounce: 0.3 }}
            className="w-full max-w-[500px] md:max-w-[930px] h-auto object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.12)] z-20 origin-bottom"
          />
        </div>

      </div>

      <SignupModal 
        isOpen={isSignupModalOpen} 
        onClose={() => setIsSignupModalOpen(false)} 
      />
    </section>
  );
}
