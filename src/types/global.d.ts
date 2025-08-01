import { World } from '@game/ecs/types';
import { BoardRenderer } from '@renderer/board-renderer';
import { useGameStore } from '@state/game-store';

declare global {
  interface Window {
    __world: World;
    __boardRenderer: BoardRenderer;
    __gameStore: ReturnType<typeof useGameStore.getState>;
    __tileSize: number;
    __boardSize: number;
  }
}