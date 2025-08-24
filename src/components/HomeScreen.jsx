import React, { useRef, Suspense, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import SkyboxFBX from './SkyboxModel';
import '../index.css';
import '../App.css';
import { OrbitControls } from '@react-three/drei';

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

export default function HomeScreen() {
  const aboutRef = useRef(null);
  const skillsRef = useRef(null);
  const workRef = useRef(null);
  const projectsRef = useRef(null);
  const contactRef = useRef(null);
  const resumeRef = useRef(null);
  const [activeSection, setActiveSection] = useState('about');
  const [scrollProgress, setScrollProgress] = useState(0);
  
  const sectionRefs = {
    about: aboutRef,
    skills: skillsRef,
    work: workRef,
    projects: projectsRef,
    contact: contactRef,
    resume: resumeRef,
  };

  // Handle scroll spy for navigation highlighting and scroll progress
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      
      // Calculate scroll progress
      const progress = (scrollPosition / (documentHeight - windowHeight)) * 100;
      setScrollProgress(Math.min(progress, 100));
      
      // Handle section highlighting
      const scrollPositionWithOffset = scrollPosition + 100;
      
      Object.entries(sectionRefs).forEach(([sectionName, ref]) => {
        if (ref.current) {
          const { offsetTop, offsetHeight } = ref.current;
          if (scrollPositionWithOffset >= offsetTop && scrollPositionWithOffset < offsetTop + offsetHeight) {
            setActiveSection(sectionName);
          }
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [sectionRefs]);

  // Intersection Observer for scroll animations
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, observerOptions);

    // Observe all sections
    Object.values(sectionRefs).forEach((ref) => {
      if (ref.current) {
        observer.observe(ref.current);
      }
    });

    return () => observer.disconnect();
  }, [sectionRefs]);

  return (
    <div style={{ fontFamily: "'Space Mono', monospace" }}>
      <TopNav sectionRefs={sectionRefs} activeSection={activeSection} />
      
      {/* Scroll Progress Bar */}
      <div className="scroll-progress-bar">
        <div 
          className="scroll-progress-fill" 
          style={{ width: `${scrollProgress}%` }}
        />
      </div>
      
      <section className="home-screen">
        <div className="left-column">
          {/* === HERO SECTION WITH SKYBOX === */}
          <div
            ref={aboutRef}
            id="about"
            className="hero-section"
          >
            {/* Skybox canvas - only for home section */}
            <div className="skybox-container">
              <Canvas
                camera={{ position: [0, 0, 2], fov: 70 }}
                style={{ 
                  width: '100%', 
                  height: '100%', 
                  background: 'transparent', 
                  display: 'block' 
                }}
                gl={{ alpha: true }}
              >
                <Suspense fallback={null}>
                  <SkyboxFBX />
                </Suspense>
                <OrbitControls enableZoom={false} enablePan={false} autoRotate={false} />
              </Canvas>
            </div>
            
            {/* Centered hero content on top */}
            <div className="hero-content">
              <div className="hero-text-container">
                <p className="job-title">Full Stack Developer</p>
                <div className="name-container">
                  <h1 className="hello-text">Hello I'm</h1>
                  <h1 className="name-text nebula-glow">David</h1>
                </div>
                <p className="description">
                  Computer Science student at University of Windsor with a passion for full-stack development, AI, and problem-solving. Currently interning at Rocket Studio Innovation, building scalable applications with React, TypeScript, and modern web technologies.
                </p>
                <div className="buttons">
                  <button className="contact-button" onClick={() => sectionRefs.contact.current.scrollIntoView({ behavior: 'smooth' })}>
                    <span>Contact Me</span>
                  </button>
                  <button className="learn-button" onClick={() => sectionRefs.skills.current.scrollIntoView({ behavior: 'smooth' })}>
                    <span>View Skills →</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* === Other Sections === */}
          {/* Skills Section */}
          <div ref={skillsRef} id="skills" className="section skills-section">
            <div className="section-content">
              <h2>Technical Skills</h2>
              <p>Technologies and tools I work with:</p>
              <div className="skills-grid">
                <div className="skill-category">
                  <h3>Programming Languages</h3>
                  <ul>
                    <li>TypeScript</li>
                    <li>Python</li>
                    <li>JavaScript</li>
                    <li>Java</li>
                    <li>C</li>
                    <li>SQL</li>
                  </ul>
                </div>
                <div className="skill-category">
                  <h3>Frontend & Web</h3>
                  <ul>
                    <li>React</li>
                    <li>Angular</li>
                    <li>HTML/CSS</li>
                    <li>Next.js</li>
                    <li>Responsive Design</li>
                  </ul>
                </div>
                <div className="skill-category">
                  <h3>Backend & Tools</h3>
                  <ul>
                    <li>Node.js</li>
                    <li>PostgreSQL</li>
                    <li>Docker</li>
                    <li>Git</li>
                    <li>VS Code</li>
                  </ul>
                </div>
                <div className="skill-category">
                  <h3>AI & Methodologies</h3>
                  <ul>
                    <li>NEAT Algorithm</li>
                    <li>Machine Learning</li>
                    <li>Agile Development</li>
                    <li>OOP & MVC</li>
                    <li>Problem Solving</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Work Section */}
          <div ref={workRef} id="work" className="section work-section">
            <div className="section-content">
              <h2>Work Experience</h2>
              <p>My professional journey in software development:</p>
              <div className="timeline">
                <div className="timeline-item">
                  <div className="timeline-dot"></div>
                  <div className="timeline-content">
                    <h3>Full Stack Developer - Intern</h3>
                    <p className="company">Rocket Studio Innovation</p>
                    <p className="period">Summer 2024</p>
                    <p>Spearheaded comprehensive code refactoring efforts, significantly reducing technical debt and optimizing performance. Discovered and resolved over 15 critical front-end and back-end bugs, boosting site responsiveness. Led development of a full-stack React system (Next.js + TypeScript) for company-wide interview scheduling.</p>
                  </div>
                </div>
                <div className="timeline-item">
                  <div className="timeline-dot"></div>
                  <div className="timeline-content">
                    <h3>IT Technician</h3>
                    <p className="company">Tech-Genie</p>
                    <p className="period">September 2023 - January 2024</p>
                    <p>Effectively diagnosed and resolved hardware problems for more than 10 clients, ensuring peak computer performance. Leveraged platforms like Facebook Marketplace and Kijiji to actively seek clients while offering incentives for referrals. Delivered prompt solutions through effective communication and provided impactful tips to prevent future issues.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Projects Section */}
          <div ref={projectsRef} id="projects" className="section projects-section">
            <div className="section-content">
              <h2>Featured Projects</h2>
              <p>Some of the applications I've built:</p>
              <div className="projects-grid">
                <div className="project-card">
                  <h3>Full Stack Password Manager</h3>
                  <p>Secure password management application with encrypted user credentials and hashed authentication. Features a React frontend and Python backend with PostgreSQL database integration.</p>
                  <div className="project-tech">
                    <span>React</span>
                    <span>Python</span>
                    <span>PostgreSQL</span>
                    <span>JavaScript</span>
                    <span>HTML/CSS</span>
                  </div>
                </div>
                <div className="project-card">
                  <h3>AI-Powered Dino Runner</h3>
                  <p>Implemented an AI using NEAT algorithms to autonomously play the Chrome Dino game. Applied neural networks and genetic algorithms to demonstrate AI-driven gameplay and strategy evolution.</p>
                  <div className="project-tech">
                    <span>Python</span>
                    <span>NEAT</span>
                    <span>Machine Learning</span>
                    <span>Neural Networks</span>
                  </div>
                </div>
                <div className="project-card">
                  <h3>Portfolio Website</h3>
                  <p>Personal portfolio built with React and Three.js featuring 3D space theme, smooth scrolling, and responsive design. Demonstrates modern web development skills and creativity.</p>
                  <div className="project-tech">
                    <span>React</span>
                    <span>Three.js</span>
                    <span>CSS3</span>
                    <span>JavaScript</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Section */}
          <div ref={contactRef} id="contact" className="section contact-section">
            <div className="section-content">
              <h2>Get In Touch</h2>
              <p>Let's connect and discuss opportunities:</p>
              <div className="contact-grid">
                <div className="contact-item">
                  <div className="contact-icon">📧</div>
                  <div>
                    <h3>Email</h3>
                    <a href="mailto:dvdshabo@gmail.com">dvdshabo@gmail.com</a>
                  </div>
                </div>
                <div className="contact-item">
                  <div className="contact-icon">🐙</div>
                  <div>
                    <h3>GitHub</h3>
                    <a href="https://github.com/DavidShaboGitHub" target="_blank" rel="noopener noreferrer">DavidShaboGitHub</a>
                  </div>
                </div>
                <div className="contact-item">
                  <div className="contact-icon">📱</div>
                  <div>
                    <h3>Phone</h3>
                    <a href="tel:+12265066973">(226) 506-6973</a>
                  </div>
                </div>
                <div className="contact-item">
                  <div className="contact-icon">📍</div>
                  <div>
                    <h3>Location</h3>
                    <span>Windsor, ON, Canada</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Resume Section */}
          <div ref={resumeRef} id="resume" className="section resume-section">
            <div className="section-content">
              <h2>Resume & Education</h2>
              <p>Download my resume or learn more about my background:</p>
              <div className="resume-info">
                <div className="education-card">
                  <h3>Education</h3>
                  <div className="education-details">
                    <h4>University of Windsor</h4>
                    <p>Bachelor of Computer Science (Honors)</p>
                    <p>3rd Year • Windsor, ON</p>
                  </div>
                </div>
                <div className="resume-actions">
                  <a href="/resume.pdf" download className="resume-download-btn">
                    📄 Download Resume
                  </a>
                  <a href="/resume.pdf" target="_blank" rel="noopener noreferrer" className="resume-view-btn">
                    👁️ View Online
                  </a>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}
