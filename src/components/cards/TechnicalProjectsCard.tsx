'use client';

import Link from 'next/link';
import BaseCard from './BaseCard';
import type { Project, ProjectStatus } from '@/data/projects';

const statusClasses: Record<ProjectStatus, string> = {
  Live: 'bg-teal-500/15 text-teal-200 border border-teal-500/30',
  'In Development': 'bg-amber-500/15 text-amber-200 border border-amber-500/30',
  Ongoing: 'bg-sky-500/15 text-sky-200 border border-sky-500/30',
  Archived: 'bg-slate-500/15 text-slate-200 border border-slate-500/30',
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
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <span className="text-2xl text-teal-300">🛠️</span>
            Technical Projects
          </h3>
          <p className="text-sm text-gray-400 mt-1">
            A snapshot of the products I am building right now.
          </p>
        </div>

        <div className="space-y-2">
          {previewProjects.map((project) => (
            <Link
              key={project.id}
              href="/projects"
              className="group flex items-start gap-3 rounded-xl border border-gray-700/60 bg-gray-900/60 p-2 transition-all hover:border-teal-400/40 hover:bg-gray-900"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-500/10 text-lg">
                {project.icon ?? '🚀'}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-white group-hover:text-teal-200 transition-colors">
                    {project.title}
                  </p>
                  <span
                    className={`whitespace-nowrap rounded-full px-2.5 py-1 text-[10px] uppercase tracking-wide ${
                      statusClasses[project.status]
                    }`}
                  >
                    {project.status}
                  </span>
                </div>
                <p className="mt-1 text-xs text-gray-400 line-clamp-1">{project.description}</p>
              </div>
            </Link>
          ))}
        </div>

        <Link
          href="/projects"
          className="inline-flex items-center gap-1 self-end text-xs font-medium text-teal-200 hover:text-teal-100"
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
