'use client';

import React from 'react';
import { motion } from 'framer-motion';
import PageTransition from '@/components/PageTransition';
import { projects, projectCategories } from '@/data/projects';
import ProjectCategoryFilter from '@/components/projects/ProjectCategoryFilter';
import ProjectHighlightCard from '@/components/projects/ProjectHighlightCard';
import ProjectListItem from '@/components/projects/ProjectListItem';
import GradientText from '@/components/GradientText';

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
      <div className="min-h-screen pt-20" style={{ color: '#e0d8cc' }}>
        <div className="container mx-auto px-6 py-12">
          <motion.div variants={container} initial="hidden" animate="visible" className="max-w-7xl mx-auto">
            <motion.div variants={item} className="text-center mb-16">
              <h1 className="text-5xl font-bold mb-6">
                <GradientText
                  colors={['#7a9088', '#6a8a8e', '#7a9088', '#6a8a8e', '#7a9088']}
                  animationSpeed={6}
                  showBorder={false}
                >
                  Projects
                </GradientText>
              </h1>
              <p className="text-xl max-w-3xl mx-auto" style={{ color: '#b8b4aa' }}>
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
              <h2 className="text-3xl font-bold mb-8" style={{ color: '#e0d8cc' }}>Featured builds</h2>
              <div className="grid gap-8 lg:grid-cols-2">
                {(featured.length > 0 ? featured : filteredProjects.slice(0, 2)).map((project) => (
                  <ProjectHighlightCard key={project.id} project={project} />
                ))}
              </div>
            </motion.section>

            <motion.section variants={item}>
              <div className="flex items-center justify-between gap-4 mb-6">
                <h3 className="text-2xl font-semibold" style={{ color: '#e0d8cc' }}>Project log</h3>
                <p className="text-sm" style={{ color: '#8a8680' }}>
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
