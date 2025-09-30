'use client';

import React from 'react';
import { motion } from 'framer-motion';

const Projects = () => {
  const projectVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <section id="projects" className="py-20">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-bold text-center mb-12 text-white">Featured Projects</h2>
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={{
            visible: { transition: { staggerChildren: 0.3 } },
          }}
        >
          {/* Project Card 1 */}
          <motion.div variants={projectVariants}>
            <a href="http://www.preuni.xyz/" target="_blank" rel="noopener noreferrer">
              <motion.div 
                className="bg-gray-950/60 rounded-xl p-6 h-full flex flex-col cursor-pointer border border-gray-800 hover:border-teal-400 backdrop-blur"
                whileHover={{ 
                  scale: 1.02,
                  boxShadow: "0 18px 40px rgba(45, 212, 191, 0.15)"
                }}
                transition={{ duration: 0.3 }}
              >
                <h3 className="text-2xl font-bold mb-2 text-teal-300">UNSW Study Materials</h3>
                <p className="text-gray-300 mb-4 flex-grow">
                  Interactive study notes and resources for UNSW Computer Science students, featuring bilingual content and visualizations.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="bg-teal-500/20 text-teal-200 text-sm px-3 py-1 rounded-full">HTML</span>
                  <span className="bg-teal-500/20 text-teal-200 text-sm px-3 py-1 rounded-full">CSS</span>
                  <span className="bg-teal-500/20 text-teal-200 text-sm px-3 py-1 rounded-full">JavaScript</span>
                  <span className="bg-teal-500/20 text-teal-200 text-sm px-3 py-1 rounded-full">Tailwind CSS</span>
                  <span className="bg-teal-500/20 text-teal-200 text-sm px-3 py-1 rounded-full">Chart.js</span>
                  <span className="bg-teal-500/20 text-teal-200 text-sm px-3 py-1 rounded-full">Plotly.js</span>
                </div>
              </motion.div>
            </a>
          </motion.div>

          {/* Project Card 2 */}
          <motion.div variants={projectVariants}>
            <motion.div 
              className="bg-gray-950/60 rounded-xl p-6 h-full flex flex-col cursor-pointer border border-gray-800 hover:border-teal-400 backdrop-blur"
              whileHover={{ 
                scale: 1.02,
                boxShadow: "0 18px 40px rgba(45, 212, 191, 0.15)"
              }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="text-2xl font-bold mb-2 text-teal-300">AI Learning Projects</h3>
              <p className="text-gray-300 mb-4 flex-grow">Various machine learning and AI projects exploring different algorithms and applications.</p>
              <div className="flex flex-wrap gap-2">
                <span className="bg-teal-500/20 text-teal-200 text-sm px-3 py-1 rounded-full">Python</span>
                <span className="bg-teal-500/20 text-teal-200 text-sm px-3 py-1 rounded-full">TensorFlow</span>
                <span className="bg-teal-500/20 text-teal-200 text-sm px-3 py-1 rounded-full">PyTorch</span>
                <span className="bg-teal-500/20 text-teal-200 text-sm px-3 py-1 rounded-full">Scikit-learn</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Project Card 3 */}
          <motion.div variants={projectVariants}>
            <motion.div 
              className="bg-gray-950/60 rounded-xl p-6 h-full flex flex-col cursor-pointer border border-gray-800 hover:border-teal-400 backdrop-blur"
              whileHover={{ 
                scale: 1.02,
                boxShadow: "0 18px 40px rgba(45, 212, 191, 0.15)"
              }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="text-2xl font-bold mb-2 text-teal-300">Web Development</h3>
              <p className="text-gray-300 mb-4 flex-grow">Modern web applications built with React, Next.js, and modern development practices.</p>
              <div className="flex flex-wrap gap-2">
                <span className="bg-teal-500/20 text-teal-200 text-sm px-3 py-1 rounded-full">React</span>
                <span className="bg-teal-500/20 text-teal-200 text-sm px-3 py-1 rounded-full">Next.js</span>
                <span className="bg-teal-500/20 text-teal-200 text-sm px-3 py-1 rounded-full">TypeScript</span>
                <span className="bg-teal-500/20 text-teal-200 text-sm px-3 py-1 rounded-full">Tailwind CSS</span>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Projects;
