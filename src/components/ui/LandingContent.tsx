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

// REAL TFG stats from official website
const stats = [
  { value: '25+', label: 'Enterprise Solutions' },
  { value: '1st', label: 'Metaverse Training Academy' },
  { value: 'EMEA', label: '& APAC Region Leader' },
  { value: '4.9★', label: 'Client Satisfaction' },
];

// REAL TFG differentiators from official website
const whyPoints = [
  'First Full Capability Talent Marketplace in EMEA & APAC',
  'First Metaverse Training Academy globally',
  'First Immersive Innovation Learning Center',
  'Collaboration with Ivy League Universities worldwide',
  'World\'s largest portfolio of International Professional Certifications',
  'Private Generative AI & VR-enabled training programs',
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
    <div className="bg-white text-[#1D1F4C]">

      {/* ════ STATS BAR ════ */}
      <section className="border-y border-slate-100 bg-[#FAFAFA]">
        <div className="container mx-auto px-6 lg:px-12 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map(({ value, label }, i) => (
              <FadeIn key={label} delay={i * 0.1}>
                <div className="text-[36px] md:text-[44px] font-extrabold text-[#FFD600] leading-none mb-2">{value}</div>
                <div className="text-slate-500 text-sm font-medium">{label}</div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ════ ABOUT TFG ════ */}
      <section id="about" className="py-24 relative overflow-hidden bg-white">
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#FFD600]/8 rounded-full blur-[150px] pointer-events-none" />
        <div className="container mx-auto px-6 lg:px-12 relative z-10">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <FadeIn>
              <span className="inline-block px-4 py-1.5 rounded-full bg-[#FFD600]/15 border border-[#FFD600]/30 text-[#1D1F4C] text-sm font-bold mb-5">
                About TFG
              </span>
              <h2 className="text-[42px] lg:text-[50px] font-extrabold leading-tight mb-6 tracking-tight text-[#1D1F4C]">
                Redefining the<br />
                <span className="text-[#FFD600]">Future of Talent</span>
              </h2>
              <p className="text-slate-600 text-lg leading-relaxed mb-6">
                Talent Fourth Gen Group (TFG) is a global talent ecosystem and the first full capability Talent Marketplace in the EMEA & APAC region. We solve business challenges with the power of Talent — combining consulting, learning, and immersive technology.
              </p>
              <p className="text-slate-600 text-lg leading-relaxed mb-8">
                From AI-powered Learning Experience Platforms and VR training to Ivy League university programs and Metaverse experiences — TFG offers 25+ enterprise solutions across all talent dimensions.
              </p>
              <Link
                to="/login"
                className="inline-flex items-center gap-2 px-8 py-4 bg-[#FFD600] hover:bg-[#e6c100] text-[#1D1F4C] rounded-xl font-bold text-[15px] transition-all shadow-[0_4px_20px_rgba(255,214,0,0.35)] hover:shadow-[0_6px_30px_rgba(255,214,0,0.5)] hover:scale-105"
              >
                Start Training Today →
              </Link>
            </FadeIn>

            {/* Why Points Card */}
            <FadeIn delay={0.2}>
              <div className="bg-[#FAFAFA] border border-slate-100 rounded-3xl p-8 shadow-sm">
                <h3 className="text-[#1D1F4C] font-bold text-lg mb-6">Why TFG is Different</h3>
                <ul className="space-y-4">
                  {whyPoints.map((point) => (
                    <li key={point} className="flex items-start gap-3 text-slate-600 text-sm leading-relaxed">
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
      <section className="py-24 bg-[#F8F9FA] relative overflow-hidden">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-[#1D1F4C]/3 rounded-full blur-[150px] pointer-events-none" />
        <div className="container mx-auto px-6 lg:px-12 relative z-10">
          <FadeIn className="text-center mb-14">
            <span className="inline-block px-4 py-1.5 rounded-full bg-[#FFD600]/15 border border-[#FFD600]/30 text-[#1D1F4C] text-sm font-bold mb-4">
              Training Modules
            </span>
            <h2 className="text-[42px] lg:text-[50px] font-extrabold leading-tight tracking-tight mb-4 text-[#1D1F4C]">
              World-Class<br />
              <span className="text-[#FFD600]">Learning Modules</span>
            </h2>
            <p className="text-slate-500 text-lg max-w-xl mx-auto">
              Hands-on, scenario-based training built for every stage of your professional growth.
            </p>
          </FadeIn>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {gallery.map(({ img, title, tag }, i) => (
              <FadeIn key={title} delay={i * 0.08}>
                <div className="group relative rounded-2xl overflow-hidden border border-slate-100 hover:border-[#FFD600]/40 transition-all duration-500 cursor-pointer shadow-sm hover:shadow-[0_10px_40px_rgba(255,214,0,0.15)]">
                  <img
                    src={img}
                    alt={title}
                    className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1D1F4C]/90 via-[#1D1F4C]/30 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <span className="inline-block px-2.5 py-1 rounded-lg bg-[#FFD600] text-[#1D1F4C] text-xs font-bold mb-2">
                      {tag}
                    </span>
                    <h3 className="text-white font-bold text-lg">{title}</h3>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ════ FEATURES ════ */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="absolute right-0 top-0 w-[500px] h-[500px] bg-[#FFD600]/6 rounded-full blur-[150px] pointer-events-none" />
        <div className="container mx-auto px-6 lg:px-12 relative z-10">
          <FadeIn className="text-center mb-14">
            <span className="inline-block px-4 py-1.5 rounded-full bg-[#FFD600]/15 border border-[#FFD600]/30 text-[#1D1F4C] text-sm font-bold mb-4">
              Platform Features
            </span>
            <h2 className="text-[42px] lg:text-[50px] font-extrabold leading-tight tracking-tight mb-4 text-[#1D1F4C]">
              Everything You Need to<br />
              <span className="text-[#FFD600]">Excel at Work</span>
            </h2>
            <p className="text-slate-500 text-lg max-w-xl mx-auto">
              A complete ecosystem of tools designed to accelerate your professional growth.
            </p>
          </FadeIn>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map(({ icon: Icon, title, desc }, i) => (
              <FadeIn key={title} delay={i * 0.08}>
                <div className="bg-[#FAFAFA] border border-slate-100 rounded-2xl p-6 hover:bg-white hover:border-[#FFD600]/30 hover:shadow-[0_8px_30px_rgba(255,214,0,0.12)] transition-all duration-300 group h-full">
                  <div className="w-12 h-12 rounded-2xl bg-[#FFD600]/15 flex items-center justify-center mb-5 group-hover:bg-[#FFD600]/25 group-hover:scale-110 transition-all duration-300">
                    <Icon className="w-6 h-6 text-[#1D1F4C]" />
                  </div>
                  <h3 className="text-[#1D1F4C] font-bold text-lg mb-3">{title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ════ CTA BANNER ════ */}
      <section className="py-20 bg-[#1D1F4C] relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,214,0,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,214,0,0.04)_1px,transparent_1px)] bg-[size:40px_40px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[#FFD600]/10 blur-[100px] rounded-full pointer-events-none" />
        <FadeIn className="container mx-auto px-6 lg:px-12 relative z-10 text-center">
          <div className="flex items-center justify-center gap-1 mb-6">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-5 h-5 text-[#FFD600] fill-[#FFD600]" />
            ))}
            <span className="text-slate-400 text-sm ml-2">Trusted by enterprises across EMEA & APAC</span>
          </div>
          <h2 className="text-[42px] lg:text-[52px] font-extrabold leading-tight tracking-tight mb-6 text-white">
            Ready to Transform<br />
            <span className="text-[#FFD600]">Your Organisation?</span>
          </h2>
          <p className="text-slate-300 text-lg max-w-lg mx-auto mb-10">
            Partner with TFG — the first full capability Talent Marketplace in the EMEA & APAC region.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/login"
              className="px-10 py-4 bg-[#FFD600] hover:bg-[#e6c100] text-[#1D1F4C] rounded-xl font-bold text-[16px] transition-all shadow-[0_0_30px_rgba(255,214,0,0.3)] hover:shadow-[0_0_50px_rgba(255,214,0,0.5)] hover:scale-105 inline-block"
            >
              Get Started →
            </Link>
            <a
              href="mailto:info@talentfourth.com"
              className="px-10 py-4 bg-transparent border border-white/20 hover:border-white/40 text-white rounded-xl font-semibold text-[16px] transition-all hover:bg-white/5 inline-block"
            >
              Contact Us
            </a>
          </div>
        </FadeIn>
      </section>
    </div>
  );
}
