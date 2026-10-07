'use client';

import BaseCard from './BaseCard';
import Link from 'next/link';
import ProjectIcon from '@/components/projects/ProjectIcon';
import { getStatusStyle } from '@/lib/statusStyles';

interface Project {
  title: string;
  description: string;
  technologies: string[];
  status: 'Live' | 'In Development' | 'Coming Soon';
  link?: string;
  icon: string;
}

interface ProjectCardProps {
  project: Project;
  delay?: number;
}

export default function ProjectCard({ project, delay = 0 }: ProjectCardProps) {
  const CardContent = () => (
    <BaseCard delay={delay}>
      <div className="h-full flex flex-col">
        <div className="flex justify-between items-start mb-3">
          <div className="text-sage"><ProjectIcon icon={project.icon} size={24} /></div>
          <span
            className="px-2 py-1 text-xs rounded-full border"
            style={getStatusStyle(project.status)}
          >
            {project.status}
          </span>
        </div>

        <h3 className="text-ink font-semibold mb-2 text-sm leading-tight">
          {project.title}
        </h3>

        <p className="text-ink-mid text-xs mb-3 flex-grow leading-relaxed">
          {project.description}
        </p>

        <div className="flex flex-wrap gap-1 mb-3">
          {project.technologies.slice(0, 3).map((tech) => (
            <span key={tech} className="badge px-2 py-1 text-xs rounded">
              {tech}
            </span>
          ))}
          {project.technologies.length > 3 && (
            <span className="px-2 py-1 text-xs rounded text-ink-dim bg-surface-4">
              +{project.technologies.length - 3}
            </span>
          )}
        </div>

        {project.link && (
          <div className="text-sage hover:text-sage-bright text-xs font-medium inline-flex items-center">
            {project.status === 'Live' ? 'View Live' : 'Learn More'}
            <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        )}
      </div>
    </BaseCard>
  );

  return project.link ? (
    project.link.startsWith('http') ? (
      <a href={project.link} target="_blank" rel="noopener noreferrer">
        <CardContent />
      </a>
    ) : (
      <Link href={project.link}>
        <CardContent />
      </Link>
    )
  ) : (
    <CardContent />
  );
}