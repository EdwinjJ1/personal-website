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
      style={{ 
        backgroundColor: '#282622',
        borderColor: 'rgba(114, 110, 102, 0.3)'
      }}
      className={`
        ${sizeClasses[size]}
        backdrop-blur-sm rounded-2xl p-5
        border
        ${hover ? 'transition-all duration-300' : ''}
        ${className}
      `}
      whileHover={hover ? { scale: 1.02, y: -2, borderColor: 'rgba(122, 144, 136, 0.5)' } : {}}
    >
      {children}
    </motion.div>
  );
}
