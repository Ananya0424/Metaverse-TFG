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
    { label: 'Home', href: '/' },
    { label: 'About Us', href: '#about' },
    { label: 'Contact Us', href: '#contact' },
  ];

  return (
    <header 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled ? "bg-[#0b0822]/95 backdrop-blur-md shadow-lg py-3 border-b border-white/5" : "bg-transparent py-5"
      )}
    >
      <div className="container mx-auto px-6 lg:px-12 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center gap-2">
            {/* Using a drop-shadow so the dark navy text in the original logo remains somewhat visible, though ideally they need a white version of the logo. The gold part will pop perfectly. */}
            <img src={logoImg} alt="TFG Logo" className="h-10 md:h-12 w-auto object-contain drop-shadow-[0_0_10px_rgba(255,255,255,0.4)]" />
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-10">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              to={link.href}
              className="text-[15px] font-medium text-slate-300 hover:text-white transition-colors tracking-wide"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop Auth */}
        <div className="hidden md:flex items-center gap-4">
          <Link to="/login">
            <Button variant="primary" className="bg-[#FFD600] hover:bg-[#e6c100] text-[#0b0822] px-6 py-2.5 text-[15px] font-bold rounded-lg shadow-[0_0_15px_rgba(255,214,0,0.3)] hover:shadow-[0_0_20px_rgba(255,214,0,0.5)] transition-all duration-300">Login</Button>
          </Link>
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
            className="absolute top-full left-0 right-0 bg-[#0b0822] shadow-2xl border-t border-white/10 md:hidden overflow-hidden"
          >
            <div className="flex flex-col px-6 py-6 space-y-6">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  to={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-lg font-medium text-slate-300 hover:text-white transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              <hr className="border-white/10" />
              <div className="flex flex-col pt-2">
                <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button variant="primary" className="w-full bg-[#FFD600] hover:bg-[#e6c100] text-[#0b0822] font-bold py-3 text-lg">Login</Button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
