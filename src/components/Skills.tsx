'use client';

import React from 'react';
import { motion } from 'framer-motion';

type SkillCategory = {
  title: string;
  items: string[];
};

const categories: SkillCategory[] = [
  {
    title: 'Languages',
    items: ['TypeScript', 'JavaScript', 'Python', 'Java', 'MySQL'],
  },
  {
    title: 'Frontend',
    items: ['React', 'Next.js', 'Vite'],
  },
  {
    title: 'Backend',
    items: ['Vercel', 'Waline', 'Firebase', 'Node.js'],
  },
  {
    title: 'Tools',
    items: ['Cursor', 'Git', 'Docker', 'Postman', 'ESLint/Prettier', 'Jest'],
  },
];

const container = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, when: 'beforeChildren', staggerChildren: 0.08 },
  },
};

const item = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

const Skills = () => {
  return (
    <section id="skills" className="py-20">
      <motion.div
        className="container mx-auto px-6"
        variants={container}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        <h2 className="text-4xl font-bold text-center mb-12 text-white">Skills & Technologies</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {categories.map((cat) => (
            <motion.div
              key={cat.title}
              variants={item}
              className="rounded-xl border border-gray-800 bg-gray-950/60 p-6 backdrop-blur hover:border-teal-400 transition-colors duration-300"
            >
              <h3 className="text-xl font-semibold mb-4 text-teal-300">{cat.title}</h3>
              <ul className="flex flex-wrap gap-2">
                {cat.items.map((skill) => (
                  <li key={skill}>
                    <span className="inline-block rounded-full border border-teal-500/40 bg-teal-500/10 px-3 py-1 text-sm text-teal-200 hover:bg-teal-500/20 transition-colors cursor-default">
                      {skill}
                    </span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        <motion.p 
          className="text-center text-gray-400 mt-12 text-sm max-w-2xl mx-auto"
          variants={item}
        >
          Also exploring AI workflows and automation (Claude MCP, Notion/Google APIs) to enhance productivity and create intelligent systems.
        </motion.p>
      </motion.div>
    </section>
  );
};

export default Skills;
