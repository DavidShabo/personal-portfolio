import React, { useState, Suspense } from 'react';
import { useFBX } from '@react-three/drei';
import BootGate from './BootGate';
import LoadingScreen from './components/LoadingScreen';
import HomeScreen from './components/HomeScreen'; 
import './App.css';

useFBX.preload('/models/blackhole/blackhole.fbx');

export default function App() {
  const [introDone, setIntroDone] = useState(false);

  return (
    <div className="App min-h-screen w-full bg-black text-white font-main select-none">
      <Suspense fallback={null}>
        <BootGate fallback={null}>
          {introDone ? (
            <HomeScreen /> 
          ) : (
            <LoadingScreen onComplete={() => setIntroDone(true)} />
          )}
        </BootGate>
      </Suspense>
    </div>
  );
}
