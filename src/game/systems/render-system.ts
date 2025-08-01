import { System, World } from '@game/ecs/types';
import { BoardRenderer } from '@renderer/board-renderer';

export class RenderSystem implements System {
  readonly name = 'Render';
  readonly priority = 100; // Run last
  
  constructor(private boardRenderer: BoardRenderer) {}
  
  update(world: World, _deltaTime: number): void {
    this.boardRenderer.update(world);
  }
}