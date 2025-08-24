import React, { useState, Suspense } from 'react';
import LoadingScreen from './components/LoadingScreen';
import HomeScreen from './components/HomeScreen'; 
import './App.css';

export default function App() {
  const [introDone, setIntroDone] = useState(false);

  return (
    <div className="App min-h-screen w-full bg-black text-white font-main select-none">
      <Suspense fallback={null}>
        {introDone ? <HomeScreen /> : <LoadingScreen onComplete={() => setIntroDone(true)} />}
      </Suspense>
    </div>
  );
}
