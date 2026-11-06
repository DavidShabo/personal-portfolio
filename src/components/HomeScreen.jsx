import React, { useRef, Suspense, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import SkyboxModel from './SkyboxModel';
import '../App.css';
import { OrbitControls } from '@react-three/drei';
import emailjs from '@emailjs/browser';
import {
  CodeIcon,
  GlobeIcon,
  GearIcon,
  CpuIcon,
  CarIcon,
  LockIcon,
  DinosaurIcon,
  PaletteIcon,
  TerminalIcon,
  MailIcon,
  GithubIcon,
  MapPinIcon,
  GradCapIcon,
  EyeIcon,
  ArrowRightIcon,
  CheckIcon,
  AlertIcon,
  ExternalLinkIcon,
} from './icons';

const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
const CONTACT_EMAIL = 'dvdshabo@gmail.com';

function TopNav({ sectionRefs, activeSection }) {
  const links = ['About', 'Skills', 'Work', 'Projects', 'Contact', 'Resume'];
  const handleScroll = (section) => (e) => {
    e.preventDefault();
    sectionRefs[section]?.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav className="top-nav">
      <ul>
        {links.map((txt) => (
          <li key={txt}>
            <a
              href={`#${txt.toLowerCase()}`}
              className={`nav-link ${activeSection === txt.toLowerCase() ? 'active' : ''}`}
              onClick={handleScroll(txt.toLowerCase())}
            >
              {txt}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

const skills = [
  {
    icon: CodeIcon,
    title: 'Programming Languages',
    items: ['TypeScript', 'Python', 'JavaScript', 'SQL'],
  },
  {
    icon: GlobeIcon,
    title: 'Frontend & Web',
    items: ['React', 'ThreeJS', 'Angular', 'HTML/CSS', 'Next.js', 'Responsive Design'],
  },
  {
    icon: GearIcon,
    title: 'Backend & Tools',
    items: ['Node.js', 'PostgreSQL', 'Docker', 'Git'],
  },
  {
    icon: CpuIcon,
    title: 'AI & Methodologies',
    items: ['Machine Learning', 'Agile Development', 'Problem Solving'],
  },
];

const experience = [
  {
    role: 'Systems Analyst',
    badge: 'Current',
    badgeType: 'current',
    company: 'Magna International',
    period: 'March 2026 – Present',
    duration: 'Full-time',
    overview:
      "Work on the company's MES (Manufacturing Execution System) and develop internal full-stack applications to support manufacturing operations.",
    achievements: [
      'MES System Development',
      'OPC Router Integration',
      'Internal Full-Stack Apps',
      'Ignition SCADA',
    ],
    tech: ['Next.js', 'SQL Server', 'C#', '.NET', 'OPC Router', 'Ignition'],
  },
  {
    role: 'Software Developer',
    badge: 'Completed',
    badgeType: 'completed',
    company: 'Data Solutions Group',
    period: 'Fall 2025',
    duration: '4 months · Intern',
    overview:
      'Developed an internal CRM feature to track and display customer contract renewals while also providing IT support using Azure AD, ServiceNow, and general IT tasks.',
    achievements: [
      'CRM Contract Renewal Dashboard',
      'Database Query Development',
      'Data Cleanup & Standardization',
      'Azure AD & ServiceNow IT Support',
    ],
    tech: ['React', 'TypeScript', 'Next.js', 'PostgreSQL', 'Docker', 'Azure AD', 'ServiceNow'],
  },
  {
    role: 'Full Stack Developer',
    badge: 'Completed',
    badgeType: 'completed',
    company: 'Rocket Studio Innovation',
    period: 'Summer 2024',
    duration: '2 months · Intern',
    overview:
      'Led full-stack development initiatives for a growing tech company, focusing on code quality, performance optimization, and user experience improvements.',
    achievements: [
      'Code Refactoring',
      'Bug Resolution',
      'Performance Optimization',
      'Full-Stack Development',
    ],
    tech: ['React', 'TypeScript', 'Next.js', 'PostgreSQL', 'Docker'],
  },
];

const projects = [
  {
    icon: CarIcon,
    title: 'Multi-Agent RL Traffic System',
    badge: 'Featured',
    badgeType: 'featured',
    description:
      'A multi-agent reinforcement learning system that simulates a driving environment with MetaDrive. Trains coordinated traffic agents with RLlib to navigate, avoid collisions, and optimize flow in a realistic simulated world.',
    tech: ['Python', 'MetaDrive', 'RLlib', 'Reinforcement Learning', 'Multi-Agent Systems'],
    link: 'https://github.com/DavidShabo/MARL-Traffic-System',
  },
  {
    icon: TerminalIcon,
    title: 'Pixi',
    badge: 'Work in Progress',
    badgeType: 'wip',
    description:
      'An AI harness for orchestrating and running autonomous agent workflows. Currently building the core runtime, tooling, and execution pipeline.',
    tech: ['Python', 'AI Agents', 'LLM Orchestration'],
    link: null,
  },
  {
    icon: LockIcon,
    title: 'Full Stack Password Manager',
    badge: null,
    badgeType: null,
    description:
      'Secure password management application with encrypted user credentials and hashed authentication. Features a React frontend and Python backend with PostgreSQL database integration.',
    tech: ['React', 'Python', 'PostgreSQL', 'JavaScript', 'HTML/CSS'],
    link: 'https://github.com/David-Fr-afk/Password-Manager',
  },
  {
    icon: DinosaurIcon,
    title: 'AI-Powered Dino Runner',
    badge: null,
    badgeType: null,
    description:
      'Implemented an AI using NEAT algorithms to autonomously play the Chrome Dino game. Applied neural networks and genetic algorithms to demonstrate AI-driven gameplay and strategy evolution.',
    tech: ['Python', 'NEAT', 'Machine Learning', 'Neural Networks'],
    link: 'https://github.com/David-Fr-afk/Ai-plays-DINO',
  },
  {
    icon: PaletteIcon,
    title: 'Personal Portfolio Website',
    badge: null,
    badgeType: null,
    description:
      'Personal portfolio built with React and Three.js featuring a 3D space theme, smooth scrolling, and responsive design. Demonstrates modern web development skills and creativity.',
    tech: ['React', 'Three.js', 'CSS3', 'JavaScript'],
    link: 'https://github.com/David-Fr-afk/personal-portfolio',
  },
];

export default function HomeScreen() {
  const aboutRef = useRef(null);
  const skillsRef = useRef(null);
  const workRef = useRef(null);
  const projectsRef = useRef(null);
  const contactRef = useRef(null);
  const resumeRef = useRef(null);
  const [activeSection, setActiveSection] = useState('about');
  const [scrollProgress, setScrollProgress] = useState(0);
  const [modelOpacity, setModelOpacity] = useState(1);
  const [formStatus, setFormStatus] = useState(null);

  const sectionRefs = React.useMemo(
    () => ({
      about: aboutRef,
      skills: skillsRef,
      work: workRef,
      projects: projectsRef,
      contact: contactRef,
      resume: resumeRef,
    }),
    []
  );

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      const progress = (scrollPosition / (documentHeight - windowHeight)) * 100;
      setScrollProgress(Math.min(progress, 100));

      const heroHeight = window.innerHeight;
      if (scrollPosition < heroHeight) {
        const opacity = 1 - (scrollPosition / heroHeight) * 0.5;
        setModelOpacity(Math.max(opacity, 0.5));
      } else {
        setModelOpacity(0.5);
      }

      const scrollPositionWithOffset = scrollPosition + 100;
      Object.entries(sectionRefs).forEach(([sectionName, ref]) => {
        if (ref.current) {
          const { offsetTop, offsetHeight } = ref.current;
          if (
            scrollPositionWithOffset >= offsetTop &&
            scrollPositionWithOffset < offsetTop + offsetHeight
          ) {
            setActiveSection(sectionName);
          }
        }
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [sectionRefs]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.target) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    Object.values(sectionRefs).forEach((ref) => {
      if (ref && ref.current) {
        observer.observe(ref.current);
      }
    });

    return () => observer.disconnect();
  }, [sectionRefs]);

  useEffect(() => {
    let ticking = false;
    const trail = document.querySelector('.mouse-trail');
    const t1 = document.querySelector('.cursor-trail-1');
    const t2 = document.querySelector('.cursor-trail-2');
    const t3 = document.querySelector('.cursor-trail-3');

    const handleMouseMove = (e) => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(() => {
          const x = e.clientX;
          const y = e.clientY;
          if (trail) {
            trail.style.left = x + 'px';
            trail.style.top = y + 'px';
          }
          if (t1) {
            t1.style.left = x + 'px';
            t1.style.top = y + 'px';
          }
          if (t2) {
            t2.style.left = x + 'px';
            t2.style.top = y + 'px';
          }
          if (t3) {
            t3.style.left = x + 'px';
            t3.style.top = y + 'px';
          }
          ticking = false;
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!EMAILJS_SERVICE_ID || !EMAILJS_TEMPLATE_ID || !EMAILJS_PUBLIC_KEY) {
      setFormStatus({
        type: 'error',
        message: 'Email is not configured. Please email me directly at ' + CONTACT_EMAIL + '.',
      });
      return;
    }

    const formData = {
      name: e.target.name.value,
      email: e.target.email.value,
      subject: e.target.subject.value,
      message: e.target.message.value,
    };

    setFormStatus(null);
    try {
      await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, formData, EMAILJS_PUBLIC_KEY);
      setFormStatus({ type: 'success', message: "Thank you! I'll get back to you soon." });
      e.target.reset();
    } catch (err) {
      console.error(err);
      setFormStatus({
        type: 'error',
        message: 'Could not send. Please email me directly at ' + CONTACT_EMAIL + '.',
      });
    }
  };

  return (
    <div style={{ fontFamily: "'Space Mono', monospace" }}>
      <TopNav sectionRefs={sectionRefs} activeSection={activeSection} />

      <div className="scroll-progress-bar">
        <div className="scroll-progress-fill" style={{ width: `${scrollProgress}%` }} />
      </div>

      <div className="mouse-trail" />
      <div className="cursor-trail-1" />
      <div className="cursor-trail-2" />
      <div className="cursor-trail-3" />

      <section className="home-screen">
        <div className="left-column">
          <div ref={aboutRef} id="about" className="hero-section">
            <div className="skybox-container" style={{ opacity: modelOpacity }}>
              <Canvas
                camera={{ position: [0, 0, 2], fov: 70 }}
                dpr={[1, 1.5]}
                style={{ width: '100%', height: '100%', background: 'transparent', display: 'block' }}
                gl={{ alpha: true }}
              >
                <Suspense fallback={null}>
                  <SkyboxModel />
                </Suspense>
                <OrbitControls enableZoom={false} enablePan={false} autoRotate={false} />
              </Canvas>
              <div className="model-fade-overlay"></div>
            </div>

            <div className="hero-content">
              <div className="hero-text-container">
                <p className="job-title">Full Stack Developer</p>
                <div className="name-container">
                  <h1 className="hello-text">Hello I'm</h1>
                  <h1 className="name-text">David</h1>
                </div>
                <p className="description">
                  Computer Science graduate from the University of Windsor with a passion for
                  full-stack development, AI, and problem-solving. Currently working as a Systems
                  Analyst and open to new opportunities.
                </p>
                <div className="buttons">
                  <button
                    className="contact-button"
                    onClick={() =>
                      sectionRefs.contact.current?.scrollIntoView({ behavior: 'smooth' })
                    }
                  >
                    Contact Me
                  </button>
                  <button
                    className="learn-button"
                    onClick={() =>
                      sectionRefs.skills.current?.scrollIntoView({ behavior: 'smooth' })
                    }
                  >
                    View Skills <ArrowRightIcon size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div ref={skillsRef} id="skills" className="section skills-section">
            <div className="section-content">
              <div className="section-header">
                <h2 className="section-title">Technical Skills</h2>
                <p className="section-subtitle">Technologies and tools I work with</p>
                <div className="section-decoration">
                  <div className="decoration-line"></div>
                  <div className="decoration-dot"></div>
                  <div className="decoration-line"></div>
                </div>
              </div>

              <div className="skills-grid">
                {skills.map((cat) => (
                  <div className="skill-category" key={cat.title}>
                    <div className="skill-icon">
                      <cat.icon size={22} />
                    </div>
                    <h3>{cat.title}</h3>
                    <div className="skill-items">
                      {cat.items.map((item) => (
                        <span className="skill-item" key={item}>
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div ref={workRef} id="work" className="section work-section">
            <div className="section-content">
              <div className="section-header">
                <h2 className="section-title">Work Experience</h2>
                <p className="section-subtitle">My professional journey in software development</p>
                <div className="section-decoration">
                  <div className="decoration-line"></div>
                  <div className="decoration-dot"></div>
                  <div className="decoration-line"></div>
                </div>
              </div>

              <div className="timeline">
                {experience.map((job) => (
                  <div className="timeline-item" key={job.company}>
                    <div className="timeline-content">
                      <div className="timeline-header">
                        <h3>{job.role}</h3>
                        <div className={`timeline-badge ${job.badgeType}`}>{job.badge}</div>
                      </div>
                      <div className="timeline-company">
                        <span className="company-name">{job.company}</span>
                      </div>
                      <div className="timeline-period">
                        <span className="period-date">{job.period}</span>
                        <span className="period-duration">{job.duration}</span>
                      </div>
                      <div className="timeline-description">
                        <div className="role-overview">
                          <p>{job.overview}</p>
                        </div>
                        <div className="key-achievements">
                          <h4>Key Achievements</h4>
                          <div className="achievement-grid">
                            {job.achievements.map((a) => (
                              <div className="achievement-item" key={a}>
                                <span className="achievement-icon">
                                  <CheckIcon size={14} />
                                </span>
                                <span className="achievement-text">{a}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="tech-used">
                          <h4>Technologies Used</h4>
                          <div className="tech-tags">
                            {job.tech.map((t) => (
                              <span className="tech-tag" key={t}>
                                {t}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div ref={projectsRef} id="projects" className="section projects-section">
            <div className="section-content">
              <div className="section-header">
                <h2 className="section-title">Featured Projects</h2>
                <p className="section-subtitle">Some of the applications I've built</p>
                <div className="section-decoration">
                  <div className="decoration-line"></div>
                  <div className="decoration-dot"></div>
                  <div className="decoration-line"></div>
                </div>
              </div>

              <div className="projects-grid">
                {projects.map((project) => (
                  <div
                    className={`project-card ${project.badgeType === 'featured' ? 'featured' : ''}`}
                    key={project.title}
                  >
                    <div className="project-header">
                      <div className="project-icon">
                        <project.icon size={24} />
                      </div>
                      {project.badge && (
                        <div className={`project-badge ${project.badgeType}`}>{project.badge}</div>
                      )}
                    </div>
                    <h3>{project.title}</h3>
                    <p>{project.description}</p>
                    <div className="project-tech">
                      {project.tech.map((t) => (
                        <span className="tech-tag" key={t}>
                          {t}
                        </span>
                      ))}
                    </div>
                    <div className="project-links">
                      {project.link ? (
                        <a
                          href={project.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="project-link"
                        >
                          <span>View on GitHub</span>
                          <span className="link-arrow">
                            <ExternalLinkIcon size={16} />
                          </span>
                        </a>
                      ) : (
                        <span className="project-link" style={{ cursor: 'default', opacity: 0.7 }}>
                          <span>In development</span>
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div ref={contactRef} id="contact" className="section contact-section">
            <div className="section-content">
              <div className="section-header">
                <h2 className="section-title">Get In Touch</h2>
                <p className="section-subtitle">Let's connect and discuss opportunities</p>
                <div className="section-decoration">
                  <div className="decoration-line"></div>
                  <div className="decoration-dot"></div>
                  <div className="decoration-line"></div>
                </div>
              </div>

              <div className="contact-wrap">
                <div className="contact-meta">
                  <a href={`mailto:${CONTACT_EMAIL}`} className="contact-chip">
                    <span className="chip-icon">
                      <MailIcon size={18} />
                    </span>
                    {CONTACT_EMAIL}
                  </a>
                  <a
                    href="https://github.com/DavidShabo"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="contact-chip"
                  >
                    <span className="chip-icon">
                      <GithubIcon size={18} />
                    </span>
                    github.com/DavidShabo
                  </a>
                  <span className="contact-chip">
                    <span className="chip-icon">
                      <MapPinIcon size={18} />
                    </span>
                    Windsor, ON, Canada
                  </span>
                </div>

                <div className="contact-form-section">
                  <h3>Send me a message</h3>
                  <form className="contact-form" onSubmit={handleSubmit}>
                    <div className="form-row">
                      <div className="form-group">
                        <label htmlFor="name">Name</label>
                        <input type="text" id="name" name="name" placeholder="Your name" required />
                      </div>
                      <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input type="email" id="email" name="email" placeholder="Your email" required />
                      </div>
                    </div>
                    <div className="form-group">
                      <label htmlFor="subject">Subject</label>
                      <input
                        type="text"
                        id="subject"
                        name="subject"
                        placeholder="What's this about?"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="message">Message</label>
                      <textarea
                        id="message"
                        name="message"
                        rows="5"
                        placeholder="Tell me about your project or opportunity..."
                        required
                      ></textarea>
                    </div>
                    {formStatus && (
                      <div className={`form-status ${formStatus.type}`}>
                        <span className="status-icon">
                          {formStatus.type === 'success' ? (
                            <CheckIcon size={18} />
                          ) : (
                            <AlertIcon size={18} />
                          )}
                        </span>
                        <span>{formStatus.message}</span>
                      </div>
                    )}
                    <button type="submit" className="submit-button">
                      Send Message
                    </button>
                    <a href={`mailto:${CONTACT_EMAIL}`} className="mailto-fallback">
                      <span className="chip-icon">
                        <MailIcon size={16} />
                      </span>
                      or email me directly
                    </a>
                  </form>
                </div>
              </div>
            </div>
          </div>

          <div ref={resumeRef} id="resume" className="section resume-section">
            <div className="section-content">
              <div className="section-header">
                <h2 className="section-title">Resume & Education</h2>
                <p className="section-subtitle">A look at my background</p>
                <div className="section-decoration">
                  <div className="decoration-line"></div>
                  <div className="decoration-dot"></div>
                  <div className="decoration-line"></div>
                </div>
              </div>

              <div className="resume-content">
                <div className="education-card">
                  <div className="education-header">
                    <div className="education-icon">
                      <GradCapIcon size={32} />
                    </div>
                    <h3>Education</h3>
                  </div>
                  <div className="education-details">
                    <h4>University of Windsor</h4>
                    <p className="degree">Bachelor of Computer Science (Honors)</p>
                    <p className="specialization">Specialization in Machine Learning</p>
                    <div className="education-info">
                      <span className="year">Class of 2026</span>
                      <span className="location">
                        <MapPinIcon size={14} /> Windsor, ON
                      </span>
                    </div>
                    <div className="education-highlights">
                      <span className="highlight">AI/ML Focus</span>
                    </div>
                  </div>
                </div>

                <div className="resume-actions">
                  <a
                    href="/DavidS.Resume.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="resume-view-btn"
                  >
                    <EyeIcon size={18} />
                    <span>View Resume Online</span>
                  </a>
                  <p className="resume-note">PDF format · Updated regularly</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
