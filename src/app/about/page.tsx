'use client';

import React from 'react';
import { motion } from 'framer-motion';
import PageTransition from '@/components/PageTransition';

const skills = [
  {
    category: "Programming Languages",
    items: ["TypeScript", "JavaScript", "Python", "Java", "SQL"]
  },
  {
    category: "Frontend Technologies",
    items: ["React", "Next.js", "Vue.js", "Tailwind CSS", "Framer Motion"]
  },
  {
    category: "Backend & Cloud",
    items: ["Node.js", "Express", "Firebase", "AWS", "Vercel", "Docker"]
  },
  {
    category: "AI & Machine Learning",
    items: ["TensorFlow", "PyTorch", "Claude MCP", "Scikit-learn", "Pandas"]
  },
  {
    category: "Tools & Workflow",
    items: ["Git", "Docker", "Jest", "Postman", "Cursor", "ESLint/Prettier"]
  }
];

const timeline = [
  {
    year: "2025 - Present",
    title: "Computer Science Student",
    organization: "University of New South Wales (UNSW)",
    location: "Sydney, Australia",
    description: "Specializing in Artificial Intelligence and Software Engineering. Maintaining high academic performance while actively participating in tech societies and startup programs.",
    highlights: [
      "Dean&apos;s List for Academic Excellence",
      "Active member of UNSW Tech Society",
      "Participant in UNSW Startup Incubator Program"
    ],
    type: "education"
  },
  {
    year: "2023 - 2024",
    title: "Founder & CEO",
    organization: "Tech Startup",
    location: "Sydney, Australia",
    description: "Founded and led a technology startup focused on AI-powered productivity solutions. Successfully built a team, raised funding, and developed an MVP that reached 1000+ active users.",
    highlights: [
      "Raised seed funding from angel investors",
      "Built and managed a team of 8 professionals",
      "Developed MVP with 1000+ active users",
      "Gained experience in product development, team leadership, and business strategy"
    ],
    type: "experience"
  },
  {
    year: "2021 - 2022",
    title: "Self-Taught Developer",
    organization: "Independent Learning",
    location: "Sydney, Australia",
    description: "Dedicated period of intensive self-learning in programming and technology. Completed multiple online courses, built personal projects, and prepared for university studies.",
    highlights: [
      "Mastered JavaScript, Python, and web development fundamentals",
      "Built first web applications and projects",
      "Completed comprehensive online courses in CS fundamentals",
      "Developed passion for AI and machine learning"
    ],
    type: "learning"
  }
];

