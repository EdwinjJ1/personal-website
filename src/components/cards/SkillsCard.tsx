'use client';

import BaseCard from './BaseCard';
import { motion } from 'framer-motion';

const skills = [
  { name: 'TypeScript', icon: '📘', color: 'text-blue-400' },
  { name: 'React', icon: '⚛️', color: 'text-cyan-400' },
  { name: 'Next.js', icon: '▲', color: 'text-gray-50' },
  { name: 'Node.js', icon: '📗', color: 'text-green-400' },
  { name: 'Python', icon: '🐍', color: 'text-yellow-400' },
  { name: 'Tailwind', icon: '🎨', color: 'text-teal-400' },
  { name: 'AWS', icon: '☁️', color: 'text-orange-400' },
  { name: 'Docker', icon: '🐳', color: 'text-blue-500' },
  { name: 'C', icon: '💻', color: 'text-purple-400' },
];

export default function SkillsCard() {
  return (
    <BaseCard size="md" delay={0.3} className="lg:col-span-6">
      <div className="h-full">
        <h3 className="font-semibold mb-3 flex items-center gap-2" style={{ color: '#e0d8cc' }}>
          <span style={{ color: '#9a8870' }}>⚡</span>
          Tech Stack
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {skills.map((skill, index) => (
            <motion.div
              key={skill.name}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              className="flex flex-col items-center p-2 rounded-lg transition-colors"
              style={{ backgroundColor: '#211e1c' }}
              whileHover={{ scale: 1.05, backgroundColor: '#312e2a' }}
            >
              <div className={`text-2xl mb-1 ${skill.color}`}>
                {skill.icon}
              </div>
              <span className="text-xs text-center" style={{ color: '#8a8680' }}>
                {skill.name}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </BaseCard>
  );
}
