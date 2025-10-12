'use client';

import Link from 'next/link';
import type { Project } from '@/data/projects';

interface ProjectListItemProps {
  project: Project;
}

export default function ProjectListItem({ project }: ProjectListItemProps) {
  return (
    <li className="rounded-2xl border p-5 transition-all" style={{ borderColor: 'rgba(114, 110, 102, 0.3)', backgroundColor: 'rgba(40, 38, 34, 0.8)' }}>
      <div className="flex flex-wrap items-start justify-between gap-3 text-sm" style={{ color: '#9a968e' }}>
        <span className="flex items-center gap-2" style={{ color: '#9a968e' }}>
          <span className="text-lg">{project.icon ?? '🚀'}</span>
          {project.category}
        </span>
        <span className="rounded-full border px-3 py-1 text-xs" style={{ borderColor: 'rgba(114, 110, 102, 0.3)', backgroundColor: 'rgba(74, 70, 64, 0.3)', color: '#9a968e' }}>
          {project.status}
        </span>
      </div>

      <h3 className="mt-3 text-xl font-semibold" style={{ color: '#c8c0b4' }}>{project.title}</h3>
      <p className="mt-2 text-sm leading-relaxed" style={{ color: '#9a968e' }}>{project.description}</p>

      <div className="mt-4 flex flex-wrap gap-2 text-xs" style={{ color: '#9a968e' }}>
        {project.technologies.slice(0, 5).map((tech) => (
          <span key={`${project.id}-${tech}`} className="rounded-full border px-3 py-1" style={{ borderColor: 'rgba(114, 110, 102, 0.3)' }}>
            {tech}
          </span>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between text-sm" style={{ color: '#9a968e' }}>
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
          style={{ borderColor: 'rgba(114, 110, 102, 0.3)', color: '#9a968e' }}
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
