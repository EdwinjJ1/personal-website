'use client';

import type { CSSProperties } from 'react';
import Link from 'next/link';
import type { Project, ProjectStatus } from '@/data/projects';
import ProjectIcon from './ProjectIcon';

const getStatusStyle = (status: ProjectStatus) => {
  switch (status) {
    case 'Live':
      return { borderColor: 'rgba(45, 212, 191, 0.35)', backgroundColor: 'rgba(20, 184, 166, 0.14)', color: '#5eead4' };
    case 'In Development':
      return { borderColor: 'rgba(251, 191, 36, 0.35)', backgroundColor: 'rgba(245, 158, 11, 0.14)', color: '#fbbf24' };
    case 'Ongoing':
      return { borderColor: 'rgba(96, 165, 250, 0.35)', backgroundColor: 'rgba(59, 130, 246, 0.14)', color: '#93c5fd' };
    case 'Archived':
      return { borderColor: 'rgba(148, 163, 184, 0.35)', backgroundColor: 'rgba(100, 116, 139, 0.14)', color: '#94a3b8' };
    default:
      return { borderColor: 'rgba(114, 110, 102, 0.3)', backgroundColor: 'rgba(74, 70, 64, 0.15)', color: '#b8b4aa' };
  }
};

interface ProjectHighlightCardProps {
  project: Project;
  index?: number;
  active?: boolean;
  onActivate?: (project: Project) => void;
}

function PromptPipelinePreview({ project }: { project: Project }) {
  return (
    <div className="project-pipeline h-full">
      <div className="project-pipeline-node">
        <span>rough request</span>
        <strong>fix login bug</strong>
      </div>
      <div className="project-pipeline-flow" aria-hidden />
      <div className="project-pipeline-node">
        <span>repo context</span>
        <strong>auth, git state, risk</strong>
      </div>
      <div className="project-pipeline-flow" aria-hidden />
      <div className="project-pipeline-node project-pipeline-node--hot">
        <span>execution prompt</span>
        <strong>scoped files + verification</strong>
      </div>
    </div>
  );
}

function VisualPanel({ project, isLead }: { project: Project; isLead: boolean }) {
  if (project.heroImage) {
    const isFinalBoss = project.title === 'FinalBoss';
    const isChrono = project.title.includes('Chrono-Map');

    return (
      <div className="project-visual relative h-full min-h-[260px] overflow-hidden">
        <img
          src={project.heroImage}
          alt={`${project.title} product preview`}
          className="h-full w-full object-cover"
          loading={isLead ? 'eager' : 'lazy'}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#161412] via-transparent to-transparent" />
        {isFinalBoss ? (
          <div className="project-flow-strip" aria-hidden>
            <span>materials</span>
            <span>mock</span>
            <span>feedback</span>
          </div>
        ) : null}
        {isChrono ? (
          <div className="project-map-scan" aria-hidden>
            <span />
            <span />
            <span />
          </div>
        ) : null}
      </div>
    );
  }

  if (project.logoImage) {
    const isMemory = project.title.includes('Memory');

    return (
      <div className="project-visual relative flex h-full min-h-[260px] items-center justify-center overflow-hidden">
        <div className="absolute inset-0 opacity-70" style={{ background: `radial-gradient(circle at 50% 35%, ${project.accent}33, transparent 52%)` }} />
        {isMemory ? (
          <div className="project-memory-orbit" aria-hidden>
            <span style={{ '--i': 0 } as CSSProperties}>public</span>
            <span style={{ '--i': 1 } as CSSProperties}>private</span>
            <span style={{ '--i': 2 } as CSSProperties}>full token</span>
          </div>
        ) : null}
        <img
          src={project.logoImage}
          alt={`${project.title} logo`}
          className="relative h-32 w-32 rounded-2xl object-cover shadow-2xl sm:h-40 sm:w-40"
          loading={isLead ? 'eager' : 'lazy'}
        />
      </div>
    );
  }

  return <PromptPipelinePreview project={project} />;
}

