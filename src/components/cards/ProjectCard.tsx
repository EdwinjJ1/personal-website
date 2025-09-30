'use client';

import BaseCard from './BaseCard';
import Link from 'next/link';

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
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Live':
        return 'bg-green-900/30 text-green-300 border-green-500/30';
      case 'In Development':
        return 'bg-yellow-900/30 text-yellow-300 border-yellow-500/30';
      case 'Coming Soon':
        return 'bg-blue-900/30 text-blue-300 border-blue-500/30';
      default:
        return 'bg-gray-900/30 text-gray-300 border-gray-500/30';
    }
  };

  const CardContent = () => (
    <BaseCard delay={delay}>
      <div className="h-full flex flex-col">
        <div className="flex justify-between items-start mb-3">
          <div className="text-2xl">{project.icon}</div>
          <span className={`px-2 py-1 text-xs rounded-full border ${getStatusColor(project.status)}`}>
            {project.status}
          </span>
        </div>

        <h3 className="text-white font-semibold mb-2 text-sm leading-tight">
          {project.title}
        </h3>

        <p className="text-gray-400 text-xs mb-3 flex-grow leading-relaxed">
          {project.description}
        </p>

        <div className="flex flex-wrap gap-1 mb-3">
          {project.technologies.slice(0, 3).map((tech) => (
            <span
              key={tech}
              className="px-2 py-1 bg-teal-900/20 text-teal-400 text-xs rounded border border-teal-500/20"
            >
              {tech}
            </span>
          ))}
          {project.technologies.length > 3 && (
            <span className="px-2 py-1 bg-gray-700 text-gray-400 text-xs rounded">
              +{project.technologies.length - 3}
            </span>
          )}
        </div>

        {project.link && (
          <div className="text-teal-400 hover:text-teal-300 text-xs font-medium inline-flex items-center">
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