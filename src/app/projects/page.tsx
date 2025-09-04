'use client';

import React from 'react';
import { motion } from 'framer-motion';
import PageTransition from '@/components/PageTransition';

const projects = [
  {
    id: 1,
    title: "UNSW Study Materials Platform",
    description: "Interactive study notes and resources for UNSW Computer Science students, featuring bilingual content, data visualizations, and comprehensive course materials.",
    longDescription: "A comprehensive educational platform designed specifically for UNSW Computer Science students. Features include interactive code examples, bilingual content support (English/Chinese), dynamic data visualizations using Chart.js and Plotly.js, and responsive design optimized for both desktop and mobile learning. An optional payments/donation module (Stripe) was previously integrated for select premium resources.",
    technologies: ["HTML", "CSS", "JavaScript", "Tailwind CSS", "Chart.js", "Plotly.js", "Stripe"],
    category: "Education",
    featured: true,
    status: "Live",
    liveUrl: "http://www.preuni.xyz/",
    githubUrl: "#",
    imageUrl: "/api/placeholder/600/400",
    highlights: [
      "Interactive code examples and tutorials",
      "Bilingual content support",
      "Dynamic data visualizations",
      "Mobile-responsive design",
      "Comprehensive course coverage",
      "Optional payments/donation module (Stripe) integration"
    ]
  },
  {
    id: 2,
    title: "AI Personal Assistant System",
    description: "Claude MCP-based personal productivity system with multiple specialized AI agents for daily planning, news curation, and reflection.",
    longDescription: "A sophisticated AI-powered personal assistant system built using Claude MCP servers. Features five specialized agents: daily planner, AI news curator, daily report generator, reflection coach, and health coach. Integrates with Notion API and Google Calendar for seamless workflow automation.",
    technologies: ["Node.js", "Claude MCP", "Notion API", "Google APIs", "TypeScript", "Jest"],
    category: "AI & Automation",
    featured: true,
    status: "In Development",
    githubUrl: "#",
    imageUrl: "/api/placeholder/600/400",
    highlights: [
      "5 specialized AI agents",
      "Notion and Google Calendar integration",
      "Automated workflow management",
      "Time-based trigger system",
      "Comprehensive logging and monitoring"
    ]
  },
  {
    id: 3,
    title: "Machine Learning Portfolio",
    description: "Collection of ML projects exploring various algorithms, from computer vision to natural language processing.",
    longDescription: "A comprehensive portfolio of machine learning projects showcasing different algorithms and applications. Includes image classification models, sentiment analysis systems, recommendation engines, and time series forecasting models built with TensorFlow and PyTorch.",
    technologies: ["Python", "TensorFlow", "PyTorch", "Scikit-learn", "Pandas", "NumPy", "Jupyter"],
    category: "Machine Learning",
    featured: false,
    status: "Ongoing",
    githubUrl: "#",
    imageUrl: "/api/placeholder/600/400",
    highlights: [
      "Computer vision applications",
      "NLP sentiment analysis",
      "Recommendation systems",
      "Time series forecasting",
      "Model deployment strategies"
    ]
  },
  {
    id: 5,
    title: "Personal Portfolio Website",
    description: "Modern, responsive portfolio website built with Next.js, featuring dark theme, smooth animations, and optimized performance.",
    longDescription: "This very website - a modern personal portfolio showcasing my projects, skills, and blog. Built with Next.js 15, featuring Framer Motion animations, Tailwind CSS styling, and optimized for performance and accessibility.",
    technologies: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Framer Motion"],
    category: "Web Development",
    featured: false,
    status: "Live",
    githubUrl: "#",
    imageUrl: "/api/placeholder/600/400",
    highlights: [
      "Next.js 15 with App Router",
      "Framer Motion animations",
      "Responsive design",
      "Performance optimized",
      "SEO friendly"
    ]
  },
  {
    id: 6,
    title: "Startup MVP - Tech Solution",
    description: "MVP developed during my entrepreneurial journey, featuring user authentication, real-time features, and scalable architecture.",
    longDescription: "The minimum viable product I developed as a startup founder, which grew to 1000+ active users. Features include user authentication, real-time messaging, data analytics dashboard, and microservices architecture designed for scale.",
    technologies: ["React", "Node.js", "MongoDB", "Socket.io", "AWS", "Docker"],
    category: "Entrepreneurship",
    featured: false,
    status: "Archived",
    githubUrl: "#",
    imageUrl: "/api/placeholder/600/400",
    highlights: [
      "1000+ active users achieved",
      "Real-time messaging system",
      "Analytics dashboard",
      "Microservices architecture",
      "AWS deployment"
    ]
  }
];

const categories = ["All", "Education", "AI & Automation", "Web Development", "Machine Learning", "Entrepreneurship"];

const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.6, staggerChildren: 0.1 }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

