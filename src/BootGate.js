import React from 'react';
import { useProgress } from '@react-three/drei';

// children won't render while 'active' is true
export default function BootGate({ children, fallback = null }) {
  const { active } = useProgress();   
  return active ? fallback        
                : children;           
}
