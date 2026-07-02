import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { Brain, Zap, Shield, Users, BarChart3, Globe, Star, CheckCircle } from 'lucide-react';

import img1 from '@/assets/images/modules/Rectangle 2758.png';
import img2 from '@/assets/images/modules/Rectangle 2758 (1).png';
import img3 from '@/assets/images/modules/Rectangle 2758 (2).png';
import img4 from '@/assets/images/modules/Rectangle 2758 (3).png';
import img5 from '@/assets/images/modules/Rectangle 2758 (4).png';
import img6 from '@/assets/images/modules/Rectangle 2758 (5).png';

const features = [
  { icon: Brain, title: 'AI-Powered Feedback', desc: 'Get instant, personalized feedback on every performance metric from our advanced AI engine.' },
  { icon: Zap, title: 'Mixed Reality Training', desc: 'Step into immersive VR/AR environments that mirror real-world workplace scenarios.' },
  { icon: BarChart3, title: 'Detailed Analytics', desc: 'Track progress, scores, and improvement areas with comprehensive analytics dashboards.' },
  { icon: Users, title: 'Expert-Designed Modules', desc: 'Training content crafted by industry veterans across leadership, sales, and soft skills.' },
  { icon: Globe, title: 'Accessible Anywhere', desc: 'Train on web or via VR headset. No special hardware required to get started.' },
  { icon: Shield, title: 'Enterprise Ready', desc: 'Secure, scalable, and trusted by leading corporates across India and beyond.' },
];

const gallery = [
  { img: img1, title: 'Leadership & Management', tag: 'VR Module' },
  { img: img2, title: 'Sales Excellence', tag: 'AI Simulation' },
  { img: img3, title: 'Customer Experience', tag: 'Interactive' },
  { img: img4, title: 'Workplace Skills', tag: 'Mixed Reality' },
  { img: img5, title: 'Innovation Training', tag: 'AI Coaching' },
  { img: img6, title: 'Career Coaching', tag: 'Mentorship' },
];

const stats = [
  { value: '10,000+', label: 'Professionals Trained' },
  { value: '95%', label: 'Completion Rate' },
  { value: '50+', label: 'Enterprise Partners' },
  { value: '4.9★', label: 'Avg. Rating' },
];

const whyPoints = [
  'Real-time AI performance analysis after every session',
  'Industry-recognized certifications upon completion',
  'VR headset & web browser compatible',
  'Personalized learning paths based on your goals',
  '24/7 access to all modules and resources',
  'Regular content updates with new industry scenarios',
];

