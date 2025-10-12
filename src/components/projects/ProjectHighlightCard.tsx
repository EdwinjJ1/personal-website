'use client';

import Link from 'next/link';
import type { Project } from '@/data/projects';

interface ProjectHighlightCardProps {
  project: Project;
}

export default function ProjectHighlightCard({ project }: ProjectHighlightCardProps) {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border backdrop-blur transition-all" style={{ borderColor: 'rgba(114, 110, 102, 0.3)', backgroundColor: 'rgba(40, 38, 34, 0.9)' }}>
      <div className="flex items-center justify-center text-6xl h-40" style={{ background: 'linear-gradient(to bottom right, rgba(122, 144, 136, 0.1), rgba(106, 138, 142, 0.1))', color: 'rgba(122, 144, 136, 0.4)' }}>
        {project.icon ?? '🚀'}
      </div>

      <div className="flex flex-1 flex-col gap-5 p-6">
        <div className="flex items-start justify-between gap-3">
          <span className="rounded-full border px-3 py-1 text-xs font-semibold" style={{ borderColor: 'rgba(122, 144, 136, 0.3)', backgroundColor: 'rgba(122, 144, 136, 0.1)', color: '#7a9088' }}>
            {project.category}
          </span>
          <span className="rounded-full border px-3 py-1 text-xs" style={{ borderColor: 'rgba(114, 110, 102, 0.3)', backgroundColor: 'rgba(74, 70, 64, 0.3)', color: '#9a968e' }}>
            {project.status}
          </span>
        </div>

        <div>
          <h3 className="text-2xl font-bold" style={{ color: '#c8c0b4' }}>{project.title}</h3>
          <p className="mt-3 text-sm leading-relaxed" style={{ color: '#9a968e' }}>{project.longDescription}</p>
        </div>

        <div className="flex flex-wrap gap-2 text-xs">
          {project.technologies.slice(0, 6).map((tech) => (
            <span key={`${project.id}-${tech}`} className="rounded-full border px-3 py-1" style={{ borderColor: 'rgba(114, 110, 102, 0.3)', color: '#9a968e' }}>
              {tech}
            </span>
          ))}
        </div>

        <div className="mt-auto flex items-center justify-between text-sm">
          <div className="flex flex-wrap gap-2" style={{ color: '#9a968e' }}>
            {project.highlights.slice(0, 3).map((highlight) => (
              <span key={highlight} className="rounded-full border px-3 py-1 text-xs" style={{ borderColor: 'rgba(114, 110, 102, 0.3)' }}>
                {highlight}
              </span>
            ))}
          </div>
          {project.liveUrl ? (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold hover:scale-105 transition-transform"
              style={{ background: 'linear-gradient(to right, #7a9088, #6a8a8e)', color: '#c8c0b4' }}
            >
              View live
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          ) : (
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition-colors"
              style={{ borderColor: 'rgba(114, 110, 102, 0.3)', color: '#9a968e' }}
            >
              Request demo
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
