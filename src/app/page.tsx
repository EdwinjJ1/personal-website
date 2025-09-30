'use client';

import React from 'react';
import { motion } from 'framer-motion';
import PageTransition from '@/components/PageTransition';
import ClientOnlyParticles from '@/components/ClientOnlyParticles';

// Import modular cards
import PersonalCard from '@/components/cards/PersonalCard';
import LocationCard from '@/components/cards/LocationCard';
import SkillsCard from '@/components/cards/SkillsCard';
import ActivityCard from '@/components/cards/ActivityCard';
import MusicCard from '@/components/cards/MusicCard';
import TechnicalProjectsCard from '@/components/cards/TechnicalProjectsCard';
import PhotographerCard from '@/components/cards/PhotographerCard';
import BlogCard from '@/components/cards/BlogCard';
import { projects as projectData } from '@/data/projects';

const orderedProjects = [...projectData.filter((project) => project.featured), ...projectData.filter((project) => !project.featured)];

export default function Home() {
  return (
    <PageTransition>
      <div className="min-h-screen bg-gray-900 text-white">
        <ClientOnlyParticles />

        <div className="relative z-10 mx-auto w-full max-w-screen-2xl px-4 pt-24 pb-12">
          {/* Modular Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-12 gap-3 auto-rows-[minmax(150px,_auto)]">

            {/* Personal Info - Takes 2 columns */}
            <PersonalCard />

            {/* Location - Takes 1 column */}
            <LocationCard />

            {/* Skills - Takes 2 columns */}
            <SkillsCard />

            {/* Music Player - Takes 2 columns */}
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
            className="mt-12 flex flex-wrap justify-center gap-3"
          >
            <a
              href="/about"
              className="px-6 py-3 bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-semibold rounded-full hover:from-teal-600 hover:to-cyan-600 transform hover:scale-105 transition-all duration-300"
            >
              Learn More About Me
            </a>
            <a
              href="/projects"
              className="px-6 py-3 border border-teal-500 text-teal-400 font-semibold rounded-full hover:bg-teal-500 hover:text-white transition-all duration-300"
            >
              View All Projects
            </a>
            <a
              href="/blog"
              className="px-6 py-3 border border-gray-500 text-gray-400 font-semibold rounded-full hover:bg-gray-600 hover:text-white transition-all duration-300"
            >
              Read My Blog
            </a>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
}
