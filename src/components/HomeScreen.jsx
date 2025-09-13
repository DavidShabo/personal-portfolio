import React, { useRef, Suspense, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';  
import SkyboxModel from './SkyboxModel';
import '../App.css';
import { OrbitControls } from '@react-three/drei';

function InteractiveParticles() {
  const particlesRef = useRef(null);
  
  useEffect(() => {
    const particles = particlesRef.current;
    if (!particles) return;
    
    let ticking = false;
    const handleMouseMove = (e) => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const rect = particles.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          
          particles.style.setProperty('--mouse-x', `${x}px`);
          particles.style.setProperty('--mouse-y', `${y}px`);
          ticking = false;
        });
        ticking = true;
      }
    };
    
    particles.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => particles.removeEventListener('mousemove', handleMouseMove);
  }, []);
  
  return (
    <div ref={particlesRef} className="interactive-particles">
      {Array.from({ length: 50 }).map((_, i) => (
        <div key={i} className="particle" style={{ '--delay': `${i * 0.1}s` }} />
      ))}
    </div>
  );
}

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
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [modelOpacity, setModelOpacity] = useState(1);
  
  const sectionRefs = {
    about: aboutRef,
    skills: skillsRef,
    work: workRef,
    projects: projectsRef,
    contact: contactRef,
    resume: resumeRef,
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      
      const progress = (scrollPosition / (documentHeight - windowHeight)) * 100;
      setScrollProgress(Math.min(progress, 100));
      
      // Fade out model as user scrolls
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
          if (scrollPositionWithOffset >= offsetTop && scrollPositionWithOffset < offsetTop + offsetHeight) {
            setActiveSection(sectionName);
          }
        }
      });
    };

    let ticking = false;
    const handleMouseMove = (e) => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setMousePosition({ x: e.clientX, y: e.clientY });
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [sectionRefs]);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.target) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    Object.values(sectionRefs).forEach((ref) => {
      if (ref && ref.current) {
        observer.observe(ref.current);
      }
    });

    return () => observer.disconnect();
  }, [sectionRefs]);

  return (
    <div style={{ fontFamily: "'Space Mono', monospace" }}>
      <TopNav sectionRefs={sectionRefs} activeSection={activeSection} />
      
      <div className="scroll-progress-bar">
        <div className="scroll-progress-fill" style={{ width: `${scrollProgress}%` }} />
      </div>
      
      <InteractiveParticles />
      
      <div className="mouse-trail" style={{ left: mousePosition.x, top: mousePosition.y }} />
      <div className="cursor-trail-1" style={{ left: mousePosition.x, top: mousePosition.y }} />
      <div className="cursor-trail-2" style={{ left: mousePosition.x, top: mousePosition.y }} />
      <div className="cursor-trail-3" style={{ left: mousePosition.x, top: mousePosition.y }} />
      
      <section className="home-screen">
        <div className="left-column">
          <div ref={aboutRef} id="about" className="hero-section">
            <div className="skybox-container" style={{ opacity: modelOpacity }}>
              <Canvas
                camera={{ position: [0, 0, 2], fov: 70 }}
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
                <div className="floating-elements">
                  <div className="floating-orb" style={{ '--delay': '0s' }} />
                  <div className="floating-orb" style={{ '--delay': '1s' }} />
                  <div className="floating-orb" style={{ '--delay': '2s' }} />
                </div>
                <p className="job-title">Full Stack Developer</p>
                <div className="name-container">
                  <h1 className="hello-text">Hello I'm</h1>
                  <h1 className="name-text nebula-glow">David</h1>
                </div>
                <p className="description">
                  Computer Science student at University of Windsor with a passion for full-stack development, AI, and problem-solving. Currently interning at Rocket Studio Innovation, building scalable applications with React, TypeScript, and modern web technologies.
                </p>
                <div className="buttons">
                  <button className="contact-button" onClick={() => {
                    try {
                      sectionRefs.contact.current?.scrollIntoView({ behavior: 'smooth' });
                    } catch (error) {
                      console.warn('Scroll failed:', error);
                    }
                  }}>
                    <span>Contact Me</span>
                    <div className="button-glow" />
                  </button>
                  <button className="learn-button" onClick={() => {
                    try {
                      sectionRefs.skills.current?.scrollIntoView({ behavior: 'smooth' });
                    } catch (error) {
                      console.warn('Scroll failed:', error);
                    }
                  }}>
                    <span>View Skills →</span>
                    <div className="button-glow" />
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
                <div className="skill-category">
                  <div className="skill-icon">💻</div>
                  <h3>Programming Languages</h3>
                  <div className="skill-items">
                    <span className="skill-item">TypeScript</span>
                    <span className="skill-item">Python</span>
                    <span className="skill-item">JavaScript</span>
                    <span className="skill-item">Java</span>
                    <span className="skill-item">C</span>
                    <span className="skill-item">SQL</span>
                  </div>
                </div>
                
                <div className="skill-category">
                  <div className="skill-icon">🌐</div>
                  <h3>Frontend & Web</h3>
                  <div className="skill-items">
                    <span className="skill-item">React</span>
                    <span className="skill-item">ThreeJS</span>
                    <span className="skill-item">Angular</span>
                    <span className="skill-item">HTML/CSS</span>
                    <span className="skill-item">Next.js</span>
                    <span className="skill-item">Responsive Design</span>
                  </div>
                </div>
                
                <div className="skill-category">
                  <div className="skill-icon">⚙️</div>
                  <h3>Backend & Tools</h3>
                  <div className="skill-items">
                    <span className="skill-item">Node.js</span>
                    <span className="skill-item">PostgreSQL</span>
                    <span className="skill-item">Docker</span>
                    <span className="skill-item">Git</span>
                    <span className="skill-item">VS Code</span>
                  </div>
                </div>
                
                <div className="skill-category">
                  <div className="skill-icon">🤖</div>
                  <h3>AI & Methodologies</h3>
                  <div className="skill-items">
                    <span className="skill-item">NEAT Algorithm</span>
                    <span className="skill-item">Machine Learning</span>
                    <span className="skill-item">Agile Development</span>
                    <span className="skill-item">OOP & MVC</span>
                    <span className="skill-item">Problem Solving</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div ref={workRef} id="work" className="section work-section">
            <div className="floating-particles">
              {Array.from({ length: 15 }).map((_, i) => (
                <div 
                  key={i} 
                  className="floating-particle"
                  style={{ 
                    '--delay': `${i * 0.2}s`,
                    '--size': `${Math.random() * 3 + 1}px`,
                    '--x': `${Math.random() * 100}%`,
                    '--y': `${Math.random() * 100}%`
                  }}
                />
              ))}
            </div>
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
                  <div className="timeline-item">
                    <div className="timeline-content">
                    <div className="timeline-header">
                      <h3>Full Stack Developer - Intern</h3>
                      <div className="timeline-badge completed">Completed</div>
                    </div>
                    <div className="timeline-company">
                      <span className="company-emoji">🚀</span>
                      <span className="company-name">Rocket Studio Innovation</span>
                    </div>
                    <div className="timeline-period">
                      <span className="period-date">Summer 2024</span>
                      <span className="period-duration">3 months</span>
                    </div>
                    
                    <div className="timeline-description">
                      <div className="role-overview">
                        <p>Led full-stack development initiatives for a growing tech company, focusing on code quality, performance optimization, and user experience improvements.</p>
                      </div>
                      
                      <div className="key-achievements">
                        <h4>Key Achievements</h4>
                        <div className="achievement-grid">
                          <div className="achievement-item">
                            <span className="achievement-icon">🔧</span>
                            <span className="achievement-text">Code Refactoring</span>
                          </div>
                          <div className="achievement-item">
                            <span className="achievement-icon">🐛</span>
                            <span className="achievement-text">Bug Resolution</span>
                          </div>
                          <div className="achievement-item">
                            <span className="achievement-icon">⚡</span>
                            <span className="achievement-text">Performance Optimization</span>
                          </div>
                          <div className="achievement-item">
                            <span className="achievement-icon">🎯</span>
                            <span className="achievement-text">Full-Stack Development</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="tech-used">
                        <h4>Technologies Used</h4>
                        <div className="tech-tags">
                          <span className="tech-tag">React</span>
                          <span className="tech-tag">TypeScript</span>
                          <span className="tech-tag">Next.js</span>
                          <span className="tech-tag">Python</span>
                          <span className="tech-tag">PostgreSQL</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                                  <div className="timeline-item">
                    <div className="timeline-content">
                    <div className="timeline-header">
                      <h3>IT Technician</h3>
                      <div className="timeline-badge completed">Completed</div>
                    </div>
                    <div className="timeline-company">
                      <span className="company-emoji">🔧</span>
                      <span className="company-name">Tech-Genie</span>
                    </div>
                    <div className="timeline-period">
                      <span className="period-date">September 2023 - January 2024</span>
                      <span className="period-duration">5 months</span>
                    </div>
                    
                    <div className="timeline-description">
                      <div className="role-overview">
                        <p>Provided technical support and hardware repair services to clients, demonstrating strong problem-solving skills and customer service abilities.</p>
                      </div>
                      
                      <div className="key-achievements">
                        <h4>Key Achievements</h4>
                        <div className="achievement-grid">
                          <div className="achievement-item">
                            <span className="achievement-icon">💻</span>
                            <span className="achievement-text">Hardware Repair</span>
                          </div>
                          <div className="achievement-item">
                            <span className="achievement-icon">👥</span>
                            <span className="achievement-text">Client Management</span>
                          </div>
                          <div className="achievement-item">
                            <span className="achievement-icon">🔍</span>
                            <span className="achievement-text">Problem Solving</span>
                          </div>
                          <div className="achievement-item">
                            <span className="achievement-icon">📱</span>
                            <span className="achievement-text">Platform Marketing</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="tech-used">
                        <h4>Skills Applied</h4>
                        <div className="tech-tags">
                          <span className="tech-tag">Hardware Diagnostics</span>
                          <span className="tech-tag">Customer Service</span>
                          <span className="tech-tag">Problem Solving</span>
                          <span className="tech-tag">Marketing</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div ref={projectsRef} id="projects" className="section projects-section">
            <div className="floating-particles">
              {Array.from({ length: 12 }).map((_, i) => (
                <div 
                  key={i} 
                  className="floating-particle"
                  style={{ 
                    '--delay': `${i * 0.3}s`,
                    '--size': `${Math.random() * 2 + 1}px`,
                    '--x': `${Math.random() * 100}%`,
                    '--y': `${Math.random() * 100}%`
                  }}
                />
              ))}
            </div>
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
                <div className="project-card featured">
                  <div className="project-header">
                    <div className="project-icon">📈</div>
                    <div className="project-badge">Featured</div>
                  </div>
                  <h3>Stock Price Predictor</h3>
                  <p>Advanced stock analysis tool that uses mathematical algorithms to predict stock prices and provide buy/sell recommendations. Currently implementing AI/ML capabilities for enhanced prediction accuracy.</p>
                  <div className="project-tech">
                    <span className="tech-tag">Python</span>
                    <span className="tech-tag">Machine Learning</span>
                    <span className="tech-tag">Data Analysis</span>
                    <span className="tech-tag">Financial APIs</span>
                    <span className="tech-tag">AI/ML</span>
                  </div>
                  <div className="project-links">
                    <a href="https://github.com/David-Fr-afk/Stock-Price-Predictor" target="_blank" rel="noopener noreferrer" className="project-link">
                      <span>🐙 View on GitHub</span>
                      <div className="link-arrow">→</div>
                    </a>
                  </div>
                </div>
                
                <div className="project-card">
                  <div className="project-header">
                    <div className="project-icon">🔐</div>
                  </div>
                  <h3>Full Stack Password Manager</h3>
                  <p>Secure password management application with encrypted user credentials and hashed authentication. Features a React frontend and Python backend with PostgreSQL database integration.</p>
                  <div className="project-tech">
                    <span className="tech-tag">React</span>
                    <span className="tech-tag">Python</span>
                    <span className="tech-tag">PostgreSQL</span>
                    <span className="tech-tag">JavaScript</span>
                    <span className="tech-tag">HTML/CSS</span>
                  </div>
                  <div className="project-links">
                    <a href="https://github.com/David-Fr-afk/Password-Manager" target="_blank" rel="noopener noreferrer" className="project-link">
                      <span>🐙 View on GitHub</span>
                      <div className="link-arrow">→</div>
                    </a>
                  </div>
                </div>
                
                <div className="project-card">
                  <div className="project-header">
                    <div className="project-icon">🦖</div>
                  </div>
                  <h3>AI-Powered Dino Runner</h3>
                  <p>Implemented an AI using NEAT algorithms to autonomously play the Chrome Dino game. Applied neural networks and genetic algorithms to demonstrate AI-driven gameplay and strategy evolution.</p>
                  <div className="project-tech">
                    <span className="tech-tag">Python</span>
                    <span className="tech-tag">NEAT</span>
                    <span className="tech-tag">Machine Learning</span>
                    <span className="tech-tag">Neural Networks</span>
                  </div>
                  <div className="project-links">
                    <a href="https://github.com/David-Fr-afk/Ai-plays-DINO" target="_blank" rel="noopener noreferrer" className="project-link">
                      <span>🐙 View on GitHub</span>
                      <div className="link-arrow">→</div>
                    </a>
                  </div>
                </div>
                
                <div className="project-card">
                  <div className="project-header">
                    <div className="project-icon">🌌</div>
                  </div>
                  <h3>Personal Portfolio Website</h3>
                  <p>Personal portfolio built with React and Three.js featuring 3D space theme, smooth scrolling, and responsive design. Demonstrates modern web development skills and creativity.</p>
                  <div className="project-tech">
                    <span className="tech-tag">React</span>
                    <span className="tech-tag">Three.js</span>
                    <span className="tech-tag">CSS3</span>
                    <span className="tech-tag">JavaScript</span>
                  </div>
                  <div className="project-links">
                    <a href="https://github.com/David-Fr-afk/personal-portfolio" target="_blank" rel="noopener noreferrer" className="project-link">
                      <span>🐙 View on GitHub</span>
                      <div className="link-arrow">→</div>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div ref={contactRef} id="contact" className="section contact-section">
            <div className="floating-particles">
              {Array.from({ length: 8 }).map((_, i) => (
                <div 
                  key={i} 
                  className="floating-particle"
                  style={{ 
                    '--delay': `${i * 0.4}s`,
                    '--size': `${Math.random() * 2.5 + 1.5}px`,
                    '--x': `${Math.random() * 100}%`,
                    '--y': `${Math.random() * 100}%`
                  }}
                />
              ))}
            </div>
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
              
              <div className="contact-grid">
                <div className="contact-item">
                  <div className="contact-icon">📧</div>
                  <div className="contact-details">
                    <h3>Email</h3>
                    <a href="mailto:dvdshabo@gmail.com" className="contact-link">dvdshabo@gmail.com</a>
                    <p className="contact-note">Available for freelance and full-time opportunities</p>
                  </div>
                </div>
                
                <div className="contact-item">
                  <div className="contact-icon">🐙</div>
                  <div className="contact-details">
                    <h3>GitHub</h3>
                    <a href="https://github.com/DavidShaboGitHub" target="_blank" rel="noopener noreferrer" className="contact-link">DavidShaboGitHub</a>
                    <p className="contact-note">Check out my latest projects and contributions</p>
                  </div>
                </div>
                
                <div className="contact-item">
                  <div className="contact-icon">📍</div>
                  <div className="contact-details">
                    <h3>Location</h3>
                    <span className="contact-text">Windsor, ON, Canada</span>
                    <p className="contact-note">Open to remote and local opportunities</p>
                  </div>
                </div>
              </div>
              
              <div className="contact-form-section">
                <h3>Send me a message</h3>
                <form className="contact-form">
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
                    <input type="text" id="subject" name="subject" placeholder="What's this about?" required />
                  </div>
                  <div className="form-group">
                    <label htmlFor="message">Message</label>
                    <textarea id="message" name="message" rows="5" placeholder="Tell me about your project or opportunity..." required></textarea>
                  </div>
                  <button type="submit" className="submit-button">
                    <span>Send Message</span>
                    <div className="button-glow"></div>
                  </button>
                </form>
              </div>
            </div>
          </div>

          <div ref={resumeRef} id="resume" className="section resume-section">
            <div className="floating-particles">
              {Array.from({ length: 10 }).map((_, i) => (
                <div 
                  key={i} 
                  className="floating-particle"
                  style={{ 
                    '--delay': `${i * 0.25}s`,
                    '--size': `${Math.random() * 2 + 1}px`,
                    '--x': `${Math.random() * 100}%`,
                    '--y': `${Math.random() * 100}%`
                  }}
                />
              ))}
            </div>
            <div className="section-content">
              <div className="section-header">
                <h2 className="section-title">Resume & Education</h2>
                <p className="section-subtitle">Download my resume or learn more about my background</p>
                <div className="section-decoration">
                  <div className="decoration-line"></div>
                  <div className="decoration-dot"></div>
                  <div className="decoration-line"></div>
                </div>
              </div>
              
              <div className="resume-content">
                <div className="education-card">
                  <div className="education-header">
                    <div className="education-icon">🎓</div>
                    <h3>Education</h3>
                  </div>
                  <div className="education-details">
                    <h4>University of Windsor</h4>
                    <p className="degree">Bachelor of Computer Science (Honors)</p>
                    <p className="specialization">Specialization in Machine Learning</p>
                    <div className="education-info">
                      <span className="year">4th Year</span>
                      <span className="location">📍 Windsor, ON</span>
                    </div>
                    <div className="education-highlights">
                      <span className="highlight">AI/ML Focus</span>
                      <span className="highlight">Research Projects</span>
                      <span className="highlight">Academic Excellence</span>
                    </div>
                  </div>
                </div>
                
                <div className="resume-actions">
                  <div className="action-group">
                    <a href="/DavidS.Resume.pdf" download className="resume-download-btn">
                      <span>📄 Download Resume</span>
                      <div className="btn-glow"></div>
                    </a>
                    <a href="/DavidS.Resume.pdf" target="_blank" rel="noopener noreferrer" className="resume-view-btn">
                      <span>👁️ View Online</span>
                      <div className="btn-glow"></div>
                    </a>
                  </div>
                  <p className="resume-note">PDF format • Updated regularly</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
