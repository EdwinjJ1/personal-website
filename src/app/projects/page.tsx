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
    transition: { duration: 0.6, staggerChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function ProjectsPage() {
  const [selectedCategory, setSelectedCategory] = React.useState('All');

  const filteredProjects = React.useMemo(() => {
    if (selectedCategory === 'All') {
      return projects;
    }
    return projects.filter((project) => project.category === selectedCategory);
  }, [selectedCategory]);

  const featured = filteredProjects.filter((project) => project.featured);
  const remaining = filteredProjects.filter((project) => !project.featured);

  return (
    <PageTransition>
      <div className="min-h-screen bg-gray-900 text-white pt-20">
        <div className="container mx-auto px-6 py-12">
          <motion.div variants={container} initial="hidden" animate="visible" className="max-w-7xl mx-auto">
            <motion.div variants={item} className="text-center mb-16">
              <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent">
                Projects
              </h1>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                A collection of the products, experiments, and platforms I am building — from AI automation to production-ready
                web applications.
              </p>
            </motion.div>

            <motion.div variants={item} className="mb-12">
              <ProjectCategoryFilter
                categories={projectCategories}
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
              />
            </motion.div>

            <motion.section variants={item} className="mb-16">
              <h2 className="text-3xl font-bold text-white mb-8">Featured builds</h2>
              <div className="grid gap-8 lg:grid-cols-2">
                {(featured.length > 0 ? featured : filteredProjects.slice(0, 2)).map((project) => (
                  <ProjectHighlightCard key={project.id} project={project} />
                ))}
              </div>
            </motion.section>

            <motion.section variants={item}>
              <div className="flex items-center justify-between gap-4 mb-6">
                <h3 className="text-2xl font-semibold text-white">Project log</h3>
                <p className="text-sm text-gray-500">
                  Showing {filteredProjects.length} project{filteredProjects.length === 1 ? '' : 's'} in total
                </p>
              </div>

              <ul className="space-y-6">
                {(remaining.length > 0 ? remaining : filteredProjects.slice(2)).map((project) => (
                  <ProjectListItem key={project.id} project={project} />
                ))}
              </ul>
            </motion.section>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
}
