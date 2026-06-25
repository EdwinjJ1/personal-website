'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import PageTransition from '@/components/PageTransition';
import GradientText from '@/components/GradientText';
import AICardPanel from '@/components/AICardPanel';

// 74 — Evan's lucky number, and the shareable entry point to his AI business card.
// Send someone "evanlin.site/74" and any AI can get to know him in one paste.
export default function LuckyNumberPage() {
  return (
    <PageTransition>
      <div className="min-h-screen pt-24 pb-16" style={{ color: '#e0d8cc' }}>
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl mx-auto"
          >
            <div className="text-center mb-10">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-7xl font-bold mb-4"
              >
                <GradientText
                  colors={['#7a9088', '#6a8a8e', '#7a9088', '#6a8a8e', '#7a9088']}
                  animationSpeed={6}
                  showBorder={false}
                >
                  74
                </GradientText>
              </motion.div>
              <h1 className="text-2xl font-bold mb-2" style={{ color: '#e0d8cc' }}>
                You found the lucky number.
              </h1>
              <p className="text-base" style={{ color: '#b8b4aa' }}>
                This is Evan&apos;s AI business card. Hand it to any assistant and it&apos;ll
                know who he is.
              </p>
            </div>

            <AICardPanel />

            <div className="text-center mt-10">
              <Link
                href="/about"
                className="text-sm transition-colors"
                style={{ color: '#7a9088' }}
              >
                ← Read the human version
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
}
