'use client';

import BaseCard from './BaseCard';
import { motion } from 'framer-motion';
import ScatterText from '@/components/ScatterText';

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
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#e0d8cc" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
              </svg>
            </motion.div>
          </motion.div>
        </div>

        <div className="flex items-center gap-2 mb-1.5">
          <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: '#7a9088' }}></div>
          <h3 className="font-medium" style={{ color: '#e0d8cc' }}>
            <ScatterText scatterRadius={25} rotationRange={10}>Sydney, Australia</ScatterText>
          </h3>
        </div>

        <p className="text-xs" style={{ color: '#8a8680' }}>
          UTC+11
        </p>
      </div>
    </BaseCard>
  );
}
