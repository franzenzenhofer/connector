import { Graphics, Container, Text, TextStyle } from 'pixi.js';
import { TileComponent, getTileConnectionMask } from '@game/components/tile';
import { DIRECTION_MASKS, TAU } from '@math/constants';
import gsap from 'gsap';

export class TileRenderer {
  private container: Container;
  private graphics: Graphics;
  private glowGraphics: Graphics;
  private symbol?: Text;
  private size: number;
  
  constructor(size: number) {
    this.size = size;
    this.container = new Container();
    this.graphics = new Graphics();
    this.glowGraphics = new Graphics();
    
    this.container.addChild(this.glowGraphics);
    this.container.addChild(this.graphics);
    
    this.container.eventMode = 'static';
    this.container.cursor = 'pointer';
  }
  
  render(tile: TileComponent): void {
    this.graphics.clear();
    this.glowGraphics.clear();
    
    const halfSize = this.size / 2;
    const cornerRadius = this.size * 0.1;
    
    // Draw base tile
    this.graphics.beginFill(tile.lit ? 0x152525 : 0x1a1a1a);
    this.graphics.lineStyle(2, tile.lit ? 0x00ffff : 0x444444);
    this.graphics.roundRect(0, 0, this.size, this.size, cornerRadius);
    this.graphics.fill();
    this.graphics.endFill();
    
    // Draw connection paths
    this.drawConnections(tile);
    
    // Draw symbols for source/target
    if (tile.kind === 'source' || tile.kind === 'target') {
      this.drawSymbol(tile);
    }
    
    // Position based on grid
    this.container.x = tile.gridX * this.size;
    this.container.y = tile.gridY * this.size;
    
    // Apply rotation
    this.container.pivot.set(halfSize, halfSize);
    this.container.position.set(
      this.container.x + halfSize,
      this.container.y + halfSize
    );
  }
  
  private drawConnections(tile: TileComponent): void {
    const mask = getTileConnectionMask(tile);
    const halfSize = this.size / 2;
    const pathWidth = this.size * 0.25;
    const pathLength = this.size * 0.45;
    
    this.graphics.lineStyle(pathWidth, tile.lit ? 0x77ffff : 0x555555, 1);
    
    if (tile.lit) {
      // Draw glow
      this.glowGraphics.lineStyle(pathWidth * 1.5, 0x00ffff, 0.3);
      this.glowGraphics.filters = []; // Add bloom filter later
    }
    
    // Draw paths based on tile type
    switch (tile.kind) {
      case 'straight':
        this.graphics.moveTo(halfSize, halfSize - pathLength);
        this.graphics.lineTo(halfSize, halfSize + pathLength);
        
        if (tile.lit) {
          this.glowGraphics.moveTo(halfSize, halfSize - pathLength);
          this.glowGraphics.lineTo(halfSize, halfSize + pathLength);
        }
        break;
        
      case 'corner':
        this.graphics.moveTo(halfSize - pathLength, halfSize);
        this.graphics.lineTo(halfSize, halfSize);
        this.graphics.lineTo(halfSize, halfSize - pathLength);
        
        if (tile.lit) {
          this.glowGraphics.moveTo(halfSize - pathLength, halfSize);
          this.glowGraphics.lineTo(halfSize, halfSize);
          this.glowGraphics.lineTo(halfSize, halfSize - pathLength);
        }
        break;
        
      case 'source':
      case 'target':
        // Draw connections in all directions that are active
        for (let dir = 0; dir < 4; dir++) {
          if (mask & DIRECTION_MASKS[dir]) {
            const angle = dir * TAU / 4;
            const dx = Math.cos(angle) * pathLength;
            const dy = Math.sin(angle) * pathLength;
            
            this.graphics.moveTo(halfSize, halfSize);
            this.graphics.lineTo(halfSize + dx, halfSize + dy);
            
            if (tile.lit) {
              this.glowGraphics.moveTo(halfSize, halfSize);
              this.glowGraphics.lineTo(halfSize + dx, halfSize + dy);
            }
          }
        }
        break;
    }
    
    // Apply rotation
    this.graphics.rotation = tile.rotation * TAU / 4;
    this.glowGraphics.rotation = tile.rotation * TAU / 4;
  }
  
  private drawSymbol(tile: TileComponent): void {
    const style = new TextStyle({
      fontFamily: 'Orbitron, monospace',
      fontSize: this.size * 0.4,
      fontWeight: '900',
      fill: tile.lit ? 0xccffff : 0x00aaff,
      align: 'center'
    });
    
    const symbol = tile.kind === 'source' ? '⚡' : '⌾';
    this.symbol = new Text(symbol, style);
    this.symbol.anchor.set(0.5);
    this.symbol.position.set(this.size / 2, this.size / 2);
    
    this.container.addChild(this.symbol);
  }
  
  animateRotation(newRotation: number): void {
    const targetRotation = newRotation * TAU / 4;
    gsap.to(this.graphics, {
      rotation: targetRotation,
      duration: 0.3,
      ease: 'power2.inOut'
    });
    gsap.to(this.glowGraphics, {
      rotation: targetRotation,
      duration: 0.3,
      ease: 'power2.inOut'
    });
  }
  
  animateLit(lit: boolean): void {
    const targetAlpha = lit ? 1 : 0;
    gsap.to(this.glowGraphics, {
      alpha: targetAlpha,
      duration: 0.5,
      ease: 'power2.out'
    });
  }
  
  getContainer(): Container {
    return this.container;
  }
  
  destroy(): void {
    this.container.destroy({ children: true });
  }
}