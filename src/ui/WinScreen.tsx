import React, { useEffect } from 'react';
import { useGameStore } from '@state/game-store';
import gsap from 'gsap';

export const WinScreen: React.FC = () => {
  const { score, moves, timeElapsed } = useGameStore();
  
  useEffect(() => {
    // Animate win screen
    gsap.fromTo(
      '.win-screen',
      {
        scale: 0.5,
        opacity: 0
      },
      {
        scale: 1,
        opacity: 1,
        duration: 0.5,
        ease: 'back.out(1.7)'
      }
    );
    
    gsap.fromTo(
      '.win-text',
      {
        y: -50,
        opacity: 0
      },
      {
        y: 0,
        opacity: 1,
        duration: 0.5,
        delay: 0.2,
        ease: 'power2.out'
      }
    );
  }, []);
  
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  return (
    <div
      className="win-screen"
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        textAlign: 'center',
        fontFamily: 'Orbitron, monospace',
        color: '#fafafa',
        zIndex: 3000,
        background: 'rgba(10, 10, 10, 0.9)',
        padding: '3rem',
        borderRadius: '1rem',
        backdropFilter: 'blur(20px)',
        border: '2px solid oklch(80% 0.25 190)',
        boxShadow: '0 0 4rem oklch(80% 0.25 190 / 0.5)'
      }}
    >
      <h1
        className="win-text"
        style={{
          fontSize: '3rem',
          margin: '0 0 2rem 0',
          color: 'oklch(80% 0.25 190)',
          textShadow: '0 0 2rem oklch(80% 0.25 190)',
          fontWeight: 900
        }}
      >
        CONNECTED!
      </h1>
      
      <div style={{ fontSize: '1.2rem', lineHeight: '2' }}>
        <div>Score: <span style={{ color: 'oklch(75% 0.25 330)' }}>{score}</span></div>
        <div>Moves: <span style={{ color: 'oklch(75% 0.25 330)' }}>{moves}</span></div>
        <div>Time: <span style={{ color: 'oklch(75% 0.25 330)' }}>{formatTime(timeElapsed)}</span></div>
      </div>
      
      <p style={{ marginTop: '2rem', opacity: 0.6 }}>
        Next level starting...
      </p>
    </div>
  );
};