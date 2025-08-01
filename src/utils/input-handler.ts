import Hammer from 'hammerjs';

export interface InputHandlerOptions {
  onTap?: (x: number, y: number) => void;
  onDragStart?: (x: number, y: number) => void;
  onDragMove?: (x: number, y: number, deltaX: number, deltaY: number) => void;
  onDragEnd?: (x: number, y: number) => void;
}

/**
 * Simplified input handler for touch and mouse events
 */
export class InputHandler {
  private hammer: HammerManager;
  
  constructor(element: HTMLElement, options: InputHandlerOptions) {
    this.hammer = new Hammer(element);
    
    // Configure recognizers
    this.hammer.get('pan').set({ direction: Hammer.DIRECTION_ALL });
    this.hammer.get('tap').set({ time: 250 });
    
    // Set up event handlers
    if (options.onTap) {
      this.hammer.on('tap', (e) => {
        options.onTap!(e.center.x, e.center.y);
      });
    }
    
    if (options.onDragStart) {
      this.hammer.on('panstart', (e) => {
        options.onDragStart!(e.center.x, e.center.y);
      });
    }
    
    if (options.onDragMove) {
      this.hammer.on('panmove', (e) => {
        options.onDragMove!(e.center.x, e.center.y, e.deltaX, e.deltaY);
      });
    }
    
    if (options.onDragEnd) {
      this.hammer.on('panend', (e) => {
        options.onDragEnd!(e.center.x, e.center.y);
      });
    }
  }
  
  destroy(): void {
    this.hammer.destroy();
  }
}