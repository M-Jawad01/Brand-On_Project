'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-brand-base border-b border-brand-secondary sticky top-0 z-50">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo - Top Left */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="text-2xl font-bold text-brand-primary">
              BrandON
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              href="/services" 
              className="text-gray-200 hover:text-brand-primary transition"
            >
              Services
            </Link>
            <Link 
              href="/gallery" 
              className="text-gray-200 hover:text-brand-primary transition"
            >
              Portfolio
            </Link>
            <Link 
              href="/about" 
              className="text-gray-200 hover:text-brand-primary transition"
            >
              About Us
            </Link>
            <Link 
              href="/contact" 
              className="text-gray-200 hover:text-brand-primary transition"
            >
              Contact
            </Link>
            <Link
              href="/services"
              className="bg-brand-primary hover:bg-green-700 text-white font-semibold px-6 py-2 rounded-lg transition"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-white focus:outline-none"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 space-y-3">
            <Link
              href="/services"
              className="block text-gray-200 hover:text-brand-primary transition py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Services
            </Link>
            <Link
              href="/gallery"
              className="block text-gray-200 hover:text-brand-primary transition py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Portfolio
            </Link>
            <Link
              href="/about"
              className="block text-gray-200 hover:text-brand-primary transition py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              About Us
            </Link>
            <Link
              href="/contact"
              className="block text-gray-200 hover:text-brand-primary transition py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </Link>
            <Link
              href="/services"
              className="block bg-brand-primary hover:bg-green-700 text-white font-semibold px-6 py-2 rounded-lg transition text-center"
              onClick={() => setIsMenuOpen(false)}
            >
              Get Started
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
}
