import { Vector2, vec2, Matrix2x2 } from './vector';

export const identity = (): Matrix2x2 => 
  Object.freeze([[1, 0], [0, 1]]) as Matrix2x2;

export const rotationMatrix = (radians: number): Matrix2x2 => {
  const cos = Math.cos(radians);
  const sin = Math.sin(radians);
  return Object.freeze([
    [cos, -sin],
    [sin, cos]
  ]) as Matrix2x2;
};

export const quarterTurnMatrix = (k: number): Matrix2x2 => {
  const normalized = ((k % 4) + 4) % 4;
  switch (normalized) {
    case 0: return Object.freeze([[1, 0], [0, 1]]) as Matrix2x2;
    case 1: return Object.freeze([[0, -1], [1, 0]]) as Matrix2x2;
    case 2: return Object.freeze([[-1, 0], [0, -1]]) as Matrix2x2;
    case 3: return Object.freeze([[0, 1], [-1, 0]]) as Matrix2x2;
    default: throw new Error('Invalid quarter turn');
  }
};

export const matMul = (m: Matrix2x2, v: Vector2): Vector2 => 
  vec2(
    m[0][0] * v[0] + m[0][1] * v[1],
    m[1][0] * v[0] + m[1][1] * v[1]
  );

export const matrixMultiply = (a: Matrix2x2, b: Matrix2x2): Matrix2x2 => 
  Object.freeze([
    [
      a[0][0] * b[0][0] + a[0][1] * b[1][0],
      a[0][0] * b[0][1] + a[0][1] * b[1][1]
    ],
    [
      a[1][0] * b[0][0] + a[1][1] * b[1][0],
      a[1][0] * b[0][1] + a[1][1] * b[1][1]
    ]
  ]) as Matrix2x2;

export const determinant = (m: Matrix2x2): number => 
  m[0][0] * m[1][1] - m[0][1] * m[1][0];

export const inverse = (m: Matrix2x2): Matrix2x2 => {
  const det = determinant(m);
  if (Math.abs(det) < 1e-10) {
    throw new Error('Matrix is not invertible');
  }
  return Object.freeze([
    [m[1][1] / det, -m[0][1] / det],
    [-m[1][0] / det, m[0][0] / det]
  ]) as Matrix2x2;
};

export const transpose = (m: Matrix2x2): Matrix2x2 => 
  Object.freeze([
    [m[0][0], m[1][0]],
    [m[0][1], m[1][1]]
  ]) as Matrix2x2;