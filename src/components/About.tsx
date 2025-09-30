'use client';

import React from 'react';
import { motion } from 'framer-motion';

const About = () => {
  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.6, staggerChildren: 0.2 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  return (
    <section id="about" className="py-20">
      <div className="container mx-auto px-6">
        <motion.div
          className="max-w-4xl mx-auto"
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <motion.h2 
            className="text-4xl font-bold text-center mb-12 text-white"
            variants={item}
          >
            About Me
          </motion.h2>
          
          <motion.div 
            className="grid md:grid-cols-2 gap-12 items-center"
            variants={item}
          >
            <div className="space-y-6">
              <p className="text-lg text-gray-300 leading-relaxed">
                I&apos;m a <strong className="text-teal-300">Computer Science student</strong> at UNSW Sydney with a passion for artificial intelligence and emerging technologies. At just 19, I&apos;ve already experienced the entrepreneurial world as a founder and CEO of a tech startup.
              </p>
              
              <p className="text-lg text-gray-300 leading-relaxed">
                My journey combines academic excellence with real-world experience. I&apos;m fascinated by <strong className="text-teal-300">AI automation</strong>, productivity systems, and building tools that enhance human potential.
              </p>
              
              <p className="text-lg text-gray-300 leading-relaxed">
                When I&apos;m not coding or studying, you&apos;ll find me exploring new technologies, working on personal projects, or enjoying Sydney&apos;s vibrant tech community.
              </p>
            </div>

            <motion.div 
              className="space-y-4"
              variants={item}
            >
              <div className="bg-gray-950/60 rounded-lg p-6 border border-gray-800 backdrop-blur">
                <h3 className="font-bold text-white mb-3">Quick Facts</h3>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-center">
                    <svg className="w-4 h-4 text-teal-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                    19 years old, based in Sydney
                  </li>
                  <li className="flex items-center">
                    <svg className="w-4 h-4 text-teal-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V8a2 2 0 012-2h2zM8 5a1 1 0 011-1h2a1 1 0 011 1v1H8V5z" clipRule="evenodd" />
                    </svg>
                    Former startup founder & CEO
                  </li>
                  <li className="flex items-center">
                    <svg className="w-4 h-4 text-teal-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                    CS student specializing in AI
                  </li>
                  <li className="flex items-center">
                    <svg className="w-4 h-4 text-teal-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                    </svg>
                    ENTJ personality type
                  </li>
                </ul>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;
