import React from 'react';
import { Canvas } from '@react-three/fiber';


function TopNav() {
  const links = ['About', 'Skills', 'Work', 'Projects', 'Contact', 'Resume'];
  return (
    <nav className="top-nav">
      <ul>
        {links.map((txt, idx) => (
          <li key={txt}>
            <a href={`#${txt.toLowerCase()}`} className="nav-link">
              {`${idx}. ${txt}`}
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
    <section className="home-screen">
      <div className="left-column">
        <TopNav />
        
        <div id="Header" className="header">
          <h1>David</h1>
        </div>
        
        <h2 className="sub-heading">Software Developer &nbsp;DEVELOPER</h2>
        
        <p className="description">
          Self‑taught programmer motivated by passion and personal projects. Expert at searching bugs on Google and quickly scanning the best StackOverflow answers.
        </p>
        
        <div className="buttons">
          <button className="contact-button">Contact Me</button>
          <button className="learn-button">Learn More →</button>
        </div>
      </div>

      {}
      <div className="right-column">
        <BlobPlaceholder />
      </div>

      {}
      <div className="page-dots-container">
        <PageDots />
      </div>
    </section>
  );
}
