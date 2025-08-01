import { Component, createComponentType } from '../ecs/types';
import { Vector2, vec2 } from '@math/vector';

export const TransformType = createComponentType('transform');

export interface TransformComponent extends Component {
  readonly type: typeof TransformType;
  position: Vector2;
  rotation: number;
  scale: Vector2;
}

export const createTransform = (
  position: Vector2 = vec2(0, 0),
  rotation: number = 0,
  scale: Vector2 = vec2(1, 1)
): TransformComponent => ({
  type: TransformType,
  position,
  rotation,
  scale
});