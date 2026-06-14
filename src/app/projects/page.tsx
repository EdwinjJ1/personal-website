'use client';

import React from 'react';
import { motion } from 'framer-motion';
import PageTransition from '@/components/PageTransition';
import { projects, projectCategories } from '@/data/projects';
import ProjectCategoryFilter from '@/components/projects/ProjectCategoryFilter';
import ProjectFlagshipShowcase from '@/components/projects/ProjectFlagshipShowcase';
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
  const flagshipCount = projects.filter((p) => p.featured).length;

  const flagshipOrder = ['FinalBoss', 'KnowMe Memory MCP', 'Chrono-Map: Sydney Layers', 'Chiron Prompt Enhancer'];
  const highlight = featured.length > 0
    ? [...featured].sort((a, b) => {
        const aIndex = flagshipOrder.indexOf(a.title);
        const bIndex = flagshipOrder.indexOf(b.title);
        return (aIndex === -1 ? 99 : aIndex) - (bIndex === -1 ? 99 : bIndex);
      })
    : filteredProjects.slice(0, 2);
  const log = remaining.length > 0 ? remaining : filteredProjects.slice(2);

  return (
    <PageTransition>
      <div className="page-accent--orange project-page-shell min-h-screen pt-20" style={{ color: '#e0d8cc' }}>
        <div className="mx-auto max-w-6xl px-6 py-10">
          <motion.div variants={container} initial="hidden" animate="visible">

            {/* ── Editorial header ── */}
            <motion.header variants={item} className="relative mb-12">
              <span className="accent-text mb-4 block text-sm font-semibold uppercase tracking-[0.25em]">
                Selected Systems
              </span>
              <h1 className="max-w-3xl text-5xl font-black leading-[0.95] tracking-tight md:text-6xl">
                Products with
                <br />
                <span className="accent-text">real leverage.</span>
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-relaxed" style={{ color: '#b8b4aa' }}>
                Four flagship builds at the top: personal AI memory, prompt enhancement,
                story-rich maps, and AI exam prep. The rest of the archive stays below.
              </p>

              {/* Stat strip */}
              <div className="mt-10 flex flex-wrap gap-x-10 gap-y-4 border-t pt-6" style={{ borderColor: 'rgba(114,110,102,0.25)' }}>
                {[
                  { n: flagshipCount, label: 'Flagships' },
                  { n: liveCount, label: 'Live now' },
                  { n: projects.length, label: 'Total builds' },
                ].map((stat) => (
                  <div key={stat.label}>
                    <div className="accent-text text-3xl font-bold tabular-nums">{stat.n}</div>
                    <div className="text-xs uppercase tracking-wider" style={{ color: '#8a8680' }}>{stat.label}</div>
                  </div>
                ))}
              </div>
            </motion.header>

            {/* ── Filter ── */}
            <motion.div variants={item} className="mb-10">
              <ProjectCategoryFilter
                categories={projectCategories}
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
              />
            </motion.div>

            {/* ── Featured gallery ── */}
            <motion.section variants={item} className="mb-20">
              <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div className="flex items-baseline gap-3">
                <span className="accent-text text-sm font-semibold tabular-nums">/ 01</span>
                  <h2 className="text-2xl font-bold tracking-tight">Flagship builds</h2>
                </div>
                <p className="max-w-md text-sm leading-relaxed" style={{ color: '#8a8680' }}>
                  Ordered for recruiters, collaborators, and investors: strongest product signal first.
                </p>
              </div>
              <ProjectFlagshipShowcase projects={highlight} />
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
