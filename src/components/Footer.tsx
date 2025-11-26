import React from 'react';

const Footer = () => {
  return (
    <footer id="contact" className="py-12 bg-gray-900 text-white">
      <div className="container mx-auto px-4 text-center">
        <h3 className="text-2xl font-bold mb-6">Get In Touch</h3>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-6 mb-6">
          <a 
            href="mailto:jiaedwin0605@gmail.com"
            className="text-teal-400 hover:text-teal-300 transition-colors duration-300"
          >
            jiaedwin0605@gmail.com
          </a>
          <a
            href="https://github.com/EdwinjJ1"
            target="_blank"
            rel="noopener noreferrer"
            className="text-teal-400 hover:text-teal-300 transition-colors duration-300"
          >
            GitHub
          </a>
        </div>
        <p className="text-gray-400">&copy; 2025 Evan. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
