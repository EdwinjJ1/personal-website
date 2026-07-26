'use client';

import Link from 'next/link';
import type { Project } from '@/data/projects';
import ProjectIcon from './ProjectIcon';
import { getStatusStyle } from '@/lib/statusStyles';

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
          <h3 className="text-xl font-semibold" style={{ color: 'rgb(var(--p-ink))' }}>{project.title}</h3>
          <span className="accent-text text-xs font-semibold uppercase tracking-wider">{project.category}</span>
          <span className="rounded-full border px-2.5 py-0.5 text-xs" style={getStatusStyle(project.status)}>
            {project.status}
          </span>
        </div>
        <p className="mt-2 text-sm leading-relaxed" style={{ color: 'rgb(var(--p-ink-mid))' }}>{project.description}</p>
        <div className="mt-3 flex flex-wrap gap-2 text-xs" style={{ color: 'rgb(var(--p-ink-dim))' }}>
          {project.technologies.slice(0, 5).map((tech) => (
            <span key={`${project.id}-${tech}`} className="rounded-md px-2 py-0.5" style={{ backgroundColor: 'rgb(var(--p-line) / 0.15)' }}>
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
