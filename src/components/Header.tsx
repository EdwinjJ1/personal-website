'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <motion.header
      className="fixed top-0 left-0 right-0 z-50 bg-gray-900/90 backdrop-blur-md border-b border-gray-700/50 shadow-sm"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
    >
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <motion.h1 
          className="text-xl font-bold text-white"
          whileHover={{ scale: 1.05 }}
        >
          <Link href="/" className="hover:text-teal-400 transition-colors">
            Evan Lin
          </Link>
        </motion.h1>
        
        <nav className="hidden md:block">
          <ul className="flex space-x-8">
            <li>
              <Link href="/blog" className="text-white hover:text-teal-400 transition-colors font-medium">Blog</Link>
            </li>
            <li>
              <Link href="/projects" className="text-white hover:text-teal-400 transition-colors font-medium">Projects</Link>
            </li>
            <li>
              <a href="#" className="text-white hover:text-teal-400 transition-colors font-medium">Links</a>
            </li>
            <li>
              <Link href="/about" className="text-white hover:text-teal-400 transition-colors font-medium">About</Link>
            </li>
            <li>
              <button className="text-white hover:text-teal-400 transition-colors font-medium">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </li>
          </ul>
        </nav>

        {/* Mobile menu button */}
        <button
          className="md:hidden p-2 text-white"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <motion.div
          className="md:hidden bg-gray-900/95 backdrop-blur-md border-t border-gray-700/50"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
        >
          <div className="px-6 py-4 space-y-2">
            <Link href="/blog" className="block py-2 text-white hover:text-teal-400 font-medium">Blog</Link>
            <Link href="/projects" className="block py-2 text-white hover:text-teal-400 font-medium">Projects</Link>
            <a href="#" className="block py-2 text-white hover:text-teal-400 font-medium">Links</a>
            <Link href="/about" className="block py-2 text-white hover:text-teal-400 font-medium">About</Link>
            <button className="block py-2 text-white hover:text-teal-400 font-medium">Search</button>
          </div>
        </motion.div>
      )}
    </motion.header>
  );
};

export default Header;
