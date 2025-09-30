'use client';

import Link from 'next/link';
import type { Project } from '@/data/projects';

interface ProjectHighlightCardProps {
  project: Project;
}

export default function ProjectHighlightCard({ project }: ProjectHighlightCardProps) {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-gray-700 bg-gray-800/90 backdrop-blur transition-all hover:border-teal-500/50">
      <div className="flex items-center justify-center bg-gradient-to-br from-teal-900/20 to-cyan-900/20 text-6xl text-teal-400/40 h-40">
        {project.icon ?? '🚀'}
      </div>

      <div className="flex flex-1 flex-col gap-5 p-6">
        <div className="flex items-start justify-between gap-3">
          <span className="rounded-full border border-teal-500/30 bg-teal-500/10 px-3 py-1 text-xs font-semibold text-teal-200">
            {project.category}
          </span>
          <span className="rounded-full border border-gray-600/40 bg-gray-700/30 px-3 py-1 text-xs text-gray-200">
            {project.status}
          </span>
        </div>

        <div>
          <h3 className="text-2xl font-bold text-white">{project.title}</h3>
          <p className="mt-3 text-sm text-gray-300 leading-relaxed">{project.longDescription}</p>
        </div>

        <div className="flex flex-wrap gap-2 text-xs">
          {project.technologies.slice(0, 6).map((tech) => (
            <span key={`${project.id}-${tech}`} className="rounded-full border border-gray-700 px-3 py-1 text-gray-200">
              {tech}
            </span>
          ))}
        </div>

        <div className="mt-auto flex items-center justify-between text-sm">
          <div className="flex flex-wrap gap-2 text-gray-400">
            {project.highlights.slice(0, 3).map((highlight) => (
              <span key={highlight} className="rounded-full border border-gray-700 px-3 py-1 text-xs">
                {highlight}
              </span>
            ))}
          </div>
          {project.liveUrl ? (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-teal-500 to-cyan-500 px-4 py-2 text-sm font-semibold text-white hover:scale-105 transition-transform"
            >
              View live
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          ) : (
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-full border border-gray-600 px-4 py-2 text-sm text-gray-300 hover:border-teal-500/40 hover:text-white"
            >
              Request demo
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
