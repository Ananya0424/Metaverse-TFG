import { Link } from 'react-router-dom';
import logoImg from '@/assets/images/logo.png';
import { Mail, MapPin, Phone } from 'lucide-react';

// Inline social icons (brand icons removed from lucide)
const LinkedinIcon = () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>;
const TwitterIcon = () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>;
const YoutubeIcon = () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>;

const quickLinks = ['About Us', 'Features', 'Careers', 'Blog', 'Contact Us'];
const solutions = ['AI Mock Interviews', 'Resume Builder', 'Product Training', 'VR Simulations', 'Career Coaching'];

export function Footer() {
  return (
    <footer className="bg-[#050410] border-t border-white/5 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[200px] bg-[#FFD600]/5 blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        {/* Top Section */}
        <div className="py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 border-b border-white/5">

          {/* Brand Column */}
          <div className="lg:col-span-1">
            <Link to="/" className="inline-block mb-5">
              <img src={logoImg} alt="TFG Logo" className="h-10 w-auto object-contain drop-shadow-[0_0_10px_rgba(255,214,0,0.4)]" />
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              Empowering the next generation of professionals with AI-driven Mixed Reality training and immersive learning experiences.
            </p>
            {/* Social Icons */}
            <div className="flex gap-3">
              {[
                { icon: LinkedinIcon, href: '#', label: 'LinkedIn' },
                { icon: TwitterIcon, href: '#', label: 'Twitter' },
                { icon: YoutubeIcon, href: '#', label: 'YouTube' },
              ].map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-[#FFD600] hover:bg-[#FFD600]/10 hover:border-[#FFD600]/20 transition-all duration-300"
                >
                  <Icon />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-widest mb-5">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link}>
                  <a href="#" className="text-slate-400 text-sm hover:text-[#FFD600] transition-colors flex items-center gap-2 group">
                    <span className="w-1 h-1 rounded-full bg-[#FFD600] opacity-0 group-hover:opacity-100 transition-opacity" />
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Solutions */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-widest mb-5">Solutions</h4>
            <ul className="space-y-3">
              {solutions.map((item) => (
                <li key={item}>
                  <a href="#" className="text-slate-400 text-sm hover:text-[#FFD600] transition-colors flex items-center gap-2 group">
                    <span className="w-1 h-1 rounded-full bg-[#FFD600] opacity-0 group-hover:opacity-100 transition-opacity" />
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-widest mb-5">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-slate-400 text-sm">
                <MapPin className="w-4 h-4 text-[#FFD600] mt-0.5 shrink-0" />
                <span>TFG Headquarters, Mumbai, India</span>
              </li>
              <li className="flex items-center gap-3 text-slate-400 text-sm">
                <Mail className="w-4 h-4 text-[#FFD600] shrink-0" />
                <a href="mailto:info@tfgplatform.com" className="hover:text-[#FFD600] transition-colors">info@tfgplatform.com</a>
              </li>
              <li className="flex items-center gap-3 text-slate-400 text-sm">
                <Phone className="w-4 h-4 text-[#FFD600] shrink-0" />
                <span>+91 98765 43210</span>
              </li>
            </ul>
            {/* Newsletter */}
            <div className="mt-6">
              <p className="text-slate-300 text-sm font-semibold mb-3">Stay Updated</p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 min-w-0 px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-slate-600 outline-none focus:border-[#FFD600]/30 transition-colors"
                />
                <button className="px-4 py-2.5 bg-[#FFD600] text-[#050410] rounded-xl font-bold text-sm hover:bg-[#e6c100] transition-colors shrink-0">
                  →
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-slate-600 text-sm">
            © 2025 TFG MR-AI Platform. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-slate-600 text-sm hover:text-slate-400 transition-colors">Privacy Policy</a>
            <a href="#" className="text-slate-600 text-sm hover:text-slate-400 transition-colors">Terms of Service</a>
            <a href="#" className="text-slate-600 text-sm hover:text-slate-400 transition-colors">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
