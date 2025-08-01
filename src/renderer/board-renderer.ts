import { Container, Graphics } from 'pixi.js';
import { World, EntityId } from '@game/ecs/types';
import { TileComponent, TileType } from '@game/components/tile';
import { TileRenderer } from './tile-renderer';

export class BoardRenderer {
  private container: Container;
  private background: Graphics;
  private tileRenderers: Map<EntityId, TileRenderer>;
  private gridSize: number;
  private tileSize: number;
  
  constructor(gridSize: number, containerSize: number) {
    this.gridSize = gridSize;
    this.tileSize = containerSize / gridSize;
    this.container = new Container();
    this.background = new Graphics();
    this.tileRenderers = new Map();
    
    this.container.addChild(this.background);
    this.drawBackground();
  }
  
  private drawBackground(): void {
    const totalSize = this.gridSize * this.tileSize;
    
    // Draw grid background
    this.background.beginFill(0x0a0a0a);
    this.background.drawRect(0, 0, totalSize, totalSize);
    this.background.endFill();
    
    // Draw grid lines
    this.background.lineStyle(1, 0x1a1a1a, 0.5);
    
    for (let i = 0; i <= this.gridSize; i++) {
      const pos = i * this.tileSize;
      // Vertical lines
      this.background.moveTo(pos, 0);
      this.background.lineTo(pos, totalSize);
      // Horizontal lines
      this.background.moveTo(0, pos);
      this.background.lineTo(totalSize, pos);
    }
  }
  
  update(world: World): void {
    // Query all entities with tile components
    const tileEntities = world.query({
      required: [TileType]
    });
    
    // Remove renderers for entities that no longer exist
    for (const [entityId, renderer] of this.tileRenderers) {
      if (!tileEntities.includes(entityId)) {
        this.container.removeChild(renderer.getContainer());
        renderer.destroy();
        this.tileRenderers.delete(entityId);
      }
    }
    
    // Update or create renderers for tile entities
    for (const entityId of tileEntities) {
      const tile = world.getComponent<TileComponent>(entityId, TileType);
      if (!tile) continue;
      
      let renderer = this.tileRenderers.get(entityId);
      
      if (!renderer) {
        // Create new renderer
        renderer = new TileRenderer(this.tileSize);
        this.tileRenderers.set(entityId, renderer);
        this.container.addChild(renderer.getContainer());
        
        // Set up interaction
        renderer.getContainer().on('pointerdown', () => {
          this.onTileClick(entityId);
        });
        
        renderer.getContainer().on('pointerover', () => {
          this.onTileHover(entityId);
        });
        
        renderer.getContainer().on('pointerout', () => {
          this.onTileHoverEnd();
        });
      }
      
      // Update renderer
      renderer.render(tile);
    }
  }
  
  private onTileClick(_entityId: EntityId): void {
    // This will be connected to game logic
    // Tile clicked: entityId
  }
  
  private onTileHover(_entityId: EntityId): void {
    // This will be connected to game logic
    // Tile hovered: entityId
  }
  
  private onTileHoverEnd(): void {
    // This will be connected to game logic
    // Tile hover ended
  }
  
  animateTileRotation(entityId: EntityId, newRotation: number): void {
    const renderer = this.tileRenderers.get(entityId);
    if (renderer) {
      renderer.animateRotation(newRotation);
    }
  }
  
  animateTileLit(entityId: EntityId, lit: boolean): void {
    const renderer = this.tileRenderers.get(entityId);
    if (renderer) {
      renderer.animateLit(lit);
    }
  }
  
  getContainer(): Container {
    return this.container;
  }
  
  destroy(): void {
    for (const renderer of this.tileRenderers.values()) {
      renderer.destroy();
    }
    this.tileRenderers.clear();
    this.container.destroy({ children: true });
  }
}