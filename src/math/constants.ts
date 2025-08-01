export const TAU = 2 * Math.PI;
export const HALF_PI = Math.PI / 2;
export const QUARTER_PI = Math.PI / 4;

export const DEG_TO_RAD = Math.PI / 180;
export const RAD_TO_DEG = 180 / Math.PI;

export const EPSILON = 1e-10;
export const GOLDEN_RATIO = (1 + Math.sqrt(5)) / 2;

export enum Direction {
  North = 0,
  East = 1,
  South = 2,
  West = 3
}

export const DIRECTION_VECTORS = Object.freeze([
  Object.freeze([0, -1]), // North
  Object.freeze([1, 0]),  // East
  Object.freeze([0, 1]),  // South
  Object.freeze([-1, 0])  // West
]) as readonly (readonly [number, number])[];

export const DIRECTION_MASKS = Object.freeze([
  1 << Direction.North,
  1 << Direction.East,
  1 << Direction.South,
  1 << Direction.West
]) as readonly number[];

export const oppositeDirection = (dir: Direction): Direction => 
  (dir + 2) % 4;

export const rotateDirection = (dir: Direction, quarterTurns: number): Direction => 
  ((dir + quarterTurns) % 4 + 4) % 4;

export const directionToAngle = (dir: Direction): number => 
  dir * HALF_PI;

export const angleToDirection = (angle: number): Direction => {
  const normalized = ((angle % TAU) + TAU) % TAU;
  const segment = Math.round(normalized / HALF_PI) % 4;
  return segment as Direction;
};