'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface BaseCardProps {
  children: ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  hover?: boolean;
  delay?: number;
}

const sizeClasses = {
  sm: 'col-span-1 row-span-1',
  md: 'col-span-1 md:col-span-2 row-span-1',
  lg: 'col-span-1 md:col-span-2 lg:col-span-3 row-span-2',
  xl: 'col-span-1 md:col-span-2 lg:col-span-4 row-span-2'
};

export default function BaseCard({
  children,
  className = '',
  size = 'sm',
  hover = true,
  delay = 0
}: BaseCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className={`
        ${sizeClasses[size]}
        bg-gray-800/90 backdrop-blur-sm rounded-2xl p-5
        border border-gray-700/50
        ${hover ? 'hover:border-teal-500/50 hover:bg-gray-700/90 cursor-pointer' : ''}
        transition-all duration-300
        ${className}
      `}
      whileHover={hover ? { scale: 1.02, y: -2 } : {}}
    >
      {children}
    </motion.div>
  );
}
