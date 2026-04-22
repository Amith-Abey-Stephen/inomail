"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X, Mail } from "lucide-react";
import { motion } from "framer-motion";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "About", href: "#about" },
    { name: "Features", href: "#features" },
    { name: "Pricing", href: "#pricing" },
    { name: "Contact", href: "#contact" },
  ];

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-500 ${
        isScrolled ? "glass py-3" : "bg-transparent py-6"
      }`}
    >
      <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Link href="/" className="flex items-center gap-2 group">
            <div className="bg-primary/20 p-2 rounded-xl group-hover:bg-primary/30 transition-colors">
              <Mail className="w-6 h-6 text-indigo-400" />
            </div>
            <span className="font-bold text-xl tracking-tight text-white">
              InoMail
            </span>
          </Link>
        </motion.div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <motion.div key={link.name} whileHover={{ y: -2 }}>
              <Link
                href={link.href}
                className="text-sm text-gray-400 hover:text-white transition-colors relative group"
              >
                {link.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
              </Link>
            </motion.div>
          ))}
        </nav>

        {/* CTA Buttons */}
        <div className="hidden md:flex items-center gap-4">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              href="/login"
              className="text-sm font-medium text-gray-400 hover:text-white transition-colors"
            >
              Log in
            </Link>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              href="/signup"
              className="text-sm font-medium bg-white text-black px-6 py-2.5 rounded-full hover:bg-gray-200 transition-all shadow-md hover:shadow-lg"
            >
              Get Started
            </Link>
          </motion.div>
        </div>

        {/* Mobile Menu Toggle */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          className="md:hidden text-gray-300 hover:text-white"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X /> : <Menu />}
        </motion.button>
      </div>

      {/* Mobile Nav */}
      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="absolute top-full left-0 w-full glass-card border-t border-white/5 py-6 flex flex-col items-center gap-6 md:hidden shadow-2xl"
        >
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-lg text-gray-300 hover:text-white w-full text-center py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {link.name}
            </Link>
          ))}
          <div className="w-full px-8 flex flex-col gap-3 mt-4 border-t border-white/10 pt-6">
            <Link
              href="/login"
              className="w-full text-center py-3 text-gray-400 hover:text-white border border-white/5 rounded-full"
            >
              Log in
            </Link>
            <Link
              href="/signup"
              className="w-full text-center py-3 bg-primary text-white rounded-full font-medium shadow-lg shadow-primary/20"
            >
              Get Started
            </Link>
          </div>
        </motion.div>
      )}
    </header>
  );
}
