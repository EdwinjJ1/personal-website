'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import PageTransition from '@/components/PageTransition';
import ClientOnlyParticles from '@/components/ClientOnlyParticles';
import Avatar from '@/components/Avatar';

const recentPosts = [
  {
    title: "Building AI-Powered Personal Assistants",
    excerpt: "Exploring Claude MCP servers and how they revolutionize productivity workflows...",
    date: "2024-03-15",
    readTime: "5 min read",
    tags: ["AI", "Productivity"]
  },
  {
    title: "From Startup to Student: My Journey",
    excerpt: "Lessons learned from founding a startup at 18 and transitioning to university...",
    date: "2024-02-28",
    readTime: "8 min read",
    tags: ["Entrepreneurship", "Personal"]
  },
  {
    title: "Next.js 15 and React Development",
    excerpt: "Deep dive into the latest features and developer experience improvements...",
    date: "2024-02-10",
    readTime: "6 min read",
    tags: ["React", "Web Dev"]
  }
];

const featuredProjects = [
  {
    title: "UNSW Study Materials",
    description: "Interactive educational platform for CS students with bilingual content and visualizations.",
    technologies: ["JavaScript", "Chart.js", "Tailwind"],
    status: "Live",
    link: "http://www.preuni.xyz/"
  },
  {
    title: "AI Personal Assistant",
    description: "Claude MCP-based system with specialized agents for productivity and automation.",
    technologies: ["Node.js", "Claude MCP", "TypeScript"],
    status: "In Development",
    link: "/projects"
  }
];

const skills = [
  {
    category: "Languages",
    items: ["TypeScript", "JavaScript", "Python", "Java", "SQL"]
  },
  {
    category: "Frontend",
    items: ["React", "Next.js", "Vue.js", "Tailwind CSS"]
  },
  {
    category: "Backend",
    items: ["Node.js", "Firebase", "AWS", "Docker"]
  },
  {
    category: "AI & Tools",
    items: ["Claude MCP", "TensorFlow", "Git", "Cursor"]
  }
];

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

