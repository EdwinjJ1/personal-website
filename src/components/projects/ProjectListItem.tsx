'use client';

import Link from 'next/link';
import type { Project, ProjectStatus } from '@/data/projects';
import ProjectIcon from './ProjectIcon';

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

interface ProjectListItemProps {
  project: Project;
}

export default function ProjectListItem({ project }: ProjectListItemProps) {
  return (
    <li className="showcase-card flex flex-col gap-3 rounded-2xl p-6 sm:flex-row sm:items-center sm:gap-6">
      <span className="accent-text accent-soft-bg flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl">
        <ProjectIcon icon={project.icon} size={22} />
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-3">
          <h3 className="text-xl font-semibold" style={{ color: '#e0d8cc' }}>{project.title}</h3>
          <span className="accent-text text-xs font-semibold uppercase tracking-wider">{project.category}</span>
          <span className="rounded-full border px-2.5 py-0.5 text-xs" style={getStatusStyle(project.status)}>
            {project.status}
          </span>
        </div>
        <p className="mt-2 text-sm leading-relaxed" style={{ color: '#b8b4aa' }}>{project.description}</p>
        <div className="mt-3 flex flex-wrap gap-2 text-xs" style={{ color: '#8a8680' }}>
          {project.technologies.slice(0, 5).map((tech) => (
            <span key={`${project.id}-${tech}`} className="rounded-md px-2 py-0.5" style={{ backgroundColor: 'rgba(114, 110, 102, 0.15)' }}>
              {tech}
            </span>
          ))}
        </div>
      </div>

      <Link
        href={project.liveUrl ?? project.githubUrl ?? '/projects'}
        className="accent-text inline-flex flex-shrink-0 items-center gap-1.5 text-sm font-medium transition-all hover:gap-2.5"
      >
        Open
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </Link>
    </li>
  );
}