export default function ProjectHighlightCard({ project, index = 0, active = false, onActivate }: ProjectHighlightCardProps) {
  const isLead = index === 0;
  const accent = project.accent ?? '#e8915b';
  const style = { '--project-accent': accent } as CSSProperties;
  const articleClass = isLead
    ? 'project-feature-card group lg:col-span-6 lg:grid lg:grid-cols-[0.96fr_1.04fr]'
    : 'project-feature-card project-feature-card--support project-feature-card--wide group lg:col-span-6 xl:grid xl:grid-cols-[0.72fr_1.28fr]';
  const bodyClass = isLead ? 'flex min-h-full flex-col gap-5 p-6 md:p-7' : 'flex min-h-full flex-col gap-4 p-5 md:p-6';

  return (
    <article
      className={`${articleClass}${active ? ' project-feature-card--active' : ''}`}
      style={style}
      role="button"
      tabIndex={0}
      aria-pressed={active}
      aria-label={`Inspect ${project.title}`}
      onFocus={() => onActivate?.(project)}
      onClick={(event) => {
        if ((event.target as HTMLElement).closest('a')) return;
        onActivate?.(project);
      }}
      onKeyDown={(event) => {
        if (event.key !== 'Enter' && event.key !== ' ') return;
        event.preventDefault();
        onActivate?.(project);
      }}
    >
      <div className={isLead ? 'min-h-[360px]' : 'h-56 xl:h-auto xl:min-h-[250px]'}>
        <VisualPanel project={project} isLead={isLead} />
      </div>

      <div className={bodyClass}>
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="project-icon-badge">
              <ProjectIcon icon={project.icon} size={20} />
            </span>
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-[0.2em]" style={{ color: accent }}>
                {String(index + 1).padStart(2, '0')} / Flagship
              </span>
              <h3 className={isLead ? 'mt-1 text-3xl font-black leading-tight tracking-tight md:text-4xl' : 'mt-1 text-2xl font-bold tracking-tight'} style={{ color: '#e0d8cc' }}>
                {project.title}
              </h3>
            </div>
          </div>
          <span className="rounded-full border px-3 py-1 text-xs" style={getStatusStyle(project.status)}>
            {project.status}
          </span>
        </div>

        <p className={isLead ? 'max-w-2xl text-lg leading-relaxed' : 'text-sm leading-relaxed'} style={{ color: '#c9c2b7' }}>
          {project.tagline ?? project.description}
        </p>

        {project.metrics ? (
          <div className="grid grid-cols-3 gap-px overflow-hidden rounded-lg border" style={{ borderColor: 'rgba(224,216,204,0.12)', backgroundColor: 'rgba(224,216,204,0.12)' }}>
            {project.metrics.map((metric) => (
              <div key={`${project.id}-${metric.label}`} className="px-3 py-3" style={{ backgroundColor: 'rgba(26,24,22,0.78)' }}>
                <div className={isLead ? 'text-2xl font-black tabular-nums' : 'text-xl font-black tabular-nums'} style={{ color: accent }}>
                  {metric.value}
                </div>
                <div className="mt-1 text-[10px] uppercase tracking-[0.14em]" style={{ color: '#8a8680' }}>
                  {metric.label}
                </div>
              </div>
            ))}
          </div>
        ) : null}

        <p className={isLead ? 'line-clamp-4 text-sm leading-relaxed' : 'line-clamp-3 text-sm leading-relaxed'} style={{ color: '#b8b4aa' }}>
          {project.longDescription}
        </p>

        <div className="flex flex-wrap gap-2 text-xs">
          {project.technologies.slice(0, isLead ? 7 : 4).map((tech) => (
            <span
              key={`${project.id}-${tech}`}
              className="rounded-md border px-2.5 py-1 font-medium"
              style={{ borderColor: 'rgba(224,216,204,0.1)', backgroundColor: 'rgba(224,216,204,0.06)', color: '#b8b4aa' }}
            >
              {tech}
            </span>
          ))}
        </div>

        <div className="mt-auto flex flex-wrap items-center gap-4 pt-2">
          {project.liveUrl ? (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="project-primary-link"
              onFocus={() => onActivate?.(project)}
            >
              View product
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
              style={{ color: '#9f9a92' }}
              onFocus={() => onActivate?.(project)}
            >
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
              Repository
            </a>
          ) : null}
          {!project.liveUrl && !project.githubUrl ? (
            <Link href="/about" className="text-sm" style={{ color: '#8a8680' }}>
              Learn more
            </Link>
          ) : null}
        </div>
      </div>
    </article>
  );
}
