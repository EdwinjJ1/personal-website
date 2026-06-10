'use client';

import Link from 'next/link';
import type { Project, ProjectStatus } from '@/data/projects';
import ProjectIcon from './ProjectIcon';

const getStatusStyle = (status: ProjectStatus) => {
  switch (status) {
    case 'Live':
      return { borderColor: 'rgba(45, 212, 191, 0.3)', backgroundColor: 'rgba(20, 184, 166, 0.15)', color: '#5eead4' };
    case 'In Development':
      return { borderColor: 'rgba(251, 191, 36, 0.3)', backgroundColor: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24' };
    case 'Ongoing':
      return { borderColor: 'rgba(96, 165, 250, 0.3)', backgroundColor: 'rgba(59, 130, 246, 0.15)', color: '#93c5fd' };
    case 'Archived':
      return { borderColor: 'rgba(148, 163, 184, 0.3)', backgroundColor: 'rgba(100, 116, 139, 0.15)', color: '#94a3b8' };
    default:
      return { borderColor: 'rgba(114, 110, 102, 0.3)', backgroundColor: 'rgba(74, 70, 64, 0.15)', color: '#b8b4aa' };
  }
};

interface ProjectHighlightCardProps {
  project: Project;
  index?: number;
}

export default function ProjectHighlightCard({ project, index }: ProjectHighlightCardProps) {
  return (
    <article className="group showcase-card flex h-full flex-col overflow-hidden rounded-3xl">
      {/* Large gradient cover */}
      <div className="showcase-cover relative flex h-56 items-center justify-center overflow-hidden">
        {typeof index === 'number' && (
          <span
            className="section-index pointer-events-none absolute -left-2 -top-6 text-[8rem] font-black leading-none"
            aria-hidden
          >
            {String(index + 1).padStart(2, '0')}
          </span>
        )}
        <span className="showcase-cover-icon" style={{ color: 'rgba(224, 216, 204, 0.35)' }}>
          <ProjectIcon icon={project.icon} size={84} />
        </span>
        <span className="absolute right-4 top-4 rounded-full border px-3 py-1 text-xs" style={getStatusStyle(project.status)}>
          {project.status}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-4 p-7">
        <span className="accent-text text-xs font-semibold uppercase tracking-[0.18em]">
          {project.category}
        </span>

        <h3 className="text-3xl font-bold tracking-tight" style={{ color: '#e0d8cc' }}>
          {project.title}
        </h3>

        <p className="text-sm leading-relaxed" style={{ color: '#b8b4aa' }}>
          {project.longDescription}
        </p>

        <div className="flex flex-wrap gap-2 text-xs">
          {project.technologies.slice(0, 6).map((tech) => (
            <span
              key={`${project.id}-${tech}`}
              className="rounded-md px-2.5 py-1 font-medium"
              style={{ backgroundColor: 'rgba(114, 110, 102, 0.15)', color: '#b8b4aa' }}
            >
              {tech}
            </span>
          ))}
        </div>

        <div className="mt-auto flex items-center gap-4 pt-2">
          {project.liveUrl ? (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="accent-text inline-flex items-center gap-2 text-sm font-semibold transition-transform group-hover:gap-3"
            >
              View live
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          ) : null}
          {project.githubUrl ? (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm transition-colors hover:opacity-80"
              style={{ color: '#8a8680' }}
            >
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
              Code
            </a>
          ) : null}
          {!project.liveUrl && !project.githubUrl ? (
            <Link href="/about" className="text-sm" style={{ color: '#8a8680' }}>
              Learn more →
            </Link>
          ) : null}
        </div>
      </div>
    </article>
  );
}
