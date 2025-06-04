import React from 'react';
import { useProgress } from '@react-three/drei';

export default function BootGate({ children, fallback = null }) {
  const { active } = useProgress();   
  return active ? fallback        
                : children;           
}
