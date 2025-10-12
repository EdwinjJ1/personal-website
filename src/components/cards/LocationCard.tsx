'use client';

import BaseCard from './BaseCard';
import { motion } from 'framer-motion';

export default function LocationCard() {
  return (
    <BaseCard size="sm" delay={0.2} className="lg:col-span-2">
      <div className="h-full flex flex-col items-center justify-center text-center">
        <div className="relative mb-3">
          <motion.div
            className="w-16 h-16 rounded-full flex items-center justify-center"
            style={{ background: 'linear-gradient(to bottom right, #7a9088, #6a8a8e)' }}
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          >
            <motion.div
              className="w-12 h-12 rounded-full flex items-center justify-center"
              style={{ backgroundColor: '#211e1c' }}
              animate={{ rotate: -360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              🌏
            </motion.div>
          </motion.div>
        </div>

        <div className="flex items-center gap-2 mb-1.5">
          <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: '#7a9088' }}></div>
          <h3 className="font-medium" style={{ color: '#c8c0b4' }}>Sydney, Australia</h3>
        </div>

        <p className="text-xs" style={{ color: '#726e66' }}>
          UTC+11
        </p>
      </div>
    </BaseCard>
  );
}
