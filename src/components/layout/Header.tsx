import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/common/Button';
import logoImg from '@/assets/images/logo.png';
import { cn } from '@/utils/cn';

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Home', href: '#home' },
    { label: 'About Us', href: '#about' },
    { label: 'Contact Us', href: '#footer' },
  ];

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled
          ? 'bg-[#1D1F4C] shadow-[0_2px_20px_rgba(0,0,0,0.15)] py-3 border-b border-white/10'
          : 'bg-[#1D1F4C]/95 backdrop-blur-md py-4 border-b border-white/5'
      )}
    >
      <div className="container mx-auto px-6 lg:px-12 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center gap-2" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <img src={logoImg} alt="TFG Logo" className="h-10 md:h-11 w-auto object-contain" />
          </Link>
        </div>

        {/* Desktop Right Section: Nav + Auth */}
        <div className="hidden md:flex items-center gap-10 lg:gap-14">
          {/* Desktop Navigation */}
          <nav className="flex items-center gap-8 lg:gap-10">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-[15px] font-medium text-slate-300 hover:text-white transition-colors tracking-wide"
                onClick={(e) => {
                  if (link.href.startsWith('#')) {
                    e.preventDefault();
                    const el = document.querySelector(link.href);
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Desktop Auth */}
          <div className="flex items-center">
            <Link to="/login">
              <Button
                variant="primary"
                className="bg-[#FFD600] hover:bg-[#e6c100] text-[#1D1F4C] px-6 py-2.5 text-[15px] font-bold rounded-lg shadow-[0_4px_14px_rgba(255,214,0,0.35)] hover:shadow-[0_4px_20px_rgba(255,214,0,0.5)] transition-all duration-300"
              >
                Login
              </Button>
            </Link>
          </div>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden p-2 text-white hover:text-[#FFD600] transition-colors"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="absolute top-full left-0 right-0 bg-white shadow-lg border-t border-slate-100 md:hidden overflow-hidden"
          >
            <div className="flex flex-col px-6 py-6 space-y-6">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  to={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-lg font-medium text-slate-600 hover:text-[#1D1F4C] transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              <hr className="border-slate-100" />
              <div className="flex flex-col pt-2">
                <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button variant="primary" className="w-full bg-[#FFD600] hover:bg-[#e6c100] text-[#1D1F4C] font-bold py-3 text-lg rounded-lg">
                    Login
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
