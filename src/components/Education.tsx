'use client';

import React from 'react';
import { motion } from 'framer-motion';

const education = [
  {
    institution: "University of New South Wales (UNSW)",
    degree: "Bachelor of Computer Science",
    period: "2023 - 2026",
    location: "Sydney, Australia",
    description: "Specializing in Artificial Intelligence and Software Engineering.",
  },
  {
    institution: "Previous Entrepreneurial Journey",
    degree: "Founder & CEO",
    period: "2022 - 2023",
    location: "Sydney, Australia", 
    description: "Founded and led a technology startup focused on AI-powered solutions.",
  }
];

const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.5, staggerChildren: 0.2 }
  }
};

const item = {
  hidden: { opacity: 0, x: -50 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6 } }
};

const Education = () => {
  return (
    <section id="education" className="py-20">
      <div className="container mx-auto px-6">
        <motion.div
          className="max-w-4xl mx-auto"
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <motion.h2 
            className="text-4xl font-bold text-white mb-12 text-center"
            variants={item}
          >
            Education & Experience
          </motion.h2>

          <div className="space-y-8">
            {education.map((edu, index) => (
              <motion.div
                key={index}
                variants={item}
                className="bg-gray-950/60 rounded-xl p-8 border border-gray-800 hover:border-teal-400 transition-colors duration-300 backdrop-blur"
              >
                <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-white mb-2">
                      {edu.institution}
                    </h3>
                    <h4 className="text-lg font-semibold text-teal-300 mb-2">
                      {edu.degree}
                    </h4>
                    <p className="text-gray-300 mb-4">
                      {edu.description}
                    </p>
                  </div>
                  <div className="md:text-right md:ml-6">
                    <div className="inline-block bg-teal-500/20 text-teal-200 px-3 py-1 rounded-full text-sm font-medium mb-2">
                      {edu.period}
                    </div>
                    <p className="text-gray-400 text-sm">
                      📍 {edu.location}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Education;
