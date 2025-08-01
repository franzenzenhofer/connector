import { Graphics } from 'pixi.js';

/**
 * Factory for creating styled Graphics objects
 */
export const createGraphics = (
  fillColor?: number,
  strokeColor?: number,
  strokeWidth = 0
): Graphics => {
  const graphics = new Graphics();
  
  if (fillColor !== undefined) {
    graphics.fill({ color: fillColor });
  }
  
  if (strokeColor !== undefined && strokeWidth > 0) {
    graphics.stroke({ color: strokeColor, width: strokeWidth });
  }
  
  return graphics;
};

/**
 * Creates a rounded rectangle
 */
export const drawRoundedRect = (
  graphics: Graphics,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
): Graphics => {
  return graphics.roundRect(x, y, width, height, radius);
};

/**
 * Creates a circle
 */
export const drawCircle = (
  graphics: Graphics,
  x: number,
  y: number,
  radius: number
): Graphics => {
  return graphics.circle(x, y, radius);
};

/**
 * Creates a rectangle  
 */
export const drawRect = (
  graphics: Graphics,
  x: number,
  y: number,
  width: number,
  height: number
): Graphics => {
  return graphics.rect(x, y, width, height);
};