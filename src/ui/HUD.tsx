import React from 'react';
import { useGameStore } from '@state/game-store';

interface HUDProps {
  onReset: () => void;
}

export const HUD: React.FC<HUDProps> = ({ onReset }) => {
  const { currentLevel, score, moves, timeElapsed } = useGameStore();
  
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  return (
    <div
      style={{
        position: 'absolute',
        top: 20,
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        gap: '2rem',
        alignItems: 'center',
        background: 'rgba(10, 10, 10, 0.8)',
        padding: '1rem 2rem',
        borderRadius: '0.5rem',
        backdropFilter: 'blur(10px)',
        fontFamily: 'Orbitron, monospace',
        color: '#fafafa',
        zIndex: 1000
      }}
    >
      <div>
        <h1 style={{ margin: 0, fontSize: '1.5rem', color: 'oklch(80% 0.25 190)' }}>
          Level {currentLevel}
        </h1>
      </div>
      
      <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>
        Score: {score}
      </div>
      
      <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>
        Moves: {moves}
      </div>
      
      <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>
        Time: {formatTime(timeElapsed)}
      </div>
      
      <button
        onClick={onReset}
        style={{
          background: 'none',
          border: '2px solid oklch(80% 0.25 190)',
          color: 'oklch(80% 0.25 190)',
          padding: '0.5rem 1rem',
          borderRadius: '0.25rem',
          cursor: 'pointer',
          fontSize: '1rem',
          transition: 'all 0.2s',
          fontFamily: 'inherit'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'oklch(80% 0.25 190)';
          e.currentTarget.style.color = '#0a0a0a';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'none';
          e.currentTarget.style.color = 'oklch(80% 0.25 190)';
        }}
        title="Reset level (R)"
      >
        ↻
      </button>
    </div>
  );
};