const interests = [
  {
    title: "Artificial Intelligence",
    description: "Fascinated by AI&apos;s potential to enhance human capabilities and solve complex problems.",
    icon: "🤖"
  },
  {
    title: "Entrepreneurship",
    description: "Passionate about building products that make a meaningful impact on people&apos;s lives.",
    icon: "🚀"
  },
  {
    title: "Technology Innovation",
    description: "Always exploring the latest tech trends and their practical applications.",
    icon: "💡"
  },
  {
    title: "Productivity Systems",
    description: "Interested in optimizing workflows and building tools for personal effectiveness.",
    icon: "⚡"
  },
  {
    title: "Photography",
    description: "Capturing moments and exploring the world through the lens of a camera.",
    icon: "📸"
  },
  {
    title: "Music",
    description: "Playing harmonica and appreciating various genres of music for relaxation.",
    icon: "🎵"
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

export default function AboutPage() {
  return (
    <PageTransition>
      <div className="min-h-screen bg-gray-900 text-white pt-20">
        <div className="container mx-auto px-6 py-12">
          <motion.div
            variants={container}
            initial="hidden"
            animate="visible"
            className="max-w-6xl mx-auto"
          >
            {/* Header */}
            <motion.div variants={item} className="text-center mb-16">
              <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent">
                About Me
              </h1>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                A passionate Computer Science student, former startup founder, and aspiring technologist 
                dedicated to building innovative solutions and making a positive impact through technology.
              </p>
            </motion.div>

            {/* Personal Introduction */}
            <motion.div variants={item} className="mb-20">
              <div className="grid lg:grid-cols-3 gap-12 items-start">
                <div className="lg:col-span-2 space-y-6">
                  <div>
                    <h2 className="text-3xl font-bold mb-6 text-white">My Journey</h2>
                    <div className="space-y-4 text-gray-300 leading-relaxed">
                      <p>
                        At 19, I&apos;m a Computer Science student at UNSW Sydney with an unconventional background that combines 
                        academic excellence with real-world entrepreneurial experience. My journey into technology began with 
                        curiosity and has evolved into a deep passion for artificial intelligence and innovation.
                      </p>
                      <p>
                        Before starting university, I founded and led a technology startup, an experience that taught me 
                        invaluable lessons about leadership, product development, and the challenges of building something 
                        from scratch. Despite the demands of running a company, I successfully transitioned to academic life, 
                        maintaining high performance while pursuing my passion for computer science.
                      </p>
                      <p>
                        Today, I&apos;m focused on mastering the fundamentals of AI and software engineering while exploring 
                        how technology can enhance human productivity and solve meaningful problems. My goal is to become 
                        an influential figure in the tech industry, contributing to innovations that drive positive change.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                    <h3 className="text-xl font-bold mb-4 text-teal-300">Quick Facts</h3>
                    <ul className="space-y-3 text-gray-300">
                      <li className="flex items-center">
                        <span className="w-2 h-2 bg-teal-400 rounded-full mr-3"></span>
                        19 years old, based in Sydney
                      </li>
                      <li className="flex items-center">
                        <span className="w-2 h-2 bg-teal-400 rounded-full mr-3"></span>
                        CS student at UNSW (2025-2028)
                      </li>
                      <li className="flex items-center">
                        <span className="w-2 h-2 bg-teal-400 rounded-full mr-3"></span>
                        Former startup founder & CEO
                      </li>
                      <li className="flex items-center">
                        <span className="w-2 h-2 bg-teal-400 rounded-full mr-3"></span>
                        ENTJ personality type
                      </li>
                      <li className="flex items-center">
                        <span className="w-2 h-2 bg-teal-400 rounded-full mr-3"></span>
                        Fluent in English & Chinese
                      </li>
                    </ul>
                  </div>

                  <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                    <h3 className="text-xl font-bold mb-4 text-teal-300">Contact</h3>
                    <div className="space-y-3">
                      <a href="mailto:jiaedwin0605@gmail.com" className="flex items-center text-gray-300 hover:text-teal-300 transition-colors">
                        <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        Email
                      </a>
                      <a href="https://github.com/EdwinJia1" target="_blank" rel="noopener noreferrer" className="flex items-center text-gray-300 hover:text-teal-300 transition-colors">
                        <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                        </svg>
                        GitHub
                      </a>
                      <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="flex items-center text-gray-300 hover:text-teal-300 transition-colors">
                        <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                        </svg>
                        LinkedIn
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Timeline */}
            <motion.div variants={item} className="mb-20">
              <h2 className="text-3xl font-bold mb-12 text-white text-center">My Timeline</h2>
              <div className="relative">
                <div className="absolute left-1/2 transform -translate-x-1/2 w-0.5 h-full bg-gradient-to-b from-teal-400 to-cyan-400"></div>
                <div className="space-y-12">
                  {timeline.map((event, index) => (
                    <motion.div
                      key={index}
                      variants={item}
                      className={`flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}
                    >
                      <div className={`w-1/2 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8 text-left'}`}>
                        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                          <div className="flex items-center mb-2">
                            <span className={`text-2xl mr-2 ${event.type === 'education' ? '🎓' : event.type === 'experience' ? '💼' : '📚'}`}>
                              {event.type === 'education' ? '🎓' : event.type === 'experience' ? '💼' : '📚'}
                            </span>
                            <span className="text-teal-300 font-bold">{event.year}</span>
                          </div>
                          <h3 className="text-xl font-bold text-white mb-1">{event.title}</h3>
                          <h4 className="text-teal-400 font-semibold mb-2">{event.organization}</h4>
                          <p className="text-gray-400 text-sm mb-3">📍 {event.location}</p>
                          <p className="text-gray-300 mb-4">{event.description}</p>
                          <ul className="text-sm text-gray-400 space-y-1">
                            {event.highlights.map((highlight, hIndex) => (
                              <li key={hIndex} className="flex items-start">
                                <span className="w-1.5 h-1.5 bg-teal-400 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                                {highlight}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                      <div className="relative flex items-center justify-center w-8 h-8 bg-teal-500 rounded-full border-4 border-gray-900 z-10">
                        <div className="w-3 h-3 bg-white rounded-full"></div>
                      </div>
                      <div className="w-1/2"></div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Skills */}
            <motion.div variants={item} className="mb-20">
              <h2 className="text-3xl font-bold mb-12 text-white text-center">Skills & Technologies</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {skills.map((skillGroup, index) => (
                  <motion.div
                    key={index}
                    variants={item}
                    className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-teal-500 transition-all duration-300"
                  >
                    <h3 className="text-xl font-bold mb-4 text-teal-300">{skillGroup.category}</h3>
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

            {/* Interests */}
            <motion.div variants={item}>
              <h2 className="text-3xl font-bold mb-12 text-white text-center">Interests & Passions</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {interests.map((interest, index) => (
                  <motion.div
                    key={index}
                    variants={item}
                    className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-teal-500 transition-all duration-300 text-center"
                  >
                    <div className="text-4xl mb-4">{interest.icon}</div>
                    <h3 className="text-lg font-bold text-white mb-3">{interest.title}</h3>
                    <p className="text-gray-400 text-sm">{interest.description}</p>
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
