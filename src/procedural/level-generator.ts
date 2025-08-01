import { generateUniformSpanningTree, findLongestPath } from './wilson';
import { Vector2 } from '@math/vector';
import { Direction } from '@math/constants';
import { TileKind } from '@game/components/tile';

export interface LevelTile {
  position: Vector2;
  kind: TileKind;
  rotation: number;
}

export interface GeneratedLevel {
  tiles: LevelTile[];
  source: Vector2;
  target: Vector2;
  size: number;
}

export const generateLevel = (size: number = 8): GeneratedLevel => {
  const maze = generateUniformSpanningTree(size);
  const path = findLongestPath(maze);
  
  if (path.length < 2) {
    throw new Error('Failed to generate valid level path');
  }
  
  const tiles: LevelTile[] = [];
  const source = path[0];
  const target = path[path.length - 1];
  
  // Create source tile
  tiles.push({
    position: source,
    kind: 'source',
    rotation: 0
  });
  
  // Create path tiles
  for (let i = 1; i < path.length - 1; i++) {
    const prev = path[i - 1];
    const curr = path[i];
    const next = path[i + 1];
    
    const tile = createPathTile(prev, curr, next);
    tiles.push(tile);
  }
  
  // Create target tile
  tiles.push({
    position: target,
    kind: 'target',
    rotation: 0
  });
  
  return { tiles, source, target, size };
};

const createPathTile = (prev: Vector2, curr: Vector2, next: Vector2): LevelTile => {
  const inDir = getDirectionBetween(prev, curr);
  const outDir = getDirectionBetween(curr, next);
  
  // Check if it's a straight tile
  if ((inDir + 2) % 4 === outDir || (outDir + 2) % 4 === inDir) {
    // Straight tile
    const rotation = (inDir === Direction.North || inDir === Direction.South) ? 0 : 1;
    return {
      position: curr,
      kind: 'straight',
      rotation
    };
  } else {
    // Corner tile
    const rotation = getCornerRotation(inDir, outDir);
    return {
      position: curr,
      kind: 'corner',
      rotation
    };
  }
};

const getDirectionBetween = (from: Vector2, to: Vector2): Direction => {
  const dx = to[0] - from[0];
  const dy = to[1] - from[1];
  
  if (dx === 0 && dy === -1) return Direction.North;
  if (dx === 1 && dy === 0) return Direction.East;
  if (dx === 0 && dy === 1) return Direction.South;
  if (dx === -1 && dy === 0) return Direction.West;
  
  throw new Error('Positions are not adjacent');
};

const getCornerRotation = (inDir: Direction, outDir: Direction): number => {
  // Corner tile connects North and East in its default orientation (rotation 0)
  // We need to find how many quarter turns to apply
  
  const connectionPairs = [
    [Direction.North, Direction.East],
    [Direction.East, Direction.South],
    [Direction.South, Direction.West],
    [Direction.West, Direction.North]
  ];
  
  for (let rotation = 0; rotation < 4; rotation++) {
    const [conn1, conn2] = connectionPairs[rotation];
    const opposite1 = (conn1 + 2) % 4;
    const opposite2 = (conn2 + 2) % 4;
    
    if ((inDir === opposite1 && outDir === conn2) ||
        (inDir === opposite2 && outDir === conn1) ||
        (outDir === opposite1 && inDir === conn2) ||
        (outDir === opposite2 && inDir === conn1)) {
      return rotation;
    }
  }
  
  return 0;
};

export const shuffleTiles = (level: GeneratedLevel): GeneratedLevel => {
  const shuffled = [...level.tiles];
  
  // Don't shuffle source and target
  const pathTiles = shuffled.filter(t => t.kind !== 'source' && t.kind !== 'target');
  
  // Shuffle positions of path tiles
  for (let i = pathTiles.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const tempPos = pathTiles[i].position;
    pathTiles[i].position = pathTiles[j].position;
    pathTiles[j].position = tempPos;
  }
  
  // Randomize rotations
  for (const tile of pathTiles) {
    if (tile.kind === 'straight' || tile.kind === 'corner') {
      tile.rotation = Math.floor(Math.random() * 4);
    }
  }
  
  return level;
};