import { Component, createComponentType } from '../ecs/types';
import { Vector2, vec2 } from '@math/vector';

export const PhysicsBodyType = createComponentType('physicsBody');

export interface PhysicsBodyComponent extends Component {
  readonly type: typeof PhysicsBodyType;
  velocity: Vector2;
  acceleration: Vector2;
  mass: number;
  friction: number;
  restitution: number;
  isStatic: boolean;
}

export const createPhysicsBody = (
  mass: number = 1,
  isStatic: boolean = false
): PhysicsBodyComponent => ({
  type: PhysicsBodyType,
  velocity: vec2(0, 0),
  acceleration: vec2(0, 0),
  mass,
  friction: 0.1,
  restitution: 0.8,
  isStatic
});