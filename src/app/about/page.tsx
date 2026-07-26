'use client';

import React from 'react';
import { motion } from 'framer-motion';
import PageTransition from '@/components/PageTransition';
import GradientText from '@/components/GradientText';
import AICardPanel from '@/components/AICardPanel';

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
      "Dean's List for Academic Excellence",
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
    description: "Fascinated by AI's potential to enhance human capabilities and solve complex problems.",
    icon: "🤖"
  },
  {
    title: "Entrepreneurship",
    description: "Passionate about building products that make a meaningful impact on people's lives.",
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
      <div className="min-h-screen pt-20" style={{ color: 'rgb(var(--p-ink))' }}>
        <div className="container mx-auto px-6 py-12">
          <motion.div
            variants={container}
            initial="hidden"
            animate="visible"
            className="max-w-6xl mx-auto"
          >
            {/* Header */}
            <motion.div variants={item} className="text-center mb-16">
              <p className="type-eyebrow mb-3">Who I am</p>
              <h1 className="type-h1 mb-6">
                <GradientText
                  colors={['rgb(var(--p-sage))', 'rgb(var(--p-teal))', 'rgb(var(--p-sage))', 'rgb(var(--p-teal))', 'rgb(var(--p-sage))']}
                  animationSpeed={6}
                  showBorder={false}
                >
                  About Me
                </GradientText>
              </h1>
              <p className="text-xl max-w-3xl mx-auto" style={{ color: 'rgb(var(--p-ink-mid))' }}>
                A passionate Computer Science student, former startup founder, and aspiring technologist
                dedicated to building innovative solutions and making a positive impact through technology.
              </p>
            </motion.div>

            {/* Hand me to an AI */}
            <motion.div variants={item} className="mb-16 max-w-2xl mx-auto">
              <AICardPanel />
            </motion.div>

            {/* Personal Introduction */}
            <motion.div variants={item} className="mb-20">
              <div className="grid lg:grid-cols-3 gap-12 items-start">
                <div className="lg:col-span-2 space-y-6">
                  <div>
                    <h2 className="text-3xl font-bold mb-6" style={{ color: 'rgb(var(--p-ink))' }}>
                      My Journey
                    </h2>
                    <div className="space-y-4 leading-relaxed" style={{ color: 'rgb(var(--p-ink-mid))' }}>
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
                  <div className="rounded-xl p-6 border" style={{ background: 'linear-gradient(to bottom right, rgb(var(--p-surface-3) / 0.6), rgb(var(--p-surface-2) / 0.5), rgb(var(--p-surface-3) / 0.6))', borderColor: 'rgb(var(--p-line) / 0.3)' }}>
                    <h3 className="text-xl font-bold mb-4" style={{ color: 'rgb(var(--p-sage))' }}>
                      Quick Facts
                    </h3>
                    <ul className="space-y-3" style={{ color: 'rgb(var(--p-ink-mid))' }}>
                      <li className="flex items-center">
                        <span className="w-2 h-2 rounded-full mr-3" style={{ backgroundColor: 'rgb(var(--p-sage))' }}></span>
                        19 years old, based in Sydney
                      </li>
                      <li className="flex items-center">
                        <span className="w-2 h-2 rounded-full mr-3" style={{ backgroundColor: 'rgb(var(--p-sage))' }}></span>
                        CS student at UNSW (2025-2028)
                      </li>
                      <li className="flex items-center">
                        <span className="w-2 h-2 rounded-full mr-3" style={{ backgroundColor: 'rgb(var(--p-sage))' }}></span>
                        Former startup founder & CEO
                      </li>
                      <li className="flex items-center">
                        <span className="w-2 h-2 rounded-full mr-3" style={{ backgroundColor: 'rgb(var(--p-sage))' }}></span>
                        ENTJ personality type
                      </li>
                      <li className="flex items-center">
                        <span className="w-2 h-2 rounded-full mr-3" style={{ backgroundColor: 'rgb(var(--p-sage))' }}></span>
                        Fluent in English & Chinese
                      </li>
                    </ul>
                  </div>

                  <div className="rounded-xl p-6 border" style={{ background: 'linear-gradient(to bottom right, rgb(var(--p-surface-3) / 0.6), rgb(var(--p-surface-2) / 0.5), rgb(var(--p-surface-3) / 0.6))', borderColor: 'rgb(var(--p-line) / 0.3)' }}>
                    <h3 className="text-xl font-bold mb-4" style={{ color: 'rgb(var(--p-sage))' }}>
                      Contact
                    </h3>
                    <div className="space-y-3">
                      <a href="mailto:jiaedwin0605@gmail.com" className="flex items-center transition-colors" style={{ color: 'rgb(var(--p-ink-mid))' }}>
                        <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        Email
                      </a>
                      <a href="https://github.com/EdwinjJ1" target="_blank" rel="noopener noreferrer" className="flex items-center transition-colors" style={{ color: 'rgb(var(--p-ink-mid))' }}>
                        <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                        </svg>
                        GitHub
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Timeline */}
            <motion.div variants={item} className="mb-20">
              <h2 className="text-3xl font-bold mb-12 text-center" style={{ color: 'rgb(var(--p-ink))' }}>
                My Timeline
              </h2>
              <div className="relative">
                <div className="absolute left-1/2 transform -translate-x-1/2 w-0.5 h-full" style={{ background: 'linear-gradient(to bottom, rgb(var(--p-sage)), rgb(var(--p-teal)))' }}></div>
                <div className="space-y-12">
                  {timeline.map((event, index) => (
                    <motion.div
                      key={index}
                      variants={item}
                      className={`flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}
                    >
                      <div className={`w-1/2 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8 text-left'}`}>
                        <div className="rounded-xl p-6 border" style={{ background: 'linear-gradient(to bottom right, rgb(var(--p-surface-3) / 0.6), rgb(var(--p-surface-2) / 0.5), rgb(var(--p-surface-3) / 0.6))', borderColor: 'rgb(var(--p-line) / 0.3)' }}>
                          <div className="flex items-center mb-2">
                            <span className={`text-2xl mr-2 ${event.type === 'education' ? '🎓' : event.type === 'experience' ? '💼' : '📚'}`}>
                              {event.type === 'education' ? '🎓' : event.type === 'experience' ? '💼' : '📚'}
                            </span>
                            <span className="font-bold" style={{ color: 'rgb(var(--p-sage))' }}>{event.year}</span>
                          </div>
                          <h3 className="text-xl font-bold mb-1" style={{ color: 'rgb(var(--p-ink))' }}>
                            {event.title}
                          </h3>
                          <h4 className="font-semibold mb-2" style={{ color: 'rgb(var(--p-sage))' }}>{event.organization}</h4>
                          <p className="text-sm mb-3" style={{ color: 'rgb(var(--p-ink-mid))' }}>📍 {event.location}</p>
                          <p className="mb-4" style={{ color: 'rgb(var(--p-ink-mid))' }}>{event.description}</p>
                          <ul className="text-sm space-y-1" style={{ color: 'rgb(var(--p-ink-mid))' }}>
                            {event.highlights.map((highlight, hIndex) => (
                              <li key={hIndex} className="flex items-start">
                                <span className="w-1.5 h-1.5 rounded-full mt-2 mr-2 flex-shrink-0" style={{ backgroundColor: 'rgb(var(--p-sage))' }}></span>
                                {highlight}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                      <div className="relative flex items-center justify-center w-8 h-8 rounded-full border-4 z-10" style={{ backgroundColor: 'rgb(var(--p-sage))', borderColor: 'rgb(var(--p-surface-1))' }}>
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: 'rgb(var(--p-ink))' }}></div>
                      </div>
                      <div className="w-1/2"></div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Skills */}
            <motion.div variants={item} className="mb-20">
              <h2 className="text-3xl font-bold mb-12 text-center" style={{ color: 'rgb(var(--p-ink))' }}>
                Skills &amp; Technologies
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {skills.map((skillGroup, index) => (
                  <motion.div
                    key={index}
                    variants={item}
                    className="rounded-xl p-6 border transition-all duration-300"
                    style={{ background: 'linear-gradient(to bottom right, rgb(var(--p-surface-3) / 0.6), rgb(var(--p-surface-2) / 0.5), rgb(var(--p-surface-3) / 0.6))', borderColor: 'rgb(var(--p-line) / 0.3)' }}
                  >
                    <h3 className="text-xl font-bold mb-4" style={{ color: 'rgb(var(--p-sage))' }}>
                      {skillGroup.category}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {skillGroup.items.map((skill) => (
                        <span
                          key={skill}
                          className="px-3 py-1 text-sm rounded-full border transition-colors"
                          style={{ backgroundColor: 'rgb(var(--p-sage) / 0.15)', color: 'rgb(var(--p-sage))', borderColor: 'rgb(var(--p-sage) / 0.3)' }}
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
              <h2 className="text-3xl font-bold mb-12 text-center" style={{ color: 'rgb(var(--p-ink))' }}>
                Interests &amp; Passions
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {interests.map((interest, index) => (
                  <motion.div
                    key={index}
                    variants={item}
                    className="rounded-xl p-6 border transition-all duration-300 text-center"
                    style={{ background: 'linear-gradient(to bottom right, rgb(var(--p-surface-3) / 0.6), rgb(var(--p-surface-2) / 0.5), rgb(var(--p-surface-3) / 0.6))', borderColor: 'rgb(var(--p-line) / 0.3)' }}
                  >
                    <div className="text-4xl mb-4">{interest.icon}</div>
                    <h3 className="text-lg font-bold mb-3" style={{ color: 'rgb(var(--p-ink))' }}>
                      {interest.title}
                    </h3>
                    <p className="text-sm" style={{ color: 'rgb(var(--p-ink-mid))' }}>{interest.description}</p>
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