export default function Home() {
  return (
    <PageTransition>
      <div className="min-h-screen bg-gray-900 text-white">
        <ClientOnlyParticles />
        
        {/* Hero Section - Upper Half */}
        <section className="relative z-10 min-h-screen flex items-center justify-center pt-20 pb-12">
          <motion.div
            className="container mx-auto px-6 text-center"
            variants={container}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={item} className="mb-8">
              <Avatar size="md" />
            </motion.div>

            <motion.h1
              variants={item}
              className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent"
            >
              Evan Lin
            </motion.h1>

            <motion.p
              variants={item}
              className="text-xl md:text-2xl text-gray-400 mb-4"
            >
              Computer Science Student & Entrepreneur
            </motion.p>

            <motion.p
              variants={item}
              className="text-lg text-gray-500 mb-8"
            >
              Sydney, Australia 🇦🇺
            </motion.p>

            <motion.div variants={item} className="max-w-3xl mx-auto mb-12">
              <p className="text-lg text-gray-300 leading-relaxed">
                I'm a 19-year-old CS student at UNSW Sydney with a passion for AI and innovation. 
                Former startup founder turned student, I'm dedicated to building technology that makes a meaningful impact. 
                Always exploring new possibilities at the intersection of artificial intelligence and human potential.
              </p>
            </motion.div>

            <motion.div variants={item}>
              <a
                href="#projects"
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-semibold rounded-full hover:from-teal-600 hover:to-cyan-600 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl mr-4 mb-4"
              >
                View My Work
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </a>
              <Link
                href="/about"
                className="inline-flex items-center px-8 py-4 border border-teal-500 text-teal-400 font-semibold rounded-full hover:bg-teal-500 hover:text-white transform hover:scale-105 transition-all duration-300 mb-4"
              >
                Learn More About Me
              </Link>
            </motion.div>
          </motion.div>
        </section>

        {/* Projects Section */}
        <section id="projects" className="relative z-10 py-20 bg-gray-800">
          <div className="container mx-auto px-6">
            <motion.div
              variants={container}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              className="max-w-6xl mx-auto"
            >
              <motion.div variants={item} className="text-center mb-16">
                <h2 className="text-4xl font-bold mb-6 text-white">Featured Projects</h2>
                <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                  A selection of my recent work spanning education, AI automation, and web development.
                </p>
              </motion.div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                {featuredProjects.map((project, index) => (
                  <motion.div
                    key={index}
                    variants={item}
                    className="bg-gray-900 rounded-xl p-6 border border-gray-700 hover:border-teal-500 transition-all duration-300 group cursor-pointer"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <span className={`px-3 py-1 text-xs rounded-full ${
                        project.status === 'Live' ? 'bg-green-900/30 text-green-300 border border-green-500/30' :
                        project.status === 'In Development' ? 'bg-yellow-900/30 text-yellow-300 border border-yellow-500/30' :
                        'bg-blue-900/30 text-blue-300 border border-blue-500/30'
                      }`}>
                        {project.status}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold mb-3 text-white group-hover:text-teal-300 transition-colors">
                      {project.title}
                    </h3>

                    <p className="text-gray-400 mb-4 text-sm">
                      {project.description}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.technologies.map((tech) => (
                        <span
                          key={tech}
                          className="px-2 py-1 bg-teal-900/30 text-teal-300 text-xs rounded border border-teal-500/30"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    {project.link.startsWith('http') ? (
                      <a
                        href={project.link}
                        className="text-teal-400 hover:text-teal-300 text-sm font-medium inline-flex items-center"
                      >
                        {project.status === 'Live' ? 'View Live' : 'Learn More'}
                        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </a>
                    ) : (
                      <Link
                        href={project.link}
                        className="text-teal-400 hover:text-teal-300 text-sm font-medium inline-flex items-center"
                      >
                        {project.status === 'Live' ? 'View Live' : 'Learn More'}
                        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    )}
                  </motion.div>
                ))}
              </div>

              <motion.div variants={item} className="text-center">
                <Link
                  href="/projects"
                  className="inline-flex items-center px-6 py-3 border border-teal-500 text-teal-400 font-semibold rounded-lg hover:bg-teal-500 hover:text-white transition-all duration-300"
                >
                  View All Projects
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Skills Section */}
        <section className="relative z-10 py-20 bg-gray-900">
          <div className="container mx-auto px-6">
            <motion.div
              variants={container}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              className="max-w-6xl mx-auto"
            >
              <motion.div variants={item} className="text-center mb-16">
                <h2 className="text-4xl font-bold mb-6 text-white">Skills & Technologies</h2>
                <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                  The tools and technologies I use to bring ideas to life.
                </p>
              </motion.div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {skills.map((skillGroup, index) => (
                  <motion.div
                    key={index}
                    variants={item}
                    className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-teal-500 transition-all duration-300"
                  >
                    <h3 className="text-lg font-bold mb-4 text-teal-300">{skillGroup.category}</h3>
                    <div className="flex flex-wrap gap-2">
                      {skillGroup.items.map((skill) => (
                        <span
                          key={skill}
                          className="px-3 py-1 bg-teal-900/30 text-teal-300 text-sm rounded-full border border-teal-500/30 hover:bg-teal-900/50 transition-colors"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Education Section */}
        <section className="relative z-10 py-20 bg-gray-800">
          <div className="container mx-auto px-6">
            <motion.div
              variants={container}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              className="max-w-4xl mx-auto"
            >
              <motion.div variants={item} className="text-center mb-16">
                <h2 className="text-4xl font-bold mb-6 text-white">Education & Experience</h2>
                <p className="text-xl text-gray-400">
                  My academic journey and entrepreneurial experience.
                </p>
              </motion.div>

              <div className="space-y-8">
                <motion.div variants={item} className="bg-gray-900 rounded-xl p-8 border border-gray-700">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-4">
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-2">University of New South Wales</h3>
                      <h4 className="text-lg font-semibold text-teal-400 mb-2">Bachelor of Computer Science</h4>
                      <p className="text-gray-400">Specializing in Artificial Intelligence and Software Engineering</p>
                    </div>
                    <div className="mt-4 md:mt-0 md:text-right">
                      <span className="inline-block bg-teal-900/30 text-teal-300 px-3 py-1 rounded-full text-sm border border-teal-500/30">
                        2025 - 2028
                      </span>
                      <p className="text-gray-500 text-sm mt-2">📍 Sydney, Australia</p>
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h5 className="font-semibold text-gray-300 mb-2">Achievements:</h5>
                      <ul className="text-gray-400 text-sm space-y-1">
                        <li>• Dean's List for Academic Excellence</li>
                        <li>• Member of UNSW Tech Society</li>
                        <li>• UNSW Startup Program Participant</li>
                      </ul>
                    </div>
                    <div>
                      <h5 className="font-semibold text-gray-300 mb-2">Focus Areas:</h5>
                      <ul className="text-gray-400 text-sm space-y-1">
                        <li>• Artificial Intelligence & Machine Learning</li>
                        <li>• Software Engineering & Architecture</li>
                        <li>• Data Structures & Algorithms</li>
                      </ul>
                    </div>
                  </div>
                </motion.div>

                <motion.div variants={item} className="bg-gray-900 rounded-xl p-8 border border-gray-700">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-4">
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-2">Tech Startup</h3>
                      <h4 className="text-lg font-semibold text-teal-400 mb-2">Founder & CEO</h4>
                      <p className="text-gray-400">Led a technology startup focused on AI-powered solutions</p>
                    </div>
                    <div className="mt-4 md:mt-0 md:text-right">
                      <span className="inline-block bg-blue-900/30 text-blue-300 px-3 py-1 rounded-full text-sm border border-blue-500/30">
                        2023 - 2024
                      </span>
                      <p className="text-gray-500 text-sm mt-2">📍 Sydney, Australia</p>
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h5 className="font-semibold text-gray-300 mb-2">Key Results:</h5>
                      <ul className="text-gray-400 text-sm space-y-1">
                        <li>• 1000+ active users achieved</li>
                        <li>• Successfully raised seed funding</li>
                        <li>• Built team of 8 professionals</li>
                      </ul>
                    </div>
                    <div>
                      <h5 className="font-semibold text-gray-300 mb-2">Skills Developed:</h5>
                      <ul className="text-gray-400 text-sm space-y-1">
                        <li>• Leadership & team management</li>
                        <li>• Product development & strategy</li>
                        <li>• Business operations & funding</li>
                      </ul>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Recent Posts Section */}
        <section className="relative z-10 py-20 bg-gray-900">
          <div className="container mx-auto px-6">
            <motion.div
              variants={container}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              className="max-w-6xl mx-auto"
            >
              <motion.div variants={item} className="text-center mb-16">
                <h2 className="text-4xl font-bold mb-6 text-white">Recent Posts</h2>
                <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                  Thoughts on technology, entrepreneurship, and personal growth.
                </p>
              </motion.div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                {recentPosts.map((post, index) => (
                  <motion.div
                    key={index}
                    variants={item}
                    className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-teal-500 transition-all duration-300 group cursor-pointer"
                  >
                    <div className="flex flex-wrap gap-2 mb-4">
                      {post.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-3 py-1 bg-teal-900/30 text-teal-300 text-sm rounded-full border border-teal-500/30"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <h3 className="text-xl font-bold mb-3 text-white group-hover:text-teal-300 transition-colors">
                      {post.title}
                    </h3>

                    <p className="text-gray-400 mb-4 text-sm">
                      {post.excerpt}
                    </p>

                    <div className="flex justify-between items-center text-sm text-gray-500">
                      <time dateTime={post.date}>
                        {new Date(post.date).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </time>
                      <span>{post.readTime}</span>
                    </div>
                  </motion.div>
                ))}
              </div>

              <motion.div variants={item} className="text-center">
                <Link
                  href="/blog"
                  className="inline-flex items-center px-6 py-3 border border-teal-500 text-teal-400 font-semibold rounded-lg hover:bg-teal-500 hover:text-white transition-all duration-300"
                >
                  Read All Posts
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative z-10 py-20 bg-gray-800">
          <div className="container mx-auto px-6">
            <motion.div
              variants={container}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              className="max-w-4xl mx-auto text-center"
            >
              <motion.h2 variants={item} className="text-4xl font-bold mb-6 text-white">
                Let's Build Something Amazing Together
              </motion.h2>
              <motion.p variants={item} className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
                I'm always interested in new opportunities, collaborations, and conversations 
                about technology and innovation. Let's connect!
              </motion.p>
              <motion.div variants={item} className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/about"
                  className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-semibold rounded-full hover:from-teal-600 hover:to-cyan-600 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  Get In Touch
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </Link>
                <Link
                  href="/blog"
                  className="inline-flex items-center px-8 py-4 border border-teal-500 text-teal-400 font-semibold rounded-full hover:bg-teal-500 hover:text-white transition-all duration-300"
                >
                  Read My Blog
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </section>
      </div>
    </PageTransition>
  );
}
