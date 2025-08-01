import React, { useEffect, useRef } from 'react';
import { Game } from '../game';
import { useGameStore, GameState } from '@state/game-store';
import { HUD } from './HUD';
import { Menu } from './Menu';
import { WinScreen } from './WinScreen';

export const App: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameRef = useRef<Game | null>(null);
  const gameState = useGameStore((state) => state.gameState);
  
  useEffect(() => {
    if (!canvasRef.current) return;
    
    // Create and initialize game
    const game = new Game();
    gameRef.current = game;
    
    game.init(canvasRef.current).catch(console.error);
    
    // Cleanup
    return () => {
      game.destroy();
      gameRef.current = null;
    };
  }, []);
  
  const handleReset = () => {
    if (gameRef.current) {
      gameRef.current.reset();
    }
  };
  
  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%'
        }}
      />
      
      {gameState === GameState.Playing && <HUD onReset={handleReset} />}
      {gameState === GameState.Menu && <Menu />}
      {gameState === GameState.Won && <WinScreen />}
    </div>
  );
};