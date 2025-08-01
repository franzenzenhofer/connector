import { System, World, EntityId } from '@game/ecs/types';
import { TileComponent, TileType } from '@game/components/tile';
import { DraggableComponent, DraggableType } from '@game/components/draggable';
import { TransformComponent, TransformType } from '@game/components/transform';
import { vec2, sub } from '@math/vector';
import Hammer from 'hammerjs';

export class InputSystem implements System {
  readonly name = 'Input';
  readonly priority = 1;
  
  private hammer: HammerManager | null = null;
  private selectedEntity: EntityId | null = null;
  private isDragging = false;
  private dragOffset = vec2(0, 0);
  private lastTapTime = 0;
  
  constructor(private element: HTMLElement) {
    this.setupHammer();
  }
  
  private setupHammer(): void {
    this.hammer = new Hammer(this.element);
    
    // Configure recognizers
    this.hammer.get('pan').set({ direction: Hammer.DIRECTION_ALL });
    this.hammer.get('tap').set({ taps: 1 });
    
    // Add double tap recognizer
    const doubleTap = new Hammer.Tap({ event: 'doubletap', taps: 2 });
    this.hammer.add(doubleTap);
    
    // Require double tap to fail before recognizing single tap
    this.hammer.get('tap').requireFailure('doubletap');
    
    // Set up event handlers
    this.hammer.on('tap', this.handleTap.bind(this));
    this.hammer.on('doubletap', this.handleDoubleTap.bind(this));
    this.hammer.on('panstart', this.handlePanStart.bind(this));
    this.hammer.on('panmove', this.handlePanMove.bind(this));
    this.hammer.on('panend', this.handlePanEnd.bind(this));
  }
  
  private handleTap(event: HammerInput): void {
    const now = Date.now();
    
    // Prevent accidental double processing
    if (now - this.lastTapTime < 100) return;
    this.lastTapTime = now;
    
    const world = window.__world;
    if (!world) return;
    
    const entity = this.getEntityAtPosition(world, event.center.x, event.center.y);
    if (!entity) return;
    
    const tile = world.getComponent<TileComponent>(entity, TileType);
    const draggable = world.getComponent<DraggableComponent>(entity, DraggableType);
    
    if (tile && draggable?.canRotate && tile.kind !== 'source' && tile.kind !== 'target') {
      // Rotate tile
      tile.rotation = (tile.rotation + 1) % 4;
      
      // Trigger rotation animation
      const renderer = window.__boardRenderer;
      if (renderer) {
        renderer.animateTileRotation(entity, tile.rotation);
      }
      
      // Increment moves
      const gameStore = window.__gameStore;
      if (gameStore) {
        gameStore.incrementMoves();
      }
    }
  }
  
  private handleDoubleTap(_event: HammerInput): void {
    // Reset level on double tap (for debugging)
    const gameStore = window.__gameStore;
    if (gameStore) {
      gameStore.resetLevel();
    }
  }
  
  private handlePanStart(event: HammerInput): void {
    const world = window.__world;
    if (!world) return;
    
    const entity = this.getEntityAtPosition(world, event.center.x, event.center.y);
    if (!entity) return;
    
    const draggable = world.getComponent<DraggableComponent>(entity, DraggableType);
    const tile = world.getComponent<TileComponent>(entity, TileType);
    
    if (draggable?.canMove && tile && tile.kind !== 'source' && tile.kind !== 'target') {
      this.selectedEntity = entity;
      this.isDragging = true;
      draggable.isDragging = true;
      
      const transform = world.getComponent<TransformComponent>(entity, TransformType);
      if (transform) {
        this.dragOffset = sub(
          vec2(event.center.x, event.center.y),
          transform.position
        );
      }
    }
  }
  
  private handlePanMove(event: HammerInput): void {
    if (!this.isDragging || !this.selectedEntity) return;
    
    const world = window.__world;
    if (!world) return;
    
    const transform = world.getComponent<TransformComponent>(this.selectedEntity, TransformType);
    if (transform) {
      transform.position = sub(
        vec2(event.center.x, event.center.y),
        this.dragOffset
      );
    }
  }
  
  private handlePanEnd(_event: HammerInput): void {
    if (!this.isDragging || !this.selectedEntity) return;
    
    const world = window.__world;
    if (!world) return;
    
    const draggable = world.getComponent<DraggableComponent>(this.selectedEntity, DraggableType);
    const tile = world.getComponent<TileComponent>(this.selectedEntity, TileType);
    const transform = world.getComponent<TransformComponent>(this.selectedEntity, TransformType);
    
    if (draggable && tile && transform) {
      // Snap to grid
      const tileSize = window.__tileSize;
      const newGridX = Math.round(transform.position[0] / tileSize);
      const newGridY = Math.round(transform.position[1] / tileSize);
      
      // Check if position is valid
      const boardSize = window.__boardSize;
      if (newGridX >= 0 && newGridX < boardSize && 
          newGridY >= 0 && newGridY < boardSize) {
        
        // Check if position is occupied
        const isOccupied = this.isPositionOccupied(world, newGridX, newGridY, this.selectedEntity);
        
        if (!isOccupied) {
          tile.gridX = newGridX;
          tile.gridY = newGridY;
          transform.position = vec2(newGridX * tileSize, newGridY * tileSize);
          
          // Increment moves
          const gameStore = window.__gameStore;
          if (gameStore) {
            gameStore.incrementMoves();
          }
        } else {
          // Snap back to original position
          transform.position = vec2(tile.gridX * tileSize, tile.gridY * tileSize);
        }
      } else {
        // Snap back to original position
        transform.position = vec2(tile.gridX * tileSize, tile.gridY * tileSize);
      }
      
      draggable.isDragging = false;
    }
    
    this.selectedEntity = null;
    this.isDragging = false;
  }
  
  private getEntityAtPosition(world: World, x: number, y: number): EntityId | null {
    const tileEntities = world.query({ required: [TileType, TransformType] });
    const tileSize = window.__tileSize;
    
    for (const entity of tileEntities) {
      const transform = world.getComponent<TransformComponent>(entity, TransformType);
      if (!transform) continue;
      
      const dx = x - transform.position[0];
      const dy = y - transform.position[1];
      
      if (dx >= 0 && dx < tileSize && dy >= 0 && dy < tileSize) {
        return entity;
      }
    }
    
    return null;
  }
  
  private isPositionOccupied(world: World, gridX: number, gridY: number, excludeEntity: EntityId): boolean {
    const tileEntities = world.query({ required: [TileType] });
    
    for (const entity of tileEntities) {
      if (entity === excludeEntity) continue;
      
      const tile = world.getComponent<TileComponent>(entity, TileType);
      if (tile && tile.gridX === gridX && tile.gridY === gridY) {
        return true;
      }
    }
    
    return false;
  }
  
  update(_world: World, _deltaTime: number): void {
    // Input system doesn't need per-frame updates
  }
  
  destroy(): void {
    if (this.hammer) {
      this.hammer.destroy();
      this.hammer = null;
    }
  }
}