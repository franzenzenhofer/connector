/**
 * Color palette for the game
 */
export const COLORS = {
  // Tile colors
  TILE_FILL_LIT: 0x152525,
  TILE_FILL_UNLIT: 0x1a1a1a,
  TILE_STROKE_LIT: 0x00ffff,
  TILE_STROKE_UNLIT: 0x444444,
  
  // Path colors
  PATH_LIT: 0x77ffff,
  PATH_UNLIT: 0x555555,
  PATH_GLOW: 0x00ffff,
  
  // Symbol colors
  SYMBOL_LIT: 0xccffff,
  SYMBOL_UNLIT: 0x00aaff,
  
  // Board colors
  BOARD_BACKGROUND: 0x0a0a0a,
  BOARD_GRID: 0x222222,
  
  // UI colors
  UI_BACKGROUND: 0x1a1a1a,
  UI_TEXT: 0xffffff,
  UI_ACCENT: 0x00ffff,
} as const;

/**
 * Size ratios for consistent scaling
 */
export const SIZES = {
  TILE_CORNER_RADIUS: 0.1,
  PATH_WIDTH: 0.25,
  PATH_LENGTH: 0.45,
  GLOW_WIDTH_MULTIPLIER: 1.5,
  SYMBOL_SIZE: 0.4,
  STROKE_WIDTH: 2,
} as const;

/**
 * Animation durations in seconds
 */
export const DURATIONS = {
  ROTATION: 0.3,
  LIGHT_FADE: 0.5,
  TILE_SPAWN: 0.4,
  WIN_ANIMATION: 1.0,
} as const;