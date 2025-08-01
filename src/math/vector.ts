export type Vector2 = readonly [number, number];
export type Matrix2x2 = readonly [readonly [number, number], readonly [number, number]];

/**
 * Creates an immutable 2D vector
 */
export const vec2 = (x: number, y: number): Vector2 => Object.freeze([x, y]) as Vector2;

/**
 * Adds two vectors: a + b
 */
export const add = (a: Vector2, b: Vector2): Vector2 => 
  vec2(a[0] + b[0], a[1] + b[1]);

export const sub = (a: Vector2, b: Vector2): Vector2 => 
  vec2(a[0] - b[0], a[1] - b[1]);

export const mul = (v: Vector2, scalar: number): Vector2 => 
  vec2(v[0] * scalar, v[1] * scalar);

export const div = (v: Vector2, scalar: number): Vector2 => {
  if (scalar === 0) throw new Error('Division by zero');
  return vec2(v[0] / scalar, v[1] / scalar);
};

export const dot = (a: Vector2, b: Vector2): number => 
  a[0] * b[0] + a[1] * b[1];

export const length = (v: Vector2): number => 
  Math.sqrt(v[0] * v[0] + v[1] * v[1]);

/**
 * Normalizes a vector to unit length
 */
export const normalize = (v: Vector2): Vector2 => {
  const len = length(v);
  return len === 0 ? vec2(0, 0) : div(v, len);
};

export const distance = (a: Vector2, b: Vector2): number => 
  length(sub(b, a));

export const lerp = (a: Vector2, b: Vector2, t: number): Vector2 => 
  add(mul(a, 1 - t), mul(b, t));

export const equal = (a: Vector2, b: Vector2, epsilon = 1e-10): boolean => 
  Math.abs(a[0] - b[0]) < epsilon && Math.abs(a[1] - b[1]) < epsilon;

export const angle = (v: Vector2): number => 
  Math.atan2(v[1], v[0]);

/**
 * Rotates a vector by the given angle in radians
 */
export const rotate = (v: Vector2, radians: number): Vector2 => {
  const cos = Math.cos(radians);
  const sin = Math.sin(radians);
  return vec2(
    v[0] * cos - v[1] * sin,
    v[0] * sin + v[1] * cos
  );
};

export const perpendicular = (v: Vector2): Vector2 => 
  vec2(-v[1], v[0]);

export const reflect = (v: Vector2, normal: Vector2): Vector2 => {
  const n = normalize(normal);
  return sub(v, mul(n, 2 * dot(v, n)));
};

export const clamp = (v: Vector2, min: Vector2, max: Vector2): Vector2 => 
  vec2(
    Math.max(min[0], Math.min(max[0], v[0])),
    Math.max(min[1], Math.min(max[1], v[1]))
  );

export const manhattanDistance = (a: Vector2, b: Vector2): number => 
  Math.abs(b[0] - a[0]) + Math.abs(b[1] - a[1]);