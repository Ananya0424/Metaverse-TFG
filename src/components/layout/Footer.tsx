import { Link } from 'react-router-dom';
import logoImg from '@/assets/images/logo.png';
import { Mail, MapPin } from 'lucide-react';

const LinkedinIcon = () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>;
const TwitterIcon = () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>;
const YoutubeIcon = () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>;

const quickLinks = ['Home', 'About Us', 'Solutions', 'Become a Client', 'Contact'];
const solutions = ['AI Mock Interviews', 'Resume Builder', 'VR Product Training', 'Immersive Simulations', 'Career Coaching'];

export function Footer() {
  return (
    <footer id="footer" className="bg-[#1D1F4C] text-white relative overflow-hidden">
      {/* Subtle pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,214,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,214,0,0.03)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        {/* Top Section */}
        <div className="py-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 border-b border-white/10">

          {/* Brand Column */}
          <div className="lg:col-span-1">
            <Link to="/" className="inline-block mb-5">
              <img src={logoImg} alt="TFG Logo" className="h-10 w-auto object-contain" />
            </Link>
            <p className="text-slate-300 text-sm leading-relaxed mb-5">
              Talent Fourth Gen Group — Redefining the Future of Talent. The first full capability Talent Marketplace in the EMEA & APAC region.
            </p>
            {/* Social Icons */}
            <div className="flex gap-3">
              {[
                { icon: LinkedinIcon, href: 'https://www.linkedin.com/company/talent-fourth-gen-group', label: 'LinkedIn' },
                { icon: TwitterIcon, href: '#', label: 'Twitter' },
                { icon: YoutubeIcon, href: '#', label: 'YouTube' },
              ].map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center text-slate-300 hover:text-[#FFD600] hover:bg-[#FFD600]/15 hover:border-[#FFD600]/30 transition-all duration-300"
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
                  <a href="#" className="text-slate-300 text-sm hover:text-[#FFD600] transition-colors flex items-center gap-2 group">
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
                  <a href="#" className="text-slate-300 text-sm hover:text-[#FFD600] transition-colors flex items-center gap-2 group">
                    <span className="w-1 h-1 rounded-full bg-[#FFD600] opacity-0 group-hover:opacity-100 transition-opacity" />
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact — REAL TFG DATA */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-widest mb-5">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-slate-300 text-sm">
                <MapPin className="w-4 h-4 text-[#FFD600] mt-0.5 shrink-0" />
                <span>
                  <strong className="text-white block mb-0.5">Singapore</strong>
                  10, Jalan Besar, #11-05, Sim Lim Tower, Singapore
                </span>
              </li>
              <li className="flex items-start gap-3 text-slate-300 text-sm">
                <MapPin className="w-4 h-4 text-[#FFD600] mt-0.5 shrink-0" />
                <span>
                  <strong className="text-white block mb-0.5">UAE</strong>
                  Donna Towers, Dubai Silicon Oasis, Dubai, UAE
                </span>
              </li>
              <li className="flex items-center gap-3 text-slate-300 text-sm">
                <Mail className="w-4 h-4 text-[#FFD600] shrink-0" />
                <a href="mailto:info@talentfourth.com" className="hover:text-[#FFD600] transition-colors">info@talentfourth.com</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-slate-400 text-sm">
            © Copyright 2024 by Talent Fourth Gen Group
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-slate-400 text-sm hover:text-slate-200 transition-colors">Privacy Policy</a>
            <a href="#" className="text-slate-400 text-sm hover:text-slate-200 transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
