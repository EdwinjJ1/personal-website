'use client';

import React from 'react';
import { motion } from 'framer-motion';
import PageTransition from '@/components/PageTransition';
import { projects, projectCategories } from '@/data/projects';
import ProjectCategoryFilter from '@/components/projects/ProjectCategoryFilter';
import ProjectHighlightCard from '@/components/projects/ProjectHighlightCard';
import ProjectListItem from '@/components/projects/ProjectListItem';

const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.5, staggerChildren: 0.08 },
  },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.2, 0.8, 0.2, 1] as const } },
};

export default function ProjectsPage() {
  const [selectedCategory, setSelectedCategory] = React.useState('All');

  const filteredProjects = React.useMemo(() => {
    if (selectedCategory === 'All') return projects;
    return projects.filter((project) => project.category === selectedCategory);
  }, [selectedCategory]);

  const featured = filteredProjects.filter((project) => project.featured);
  const remaining = filteredProjects.filter((project) => !project.featured);
  const liveCount = projects.filter((p) => p.status === 'Live').length;

  const highlight = featured.length > 0 ? featured : filteredProjects.slice(0, 2);
  const log = remaining.length > 0 ? remaining : filteredProjects.slice(2);

  return (
    <PageTransition>
      <div className="page-accent--orange min-h-screen pt-24" style={{ color: '#e0d8cc' }}>
        <div className="mx-auto max-w-6xl px-6 py-12">
          <motion.div variants={container} initial="hidden" animate="visible">

            {/* ── Editorial header ── */}
            <motion.header variants={item} className="relative mb-16">
              <span className="accent-text mb-4 block text-sm font-semibold uppercase tracking-[0.25em]">
                Selected Work
              </span>
              <h1 className="max-w-3xl text-6xl font-black leading-[0.95] tracking-tight md:text-7xl">
                Things I&apos;ve
                <br />
                <span className="accent-text">built &amp; shipped.</span>
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-relaxed" style={{ color: '#b8b4aa' }}>
                Products, experiments and platforms — from AI automation to
                production-ready web apps. Built mostly at 2am.
              </p>

              {/* Stat strip */}
              <div className="mt-10 flex flex-wrap gap-x-10 gap-y-4 border-t pt-6" style={{ borderColor: 'rgba(114,110,102,0.25)' }}>
                {[
                  { n: projects.length, label: 'Projects' },
                  { n: liveCount, label: 'Live now' },
                  { n: projectCategories.length, label: 'Categories' },
                ].map((stat) => (
                  <div key={stat.label}>
                    <div className="accent-text text-3xl font-bold tabular-nums">{stat.n}</div>
                    <div className="text-xs uppercase tracking-wider" style={{ color: '#8a8680' }}>{stat.label}</div>
                  </div>
                ))}
              </div>
            </motion.header>

            {/* ── Filter ── */}
            <motion.div variants={item} className="mb-12">
              <ProjectCategoryFilter
                categories={projectCategories}
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
              />
            </motion.div>

            {/* ── Featured gallery ── */}
            <motion.section variants={item} className="mb-20">
              <div className="mb-8 flex items-baseline gap-3">
                <span className="accent-text text-sm font-semibold tabular-nums">/ 01</span>
                <h2 className="text-2xl font-bold tracking-tight">Featured</h2>
              </div>
              <div className="grid gap-6 lg:grid-cols-2">
                {highlight.map((project, i) => (
                  <ProjectHighlightCard key={project.id} project={project} index={i} />
                ))}
              </div>
            </motion.section>

            {/* ── Project log ── */}
            {log.length > 0 && (
              <motion.section variants={item}>
                <div className="mb-8 flex items-baseline justify-between gap-3">
                  <div className="flex items-baseline gap-3">
                    <span className="accent-text text-sm font-semibold tabular-nums">/ 02</span>
                    <h2 className="text-2xl font-bold tracking-tight">Everything else</h2>
                  </div>
                  <span className="text-sm" style={{ color: '#8a8680' }}>
                    {filteredProjects.length} total
                  </span>
                </div>
                <ul className="space-y-4">
                  {log.map((project) => (
                    <ProjectListItem key={project.id} project={project} />
                  ))}
                </ul>
              </motion.section>
            )}
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
}
