import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { devtools } from 'zustand/middleware';
import { EntityId } from '@game/ecs/types';
import { Vector2 } from '@math/vector';

export enum GameState {
  Loading = 'loading',
  Menu = 'menu',
  Playing = 'playing',
  Won = 'won',
  Paused = 'paused'
}

export interface GameStore {
  // Game state
  gameState: GameState;
  currentLevel: number;
  score: number;
  moves: number;
  timeElapsed: number;
  
  // Entity tracking
  selectedEntity: EntityId | null;
  hoveredEntity: EntityId | null;
  
  // Board state
  boardSize: number;
  sourcePosition: [number, number] | null;
  targetPosition: [number, number] | null;
  isConnected: boolean;
  
  // Actions
  setGameState: (state: GameState) => void;
  selectEntity: (id: EntityId | null) => void;
  hoverEntity: (id: EntityId | null) => void;
  incrementMoves: () => void;
  updateTimeElapsed: (delta: number) => void;
  setLevelComplete: () => void;
  resetLevel: () => void;
  nextLevel: () => void;
  setBoardInfo: (size: number, source: Vector2, target: Vector2) => void;
  setConnected: (connected: boolean) => void;
}

export const useGameStore = create<GameStore>()(
  devtools(
    immer((set) => ({
      // Initial state
      gameState: GameState.Loading,
      currentLevel: 1,
      score: 0,
      moves: 0,
      timeElapsed: 0,
      selectedEntity: null,
      hoveredEntity: null,
      boardSize: 8,
      sourcePosition: null,
      targetPosition: null,
      isConnected: false,
      
      // Actions
      setGameState: (state) => set((draft) => {
        draft.gameState = state;
      }),
      
      selectEntity: (id) => set((draft) => {
        draft.selectedEntity = id;
      }),
      
      hoverEntity: (id) => set((draft) => {
        draft.hoveredEntity = id;
      }),
      
      incrementMoves: () => set((draft) => {
        draft.moves += 1;
      }),
      
      updateTimeElapsed: (delta) => set((draft) => {
        draft.timeElapsed += delta;
      }),
      
      setLevelComplete: () => set((draft) => {
        draft.gameState = GameState.Won;
        draft.score += Math.max(1000 - draft.moves * 10 - Math.floor(draft.timeElapsed), 100);
      }),
      
      resetLevel: () => set((draft) => {
        draft.moves = 0;
        draft.timeElapsed = 0;
        draft.selectedEntity = null;
        draft.hoveredEntity = null;
        draft.isConnected = false;
        draft.gameState = GameState.Playing;
      }),
      
      nextLevel: () => set((draft) => {
        draft.currentLevel += 1;
        draft.moves = 0;
        draft.timeElapsed = 0;
        draft.selectedEntity = null;
        draft.hoveredEntity = null;
        draft.isConnected = false;
        draft.gameState = GameState.Playing;
      }),
      
      setBoardInfo: (size, source, target) => set((draft) => {
        draft.boardSize = size;
        draft.sourcePosition = [source[0], source[1]];
        draft.targetPosition = [target[0], target[1]];
      }),
      
      setConnected: (connected) => set((draft) => {
        draft.isConnected = connected;
        if (connected) {
          draft.gameState = GameState.Won;
          draft.score += Math.max(1000 - draft.moves * 10 - Math.floor(draft.timeElapsed), 100);
        }
      })
    })),
    {
      name: 'luminode-game-store'
    }
  )
);