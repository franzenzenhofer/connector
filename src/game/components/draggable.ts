import { Component, createComponentType } from '../ecs/types';
import { Vector2 } from '@math/vector';

export const DraggableType = createComponentType('draggable');

export interface DraggableComponent extends Component {
  readonly type: typeof DraggableType;
  isDragging: boolean;
  dragOffset: Vector2 | null;
  canRotate: boolean;
  canMove: boolean;
}

export const createDraggable = (
  canRotate: boolean = true,
  canMove: boolean = true
): DraggableComponent => ({
  type: DraggableType,
  isDragging: false,
  dragOffset: null,
  canRotate,
  canMove
});