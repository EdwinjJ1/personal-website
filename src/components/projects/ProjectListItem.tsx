'use client';

import Link from 'next/link';
import type { Project } from '@/data/projects';

interface ProjectListItemProps {
  project: Project;
}

export default function ProjectListItem({ project }: ProjectListItemProps) {
  return (
    <li className="rounded-2xl border border-gray-700 bg-gray-800/80 p-5 transition-all hover:border-teal-500/40 hover:bg-gray-800">
      <div className="flex flex-wrap items-start justify-between gap-3 text-sm text-gray-400">
        <span className="flex items-center gap-2 text-gray-300">
          <span className="text-lg">{project.icon ?? '🚀'}</span>
          {project.category}
        </span>
        <span className="rounded-full border border-gray-600/40 bg-gray-700/30 px-3 py-1 text-xs text-gray-200">
          {project.status}
        </span>
      </div>

      <h3 className="mt-3 text-xl font-semibold text-white">{project.title}</h3>
      <p className="mt-2 text-sm text-gray-300 leading-relaxed">{project.description}</p>

      <div className="mt-4 flex flex-wrap gap-2 text-xs text-gray-300">
        {project.technologies.slice(0, 5).map((tech) => (
          <span key={`${project.id}-${tech}`} className="rounded-full border border-gray-700 px-3 py-1">
            {tech}
          </span>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between text-sm text-gray-400">
        <div className="flex flex-wrap gap-2">
          {project.highlights.slice(0, 2).map((highlight) => (
            <span key={highlight} className="rounded-full border border-gray-700 px-3 py-1 text-xs">
              {highlight}
            </span>
          ))}
        </div>
        <Link
          href={project.liveUrl ?? project.githubUrl ?? '/projects'}
          className="inline-flex items-center gap-2 rounded-full border border-gray-600 px-3 py-1 text-xs text-gray-300 hover:border-teal-500/40 hover:text-white"
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
