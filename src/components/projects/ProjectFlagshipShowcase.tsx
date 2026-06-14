'use client';

import React from 'react';
import type { Project } from '@/data/projects';
import ProjectHighlightCard from './ProjectHighlightCard';

interface ProjectFlagshipShowcaseProps {
  projects: Project[];
}

function getInspectorProfile(project: Project) {
  if (project.title === 'FinalBoss') {
    return {
      mode: 'exam engine',
      thesis: 'A paid study workspace, not a content archive.',
      signal: 'materials -> mock -> feedback',
      angle: 'Education SaaS with a campus-first GTM.',
    };
  }

  if (project.title.includes('Memory')) {
    return {
      mode: 'identity layer',
      thesis: 'Personal context as portable AI infrastructure.',
      signal: 'public/private token split',
      angle: 'Open-core MCP engine with hosted product path.',
    };
  }

  if (project.title.includes('Chrono-Map')) {
    return {
      mode: 'spatial story system',
      thesis: 'Map interaction plus editorial storytelling.',
      signal: 'place -> story -> route',
      angle: 'Cultural discovery product that can scale city by city.',
    };
  }

  return {
    mode: 'prompt compiler',
    thesis: 'Turns vague intent into executable repo context.',
    signal: 'rough request -> scoped execution',
    angle: 'Developer workflow product for terminal-first AI users.',
  };
}

function getCommandId(project: Project) {
  return project.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export default function ProjectFlagshipShowcase({ projects }: ProjectFlagshipShowcaseProps) {
  const [activeId, setActiveId] = React.useState(projects[0]?.id);
  const activeProject = projects.find((project) => project.id === activeId) ?? projects[0];
  const profile = getInspectorProfile(activeProject);

  return (
    <div className="project-showcase-console">
      <div className="project-command-deck" aria-label="Project inspect commands">
        <span className="project-command-label">inspect</span>
        {projects.map((project) => (
          <button
            key={project.id}
            type="button"
            data-project-command={getCommandId(project)}
            className={project.id === activeProject.id ? 'is-active' : undefined}
            onClick={() => setActiveId(project.id)}
            style={{ '--project-accent': project.accent ?? '#e8915b' } as React.CSSProperties}
          >
            {project.title.replace(': Sydney Layers', '').replace(' Prompt Enhancer', '')}
          </button>
        ))}
      </div>

      <div className="project-showcase-layout">
        <div className="grid gap-5 lg:grid-cols-6">
          {projects.map((project, i) => (
            <ProjectHighlightCard
              key={project.id}
              project={project}
              index={i}
              active={project.id === activeProject.id}
              onActivate={(nextProject) => setActiveId(nextProject.id)}
            />
          ))}
        </div>

        <aside
          className="project-inspector"
          style={{ '--project-accent': activeProject.accent ?? '#e8915b' } as React.CSSProperties}
          aria-live="polite"
        >
          <div className="project-inspector-header">
            <span>Project Inspector</span>
            <strong>{profile.mode}</strong>
          </div>

          <div className="project-inspector-title">
            <span>{String(projects.findIndex((project) => project.id === activeProject.id) + 1).padStart(2, '0')}</span>
            <h3>{activeProject.title}</h3>
          </div>

          <p>{profile.thesis}</p>

          <div className="project-inspector-signal">
            <span>signal</span>
            <strong>{profile.signal}</strong>
          </div>

          <div className="project-inspector-metrics">
            {(activeProject.metrics ?? []).map((metric) => (
              <div key={`${activeProject.id}-${metric.label}`}>
                <strong>{metric.value}</strong>
                <span>{metric.label}</span>
              </div>
            ))}
          </div>

          <div className="project-inspector-stack">
            <span>stack</span>
            <div>
              {activeProject.technologies.slice(0, 6).map((tech) => (
                <code key={`${activeProject.id}-inspect-${tech}`}>{tech}</code>
              ))}
            </div>
          </div>

          <div className="project-inspector-angle">
            <span>why it matters</span>
            <p>{profile.angle}</p>
          </div>
        </aside>
      </div>
    </div>
  );
}
