import { System, World } from '@game/ecs/types';
import { TileComponent, TileType, canTileConnect } from '@game/components/tile';
import { Direction, oppositeDirection, DIRECTION_VECTORS } from '@math/constants';

export class LightPropagationSystem implements System {
  readonly name = 'LightPropagation';
  readonly priority = 10;
  
  update(world: World, _deltaTime: number): void {
    // Get all tiles
    const tileEntities = world.query({ required: [TileType] });
    const tiles = new Map<string, { entityId: string; tile: TileComponent }>();
    
    // Build spatial hash
    for (const entityId of tileEntities) {
      const tile = world.getComponent<TileComponent>(entityId, TileType);
      if (tile) {
        const key = `${tile.gridX},${tile.gridY}`;
        tiles.set(key, { entityId, tile });
      }
    }
    
    // Reset all tiles to unlit
    for (const { tile } of tiles.values()) {
      tile.lit = false;
    }
    
    // Find source tile and propagate light
    const source = Array.from(tiles.values()).find(({ tile }) => tile.kind === 'source');
    if (!source) return;
    
    // BFS from source
    const queue: Array<{ x: number; y: number }> = [{ x: source.tile.gridX, y: source.tile.gridY }];
    const visited = new Set<string>();
    
    source.tile.lit = true;
    visited.add(`${source.tile.gridX},${source.tile.gridY}`);
    
    while (queue.length > 0) {
      const current = queue.shift()!;
      const currentKey = `${current.x},${current.y}`;
      const currentData = tiles.get(currentKey);
      
      if (!currentData) continue;
      
      // Check all four directions
      for (let dir = 0; dir < 4; dir++) {
        const direction = dir as Direction;
        
        // Check if current tile allows exit in this direction
        if (!canTileConnect(currentData.tile, direction)) continue;
        
        // Calculate neighbor position
        const offset = DIRECTION_VECTORS[direction];
        const neighborX = current.x + offset[0];
        const neighborY = current.y + offset[1];
        const neighborKey = `${neighborX},${neighborY}`;
        
        // Skip if already visited
        if (visited.has(neighborKey)) continue;
        
        const neighborData = tiles.get(neighborKey);
        if (!neighborData) continue;
        
        // Check if neighbor allows entry from opposite direction
        const oppositeDir = oppositeDirection(direction);
        if (!canTileConnect(neighborData.tile, oppositeDir)) continue;
        
        // Light up the neighbor and continue propagation
        neighborData.tile.lit = true;
        visited.add(neighborKey);
        queue.push({ x: neighborX, y: neighborY });
      }
    }
    
    // Check if target is lit (win condition)
    const target = Array.from(tiles.values()).find(({ tile }) => tile.kind === 'target');
    if (target && target.tile.lit) {
      // Trigger win condition through store
      const gameStore = window.__gameStore;
      if (gameStore) {
        gameStore.setConnected(true);
      }
    }
  }
}