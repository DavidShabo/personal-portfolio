import React from 'react';
import { Canvas } from '@react-three/fiber';
import '../index.css';
import '../App.css';

function TopNav() {
  const links = ['About', 'Skills', 'Work', 'Projects', 'Contact', 'Resume'];
  return (
    <nav className="top-nav">
      <ul>
        {links.map((txt, idx) => (
          <li key={txt}>
            <a href={`#${txt.toLowerCase()}`} className="nav-link">
              {`${txt}`}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

function PageDots({ sections = 6 }) {
  return (
    <aside className="page-dots">
      <ul>
        {Array.from({ length: sections }).map((_, i) => (
          <li key={i}>
            <button className="dot-button" />
          </li>
        ))}
      </ul>
    </aside>
  );
}

function BlobPlaceholder() {
  return (
    <Canvas camera={{ position: [0, 0, 4], fov: 50 }} gl={{ alpha: true }}>
      {/* TODO replace with real 3‑D model */}
    </Canvas>
  );
}

export default function HomeScreen() {
  return (
    <div style={{ fontFamily: "'Space Mono', monospace" }}>
      <section className="home-screen">
        <div className="left-column">
          <TopNav />
          
          <div className="hero-content">
            <p className="job-title">Software Developer</p>
            
            <div className="name-container">
              <h1 className="hello-text">Hello I'm</h1>
              <h1 className="name-text nebula-glow">David</h1>
            </div>
            
            <p className="description">
              Self‑taught programmer motivated by passion and personal projects. Expert at searching bugs on Google and quickly scanning the best StackOverflow answers.
            </p>
            
            <div className="buttons">
              <button className="contact-button">Contact Me</button>
              <button className="learn-button">Learn More →</button>
            </div>
          </div>
        </div>

        <div className="page-dots-container">
          <PageDots />
        </div>
      </section>
    </div>
  );
}