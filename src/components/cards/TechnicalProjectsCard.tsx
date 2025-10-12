'use client';

import Link from 'next/link';
import BaseCard from './BaseCard';
import type { Project, ProjectStatus } from '@/data/projects';

const getStatusStyle = (status: ProjectStatus) => {
  switch (status) {
    case 'Live':
      return {
        borderColor: 'rgba(45, 212, 191, 0.3)',
        backgroundColor: 'rgba(20, 184, 166, 0.15)',
        color: '#5eead4'
      };
    case 'In Development':
      return {
        borderColor: 'rgba(251, 191, 36, 0.3)',
        backgroundColor: 'rgba(245, 158, 11, 0.15)',
        color: '#fbbf24'
      };
    case 'Ongoing':
      return {
        borderColor: 'rgba(96, 165, 250, 0.3)',
        backgroundColor: 'rgba(59, 130, 246, 0.15)',
        color: '#93c5fd'
      };
    case 'Archived':
      return {
        borderColor: 'rgba(148, 163, 184, 0.3)',
        backgroundColor: 'rgba(100, 116, 139, 0.15)',
        color: '#94a3b8'
      };
    default:
      return {
        borderColor: 'rgba(114, 110, 102, 0.3)',
        backgroundColor: 'rgba(74, 70, 64, 0.15)',
        color: '#b8b4aa'
      };
  }
};

interface TechnicalProjectsCardProps {
  projects: Project[];
  delay?: number;
}

export default function TechnicalProjectsCard({ projects, delay = 0.6 }: TechnicalProjectsCardProps) {
  const previewProjects = projects.slice(0, 2);

  return (
    <BaseCard size="md" hover={false} delay={delay} className="md:col-span-2 lg:col-span-4">
      <div className="flex h-full flex-col gap-3.5">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2" style={{ color: '#e0d8cc' }}>
            <span className="text-2xl" style={{ color: '#7a9088' }}>🛠️</span>
            Technical Projects
          </h3>
          <p className="text-sm mt-1" style={{ color: '#b8b4aa' }}>
            A snapshot of the products I am building right now.
          </p>
        </div>

        <div className="space-y-2">
          {previewProjects.map((project) => (
            <Link
              key={project.id}
              href="/projects"
              className="group flex items-start gap-3 rounded-xl border p-2 transition-all"
              style={{ borderColor: 'rgba(114, 110, 102, 0.3)', backgroundColor: '#211e1c' }}
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg text-lg" style={{ backgroundColor: 'rgba(122, 144, 136, 0.1)' }}>
                {project.icon ?? '🚀'}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold transition-colors" style={{ color: '#e0d8cc' }}>
                    {project.title}
                  </p>
                  <span
                    className="whitespace-nowrap rounded-full px-2.5 py-1 text-[10px] uppercase tracking-wide border"
                    style={getStatusStyle(project.status)}
                  >
                    {project.status}
                  </span>
                </div>
                <p className="mt-1 text-xs line-clamp-1" style={{ color: '#b8b4aa' }}>{project.description}</p>
              </div>
            </Link>
          ))}
        </div>

        <Link
          href="/projects"
          className="inline-flex items-center gap-1 self-end text-xs font-medium transition-colors"
          style={{ color: '#7a9088' }}
        >
          See all projects
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </BaseCard>
  );
}