function FadeIn({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function LandingContent() {
  return (
    <div className="bg-[#0b0822] text-white">

      {/* ════ STATS BAR ════ */}
      <section className="border-y border-white/5 bg-white/[0.02]">
        <div className="container mx-auto px-6 lg:px-12 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map(({ value, label }, i) => (
              <FadeIn key={label} delay={i * 0.1}>
                <div className="text-[36px] md:text-[44px] font-extrabold text-[#FFD600] leading-none mb-2">{value}</div>
                <div className="text-slate-400 text-sm">{label}</div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ════ ABOUT TFG ════ */}
      <section id="about" className="py-24 relative overflow-hidden">
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#FFD600]/5 rounded-full blur-[150px] pointer-events-none" />
        <div className="container mx-auto px-6 lg:px-12 relative z-10">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <FadeIn>
              <span className="inline-block px-4 py-1.5 rounded-full bg-[#FFD600]/10 border border-[#FFD600]/20 text-[#FFD600] text-sm font-semibold mb-5">
                About TFG
              </span>
              <h2 className="text-[42px] lg:text-[52px] font-extrabold leading-tight mb-6 tracking-tight">
                The Future of<br />
                <span className="text-[#FFD600]">Professional Training</span>
              </h2>
              <p className="text-slate-400 text-lg leading-relaxed mb-6">
                TFG MR-AI Platform is India's first AI-powered Mixed Reality training ecosystem. We bridge the gap between traditional learning and real-world skills by combining advanced AI coaching with immersive VR simulations.
              </p>
              <p className="text-slate-400 text-lg leading-relaxed mb-8">
                Whether you're a fresh graduate looking to enter the workforce, a mid-career professional sharpening your edge, or an enterprise training a thousand employees — TFG adapts to your journey.
              </p>
              <Link
                to="/login"
                className="inline-flex items-center gap-2 px-8 py-4 bg-[#FFD600] hover:bg-[#e6c100] text-[#050410] rounded-2xl font-bold text-[15px] transition-all shadow-[0_0_20px_rgba(255,214,0,0.25)] hover:shadow-[0_0_35px_rgba(255,214,0,0.4)] hover:scale-105"
              >
                Start Training Today →
              </Link>
            </FadeIn>

            {/* Why Points Card */}
            <FadeIn delay={0.2}>
              <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-8">
                <h3 className="text-white font-bold text-lg mb-6">Why learners choose TFG</h3>
                <ul className="space-y-4">
                  {whyPoints.map((point) => (
                    <li key={point} className="flex items-start gap-3 text-slate-300 text-sm leading-relaxed">
                      <CheckCircle className="w-5 h-5 text-[#FFD600] shrink-0 mt-0.5" />
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ════ GALLERY / MODULES ════ */}
      <section className="py-24 bg-[#050410] relative overflow-hidden">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#4f46e5]/8 rounded-full blur-[150px] pointer-events-none" />
        <div className="container mx-auto px-6 lg:px-12 relative z-10">
          <FadeIn className="text-center mb-14">
            <span className="inline-block px-4 py-1.5 rounded-full bg-[#FFD600]/10 border border-[#FFD600]/20 text-[#FFD600] text-sm font-semibold mb-4">
              Training Modules
            </span>
            <h2 className="text-[42px] lg:text-[52px] font-extrabold leading-tight tracking-tight mb-4">
              Explore Our World-Class<br />
              <span className="text-[#FFD600]">Learning Modules</span>
            </h2>
            <p className="text-slate-400 text-lg max-w-xl mx-auto">
              Hands-on, scenario-based training modules built for every stage of your professional growth.
            </p>
          </FadeIn>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {gallery.map(({ img, title, tag }, i) => (
              <FadeIn key={title} delay={i * 0.08}>
                <div className="group relative rounded-2xl overflow-hidden border border-white/10 hover:border-[#FFD600]/30 transition-all duration-500 cursor-pointer">
                  <img
                    src={img}
                    alt={title}
                    className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#050410] via-[#050410]/50 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <span className="inline-block px-2.5 py-1 rounded-lg bg-[#FFD600]/20 border border-[#FFD600]/30 text-[#FFD600] text-xs font-semibold mb-2">
                      {tag}
                    </span>
                    <h3 className="text-white font-bold text-lg">{title}</h3>
                  </div>
                  <div className="absolute inset-0 bg-[#FFD600]/0 group-hover:bg-[#FFD600]/5 transition-colors duration-300" />
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ════ FEATURES ════ */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-[600px] h-[600px] bg-[#FFD600]/5 rounded-full blur-[150px] pointer-events-none" />
        <div className="container mx-auto px-6 lg:px-12 relative z-10">
          <FadeIn className="text-center mb-14">
            <span className="inline-block px-4 py-1.5 rounded-full bg-[#FFD600]/10 border border-[#FFD600]/20 text-[#FFD600] text-sm font-semibold mb-4">
              Platform Features
            </span>
            <h2 className="text-[42px] lg:text-[52px] font-extrabold leading-tight tracking-tight mb-4">
              Everything You Need to<br />
              <span className="text-[#FFD600]">Excel at Work</span>
            </h2>
            <p className="text-slate-400 text-lg max-w-xl mx-auto">
              A complete ecosystem of tools and technologies designed to accelerate your professional growth.
            </p>
          </FadeIn>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map(({ icon: Icon, title, desc }, i) => (
              <FadeIn key={title} delay={i * 0.08}>
                <div className="bg-white/[0.03] border border-white/8 rounded-2xl p-6 hover:bg-white/[0.06] hover:border-[#FFD600]/20 transition-all duration-300 group h-full">
                  <div className="w-12 h-12 rounded-2xl bg-[#FFD600]/10 flex items-center justify-center mb-5 group-hover:bg-[#FFD600]/20 group-hover:scale-110 transition-all duration-300">
                    <Icon className="w-6 h-6 text-[#FFD600]" />
                  </div>
                  <h3 className="text-white font-bold text-lg mb-3">{title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ════ CTA BANNER ════ */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#1a1040] to-[#0b0822]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,214,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,214,0,0.03)_1px,transparent_1px)] bg-[size:40px_40px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[#FFD600]/8 blur-[100px] rounded-full pointer-events-none" />
        <FadeIn className="container mx-auto px-6 lg:px-12 relative z-10 text-center">
          <div className="flex items-center justify-center gap-1 mb-6">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-5 h-5 text-[#FFD600] fill-[#FFD600]" />
            ))}
            <span className="text-slate-400 text-sm ml-2">Loved by 10,000+ professionals</span>
          </div>
          <h2 className="text-[42px] lg:text-[56px] font-extrabold leading-tight tracking-tight mb-6">
            Ready to Transform<br />
            <span className="text-[#FFD600]">Your Career?</span>
          </h2>
          <p className="text-slate-400 text-lg max-w-lg mx-auto mb-10">
            Join thousands of professionals who have accelerated their growth with TFG's AI-powered training platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/login"
              className="px-10 py-4 bg-[#FFD600] hover:bg-[#e6c100] text-[#050410] rounded-2xl font-bold text-[16px] transition-all shadow-[0_0_30px_rgba(255,214,0,0.4)] hover:shadow-[0_0_50px_rgba(255,214,0,0.6)] hover:scale-105 inline-block"
            >
              Get Started for Free →
            </Link>
            <a
              href="#about"
              className="px-10 py-4 bg-transparent border border-white/20 hover:border-white/40 text-white rounded-2xl font-semibold text-[16px] transition-all hover:bg-white/5 inline-block"
            >
              Learn More
            </a>
          </div>
        </FadeIn>
      </section>
    </div>
  );
}
