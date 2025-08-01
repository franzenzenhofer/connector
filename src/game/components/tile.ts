import { Component, createComponentType } from '../ecs/types';
import { Direction, DIRECTION_MASKS } from '@math/constants';

export const TileType = createComponentType('tile');

export type TileKind = 'source' | 'target' | 'straight' | 'corner' | 'empty';

export interface TileComponent extends Component {
  readonly type: typeof TileType;
  kind: TileKind;
  gridX: number;
  gridY: number;
  rotation: number;
  lit: boolean;
}

/**
 * Creates a new tile component
 */
export const createTile = (
  kind: TileKind,
  gridX: number,
  gridY: number,
  rotation: number = 0
): TileComponent => ({
  type: TileType,
  kind,
  gridX,
  gridY,
  rotation: rotation % 4,
  lit: false
});

/**
 * Gets the connection mask for a tile accounting for its rotation
 * Uses bit rotation to efficiently compute rotated connection patterns
 */
export const getTileConnectionMask = (tile: TileComponent): number => {
  const baseMasks: Record<TileKind, number> = {
    source: DIRECTION_MASKS.reduce((a, b) => a | b, 0), // All directions
    target: DIRECTION_MASKS.reduce((a, b) => a | b, 0), // All directions
    straight: DIRECTION_MASKS[Direction.North] | DIRECTION_MASKS[Direction.South],
    corner: DIRECTION_MASKS[Direction.North] | DIRECTION_MASKS[Direction.East],
    empty: 0
  };
  
  const base = baseMasks[tile.kind];
  const r = tile.rotation;
  
  // Rotate the mask using circular bit shift
  return ((base << r) | (base >>> (4 - r))) & 0b1111;
};

/**
 * Checks if a tile can connect in a given direction
 */
export const canTileConnect = (tile: TileComponent, direction: Direction): boolean => {
  const mask = getTileConnectionMask(tile);
  return (mask & DIRECTION_MASKS[direction]) !== 0;
};