export default function ProjectsPage() {
  const [selectedCategory, setSelectedCategory] = React.useState("All");
  const [filteredProjects, setFilteredProjects] = React.useState(projects);

  React.useEffect(() => {
    if (selectedCategory === "All") {
      setFilteredProjects(projects);
    } else {
      setFilteredProjects(projects.filter(project => project.category === selectedCategory));
    }
  }, [selectedCategory]);

  const featuredProjects = projects.filter(project => project.featured);

  return (
    <PageTransition>
      <div className="min-h-screen bg-gray-900 text-white pt-20">
        <div className="container mx-auto px-6 py-12">
          <motion.div
            variants={container}
            initial="hidden"
            animate="visible"
            className="max-w-7xl mx-auto"
          >
            {/* Header */}
            <motion.div variants={item} className="text-center mb-16">
              <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent">
                Projects
              </h1>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                A showcase of my technical projects, from educational platforms and AI systems to modern web applications. 
                Each project represents a unique challenge and learning experience.
              </p>
            </motion.div>

            {/* Featured Projects */}
            <motion.div variants={item} className="mb-20">
              <h2 className="text-3xl font-bold mb-8 text-white">Featured Projects</h2>
              <div className="grid lg:grid-cols-2 gap-8">
                {featuredProjects.map((project) => (
                  <motion.div
                    key={project.id}
                    variants={item}
                    className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700 hover:border-teal-500 transition-all duration-300 group"
                  >
                    <div className="aspect-video bg-gradient-to-br from-teal-900/20 to-cyan-900/20 flex items-center justify-center">
                      <div className="text-6xl text-teal-400/30">
                        {project.category === "Education" && "📚"}
                        {project.category === "AI & Automation" && "🤖"}
                        {project.category === "Web Development" && "🌐"}
                        {project.category === "Machine Learning" && "🧠"}
                        {project.category === "Entrepreneurship" && "🚀"}
                      </div>
                    </div>
                    
                    <div className="p-8">
                      <div className="flex justify-between items-start mb-4">
                        <span className="px-3 py-1 bg-teal-900/30 text-teal-300 text-sm rounded-full border border-teal-500/30">
                          {project.category}
                        </span>
                        <span className={`px-3 py-1 text-xs rounded-full ${
                          project.status === 'Live' ? 'bg-green-900/30 text-green-300 border border-green-500/30' :
                          project.status === 'In Development' ? 'bg-yellow-900/30 text-yellow-300 border border-yellow-500/30' :
                          project.status === 'Completed' ? 'bg-blue-900/30 text-blue-300 border border-blue-500/30' :
                          'bg-gray-600/30 text-gray-300 border border-gray-500/30'
                        }`}>
                          {project.status}
                        </span>
                      </div>

                      <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-teal-300 transition-colors">
                        {project.title}
                      </h3>

                      <p className="text-gray-400 mb-6">
                        {project.longDescription}
                      </p>

                      <div className="mb-6">
                        <h4 className="text-sm font-semibold text-gray-300 mb-2">Key Highlights:</h4>
                        <ul className="text-sm text-gray-400 space-y-1">
                          {project.highlights.slice(0, 3).map((highlight, index) => (
                            <li key={index} className="flex items-center">
                              <span className="w-1.5 h-1.5 bg-teal-400 rounded-full mr-2 flex-shrink-0"></span>
                              {highlight}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="flex flex-wrap gap-2 mb-6">
                        {project.technologies.map((tech) => (
                          <span
                            key={tech}
                            className="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>

                      <div className="flex gap-4">
                        {project.liveUrl && (
                          <a
                            href={project.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center px-4 py-2 bg-gradient-to-r from-teal-500 to-cyan-500 text-white text-sm font-medium rounded-lg hover:from-teal-600 hover:to-cyan-600 transition-all duration-300"
                          >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                            Live Demo
                          </a>
                        )}
                        {project.githubUrl && (
                          <a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center px-4 py-2 border border-gray-600 text-gray-300 text-sm font-medium rounded-lg hover:border-teal-500 hover:text-teal-300 transition-all duration-300"
                          >
                            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                            </svg>
                            Code
                          </a>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* All Projects */}
            <motion.div variants={item}>
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold text-white">All Projects</h2>
                
                {/* Category Filter */}
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 ${
                        selectedCategory === category
                          ? 'bg-teal-500 text-white'
                          : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-gray-300'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProjects.map((project) => (
                  <motion.div
                    key={project.id}
                    variants={item}
                    layout
                    className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-teal-500 transition-all duration-300 group"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <span className="px-3 py-1 bg-teal-900/30 text-teal-300 text-sm rounded-full border border-teal-500/30">
                        {project.category}
                      </span>
                      <span className={`px-2 py-1 text-xs rounded ${
                        project.status === 'Live' ? 'bg-green-900/30 text-green-300' :
                        project.status === 'In Development' ? 'bg-yellow-900/30 text-yellow-300' :
                        project.status === 'Completed' ? 'bg-blue-900/30 text-blue-300' :
                        'bg-gray-600/30 text-gray-300'
                      }`}>
                        {project.status}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold mb-3 text-white group-hover:text-teal-300 transition-colors">
                      {project.title}
                    </h3>

                    <p className="text-gray-400 text-sm mb-4 line-clamp-3">
                      {project.description}
                    </p>

                    <div className="flex flex-wrap gap-1 mb-4">
                      {project.technologies.slice(0, 4).map((tech) => (
                        <span
                          key={tech}
                          className="px-2 py-1 bg-gray-700 text-gray-400 text-xs rounded"
                        >
                          {tech}
                        </span>
                      ))}
                      {project.technologies.length > 4 && (
                        <span className="px-2 py-1 bg-gray-700 text-gray-400 text-xs rounded">
                          +{project.technologies.length - 4}
                        </span>
                      )}
                    </div>

                    <div className="flex gap-3 text-sm">
                      {project.liveUrl && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-teal-400 hover:text-teal-300 transition-colors"
                        >
                          Live Demo →
                        </a>
                      )}
                      {project.githubUrl && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-400 hover:text-gray-300 transition-colors"
                        >
                          Code →
                        </a>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
}
