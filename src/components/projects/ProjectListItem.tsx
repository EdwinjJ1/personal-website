'use client';

import Link from 'next/link';
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

interface ProjectListItemProps {
  project: Project;
}

export default function ProjectListItem({ project }: ProjectListItemProps) {
  return (
    <li className="rounded-2xl border p-5 transition-all" style={{ borderColor: 'rgba(114, 110, 102, 0.3)', backgroundColor: 'rgba(40, 38, 34, 0.8)' }}>
      <div className="flex flex-wrap items-start justify-between gap-3 text-sm" style={{ color: '#b8b4aa' }}>
        <span className="flex items-center gap-2" style={{ color: '#b8b4aa' }}>
          <span className="text-lg">{project.icon ?? '🚀'}</span>
          {project.category}
        </span>
        <span className="rounded-full border px-3 py-1 text-xs" style={getStatusStyle(project.status)}>
          {project.status}
        </span>
      </div>

      <h3 className="mt-3 text-xl font-semibold" style={{ color: '#e0d8cc' }}>{project.title}</h3>
      <p className="mt-2 text-sm leading-relaxed" style={{ color: '#b8b4aa' }}>{project.description}</p>

      <div className="mt-4 flex flex-wrap gap-2 text-xs" style={{ color: '#b8b4aa' }}>
        {project.technologies.slice(0, 5).map((tech) => (
          <span key={`${project.id}-${tech}`} className="rounded-full border px-3 py-1" style={{ borderColor: 'rgba(114, 110, 102, 0.3)' }}>
            {tech}
          </span>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between text-sm" style={{ color: '#b8b4aa' }}>
        <div className="flex flex-wrap gap-2">
          {project.highlights.slice(0, 2).map((highlight) => (
            <span key={highlight} className="rounded-full border px-3 py-1 text-xs" style={{ borderColor: 'rgba(114, 110, 102, 0.3)' }}>
              {highlight}
            </span>
          ))}
        </div>
        <Link
          href={project.liveUrl ?? project.githubUrl ?? '/projects'}
          className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs transition-colors"
          style={{ borderColor: 'rgba(114, 110, 102, 0.3)', color: '#b8b4aa' }}
        >
          Learn more
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </li>
  );
}
