'use client';

import BaseCard from './BaseCard';
import { motion } from 'framer-motion';

export default function LocationCard() {
  return (
    <BaseCard size="sm" delay={0.2} className="lg:col-span-2">
      <div className="h-full flex flex-col items-center justify-center text-center">
        <div className="relative mb-3">
          <motion.div
            className="w-16 h-16 bg-gradient-to-br from-blue-500 to-teal-500 rounded-full flex items-center justify-center"
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          >
            <motion.div
              className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center"
              animate={{ rotate: -360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              🌏
            </motion.div>
          </motion.div>
        </div>

        <div className="flex items-center gap-2 mb-1.5">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <h3 className="text-white font-medium">Sydney, Australia</h3>
        </div>

        <p className="text-gray-400 text-xs">
          UTC+11
        </p>
      </div>
    </BaseCard>
  );
}
