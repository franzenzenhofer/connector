import React from 'react';
import { useGameStore, GameState } from '@state/game-store';

export const Menu: React.FC = () => {
  const setGameState = useGameStore((state) => state.setGameState);
  
  return (
    <div
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        textAlign: 'center',
        fontFamily: 'Orbitron, monospace',
        color: '#fafafa',
        zIndex: 2000
      }}
    >
      <h1
        style={{
          fontSize: '4rem',
          margin: '0 0 2rem 0',
          color: 'oklch(80% 0.25 190)',
          textShadow: '0 0 2rem oklch(80% 0.25 190)',
          fontWeight: 900
        }}
      >
        LUMINODE
      </h1>
      
      <p style={{ fontSize: '1.2rem', opacity: 0.8, marginBottom: '3rem' }}>
        Connect the source to the target
      </p>
      
      <button
        onClick={() => setGameState(GameState.Playing)}
        style={{
          background: 'oklch(80% 0.25 190)',
          border: 'none',
          color: '#0a0a0a',
          padding: '1rem 3rem',
          borderRadius: '0.5rem',
          cursor: 'pointer',
          fontSize: '1.2rem',
          fontWeight: 'bold',
          transition: 'all 0.2s',
          fontFamily: 'inherit',
          boxShadow: '0 0 2rem oklch(80% 0.25 190 / 0.3)'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.05)';
          e.currentTarget.style.boxShadow = '0 0 3rem oklch(80% 0.25 190 / 0.5)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.boxShadow = '0 0 2rem oklch(80% 0.25 190 / 0.3)';
        }}
      >
        PLAY
      </button>
    </div>
  );
};