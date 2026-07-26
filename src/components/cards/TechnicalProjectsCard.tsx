'use client';

import Link from 'next/link';
import BaseCard from './BaseCard';
import type { Project } from '@/data/projects';
import ProjectIcon from '@/components/projects/ProjectIcon';
import { getStatusStyle } from '@/lib/statusStyles';

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
          <h3 className="text-lg font-semibold flex items-center gap-2" style={{ color: 'rgb(var(--p-ink))' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgb(var(--p-sage))" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
            </svg>
            Technical Projects
          </h3>
          <p className="text-sm mt-1" style={{ color: 'rgb(var(--p-ink-mid))' }}>
            A snapshot of the products I am building right now.
          </p>
        </div>

        <div className="flex-1 min-h-0 space-y-2 overflow-hidden">
          {previewProjects.map((project) => (
            <Link
              key={project.id}
              href="/projects"
              className="group flex items-start gap-3 rounded-xl border p-2 transition-all"
              style={{ borderColor: 'rgb(var(--p-line) / 0.3)', backgroundColor: 'rgb(var(--p-surface-2))' }}
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg" style={{ backgroundColor: 'rgb(var(--p-sage) / 0.1)', color: 'rgb(var(--p-sage))' }}>
                <ProjectIcon icon={project.icon} size={16} />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold transition-colors" style={{ color: 'rgb(var(--p-ink))' }}>
                    {project.title}
                  </p>
                  <span
                    className="whitespace-nowrap rounded-full px-2.5 py-1 text-[10px] uppercase tracking-wide border"
                    style={getStatusStyle(project.status)}
                  >
                    {project.status}
                  </span>
                </div>
                <p className="mt-1 text-xs line-clamp-1" style={{ color: 'rgb(var(--p-ink-mid))' }}>{project.description}</p>
              </div>
            </Link>
          ))}
        </div>

        <Link
          href="/projects"
          className="inline-flex items-center gap-1 self-end text-xs font-medium transition-colors"
          style={{ color: 'rgb(var(--p-sage))' }}
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
