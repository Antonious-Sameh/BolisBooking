import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <Link to="/" className="flex items-center group">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex flex-col"
              >
                <span className="text-2xl font-bold text-foreground font-['Alexandria'] group-hover:text-primary transition-colors">
                  الأستاذ بولس عبدالمسيح
                </span>
              </motion.div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              <nav className="flex items-center gap-6">
                <Link
                  to="/"
                  className={`text-base font-medium transition-colors duration-200 ${
                    isActive('/')
                      ? 'text-primary font-bold'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  الرئيسية
                </Link>
              </nav>

              <Button
                asChild
                className="bg-[hsl(var(--whatsapp))] hover:bg-[hsl(var(--whatsapp))/0.9] text-white shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 rounded-full px-6"
              >
                <a href="https://wa.me/201288948585" target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="ml-2 w-5 h-5" />
                  تواصل عبر واتساب
                </a>
              </Button>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-foreground hover:text-primary transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-border bg-background shadow-lg absolute w-full"
            >
              <div className="px-4 py-6 space-y-4">
                <Link
                  to="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-4 py-3 rounded-xl text-base font-medium transition-colors ${
                    isActive('/')
                      ? 'bg-primary/10 text-primary'
                      : 'text-foreground hover:bg-muted'
                  }`}
                >
                  الرئيسية
                </Link>
                
                <a
                  href="https://wa.me/201288948585"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center w-full px-4 py-3 rounded-xl text-base font-medium bg-[hsl(var(--whatsapp))] text-white shadow-md transition-all active:scale-95"
                >
                  <MessageCircle className="ml-2 w-5 h-5" />
                  تواصل عبر واتساب
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
};

export default Header;