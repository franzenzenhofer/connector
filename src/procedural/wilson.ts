import { Vector2, vec2 } from '@math/vector';
import { Direction, DIRECTION_VECTORS } from '@math/constants';

export interface MazeCell {
  position: Vector2;
  connections: Set<Direction>;
}

export interface MazeGraph {
  cells: Map<string, MazeCell>;
  size: number;
}

const positionKey = (pos: Vector2): string => `${pos[0]},${pos[1]}`;

export const generateUniformSpanningTree = (size: number): MazeGraph => {
  const cells = new Map<string, MazeCell>();
  const unvisited = new Set<string>();
  
  // Initialize all cells
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const pos = vec2(x, y);
      const key = positionKey(pos);
      cells.set(key, {
        position: pos,
        connections: new Set()
      });
      unvisited.add(key);
    }
  }
  
  // Pick random starting cell
  const startKey = Array.from(unvisited)[Math.floor(Math.random() * unvisited.size)];
  unvisited.delete(startKey);
  
  // Wilson's algorithm main loop
  while (unvisited.size > 0) {
    // Start random walk from unvisited cell
    const walkStart = Array.from(unvisited)[Math.floor(Math.random() * unvisited.size)];
    const path = performLoopErasedRandomWalk(walkStart, unvisited, cells, size);
    
    // Add path to tree
    for (let i = 0; i < path.length - 1; i++) {
      const fromKey = path[i];
      const toKey = path[i + 1];
      const fromCell = cells.get(fromKey)!;
      const toCell = cells.get(toKey)!;
      
      const direction = getDirection(fromCell.position, toCell.position);
      const opposite = (direction + 2) % 4 as Direction;
      
      fromCell.connections.add(direction);
      toCell.connections.add(opposite);
      unvisited.delete(fromKey);
    }
  }
  
  return { cells, size };
};

const performLoopErasedRandomWalk = (
  start: string,
  unvisited: Set<string>,
  cells: Map<string, MazeCell>,
  size: number
): string[] => {
  const path: string[] = [start];
  let current = start;
  
  while (unvisited.has(current)) {
    const currentCell = cells.get(current)!;
    const neighbors = getValidNeighbors(currentCell.position, size);
    
    if (neighbors.length === 0) break;
    
    const nextPos = neighbors[Math.floor(Math.random() * neighbors.length)];
    const nextKey = positionKey(nextPos);
    
    // Loop erasure
    const loopIndex = path.indexOf(nextKey);
    if (loopIndex !== -1) {
      path.splice(loopIndex + 1);
    } else {
      path.push(nextKey);
    }
    
    current = nextKey;
  }
  
  return path;
};

const getValidNeighbors = (pos: Vector2, size: number): Vector2[] => {
  const neighbors: Vector2[] = [];
  
  for (let dir = 0; dir < 4; dir++) {
    const offset = DIRECTION_VECTORS[dir];
    const newPos = vec2(pos[0] + offset[0], pos[1] + offset[1]);
    
    if (newPos[0] >= 0 && newPos[0] < size && 
        newPos[1] >= 0 && newPos[1] < size) {
      neighbors.push(newPos);
    }
  }
  
  return neighbors;
};

const getDirection = (from: Vector2, to: Vector2): Direction => {
  const dx = to[0] - from[0];
  const dy = to[1] - from[1];
  
  if (dx === 0 && dy === -1) return Direction.North;
  if (dx === 1 && dy === 0) return Direction.East;
  if (dx === 0 && dy === 1) return Direction.South;
  if (dx === -1 && dy === 0) return Direction.West;
  
  throw new Error('Invalid direction between cells');
};

export const findLongestPath = (maze: MazeGraph): Vector2[] => {
  let longestPath: Vector2[] = [];
  let maxLength = 0;
  
  // Find all leaf nodes (cells with only one connection)
  const leaves: MazeCell[] = [];
  for (const cell of maze.cells.values()) {
    if (cell.connections.size === 1) {
      leaves.push(cell);
    }
  }
  
  // Find longest path between any two leaves
  for (const startLeaf of leaves) {
    const path = findPathToFarthestLeaf(startLeaf, maze);
    if (path.length > maxLength) {
      maxLength = path.length;
      longestPath = path;
    }
  }
  
  return longestPath;
};

const findPathToFarthestLeaf = (start: MazeCell, maze: MazeGraph): Vector2[] => {
  const visited = new Set<string>();
  const queue: { cell: MazeCell; path: Vector2[] }[] = [
    { cell: start, path: [start.position] }
  ];
  
  let farthestPath: Vector2[] = [start.position];
  
  while (queue.length > 0) {
    const { cell, path } = queue.shift()!;
    const key = positionKey(cell.position);
    
    if (visited.has(key)) continue;
    visited.add(key);
    
    if (path.length > farthestPath.length) {
      farthestPath = path;
    }
    
    for (const dir of cell.connections) {
      const neighborPos = vec2(
        cell.position[0] + DIRECTION_VECTORS[dir][0],
        cell.position[1] + DIRECTION_VECTORS[dir][1]
      );
      const neighborKey = positionKey(neighborPos);
      const neighbor = maze.cells.get(neighborKey);
      
      if (neighbor && !visited.has(neighborKey)) {
        queue.push({
          cell: neighbor,
          path: [...path, neighborPos]
        });
      }
    }
  }
  
  return farthestPath;
};