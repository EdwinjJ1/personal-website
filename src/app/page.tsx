'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import PageTransition from '@/components/PageTransition';
import ScatterText from '@/components/ScatterText';
import ClientOnlyParticles from '@/components/ClientOnlyParticles';

// Import modular cards
import PersonalCard from '@/components/cards/PersonalCard';
import LocationCard from '@/components/cards/LocationCard';
import ActivityCard from '@/components/cards/ActivityCard';
import MusicCard from '@/components/cards/MusicCard';
import TechnicalProjectsCard from '@/components/cards/TechnicalProjectsCard';
import PhotographerCard from '@/components/cards/PhotographerCard';
import BlogCard from '@/components/cards/BlogCard';
import NewsCard from '@/components/cards/NewsCard';
import { projects as projectData } from '@/data/projects';

const orderedProjects = [...projectData.filter((project) => project.featured), ...projectData.filter((project) => !project.featured)];

export default function Home() {
  return (
    <PageTransition>
      <div className="min-h-screen" style={{ color: '#e0d8cc' }}>
        <ClientOnlyParticles />

        <div className="relative z-10 mx-auto flex w-full max-w-[1880px] flex-col px-4 md:px-6 pt-16 md:pt-24 lg:pt-16 pb-12 lg:pb-4 lg:h-svh lg:min-h-[680px] lg:justify-center">
          {/* Modular Grid Layout — one screen on desktop, height capped so cards
              don't stretch into empty space on tall windows */}
          <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-12 gap-3 auto-rows-[minmax(150px,_auto)] lg:h-[clamp(540px,76svh,840px)] lg:min-h-0 lg:grid-rows-[minmax(0,0.92fr)_minmax(0,1.32fr)_minmax(0,1fr)]">

            {/* Personal Info - Takes 2 columns */}
            <PersonalCard />

            {/* Location - Takes 1 column */}
            <LocationCard />

            {/* News Hub - replaces Tech Stack, takes 6 columns */}
            <NewsCard delay={0.3} />

            {/* Music Player */}
            <MusicCard />

            <PhotographerCard delay={0.7} />

            <TechnicalProjectsCard projects={orderedProjects} delay={0.6} />

            {/* Activity/Contribution Chart */}
            <ActivityCard />

            <BlogCard delay={0.8} />

          </div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1 }}
            className="mt-12 lg:mt-4 flex shrink-0 flex-wrap justify-center gap-3"
          >
            <Link
              href="/about"
              className="px-6 py-3 lg:py-2.5 font-semibold rounded-full transform hover:scale-105 transition-all duration-300"
              style={{ background: 'linear-gradient(to right, #7a9088, #6a8a8e)', color: '#e0d8cc' }}
            >
              <ScatterText scatterRadius={20} rotationRange={8} staggerDelay={0.01}>Learn More About Me</ScatterText>
            </Link>
            <Link
              href="/projects"
              className="px-6 py-3 lg:py-2.5 border font-semibold rounded-full transition-all duration-300"
              style={{ borderColor: '#7a9088', color: '#7a9088' }}
            >
              <ScatterText scatterRadius={20} rotationRange={8} staggerDelay={0.01} color="#7a9088">View All Projects</ScatterText>
            </Link>
            <Link
              href="/blog"
              className="px-6 py-3 lg:py-2.5 border font-semibold rounded-full transition-all duration-300"
              style={{ borderColor: '#8a8680', color: '#b8b4aa' }}
            >
              <ScatterText scatterRadius={20} rotationRange={8} staggerDelay={0.01} color="#b8b4aa">Read My Blog</ScatterText>
            </Link>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
}
