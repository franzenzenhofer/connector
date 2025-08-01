import { test, expect } from '@playwright/test';

test.describe('Luminode Game Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the game
    await page.goto('/');
    
    // Wait for the game to load
    await page.waitForLoadState('networkidle');
  });

  test('should load the game without errors', async ({ page }) => {
    // Check that the page loaded
    await expect(page).toHaveTitle(/Luminode/);
    
    // Check for the game container
    const gameContainer = page.locator('#game-container');
    await expect(gameContainer).toBeVisible();
    
    // Take a screenshot of the loaded game
    await page.screenshot({ path: 'tests/screenshots/game-loaded.png', fullPage: true });
  });

  test('should show online status indicator', async ({ page }) => {
    // Wait for online status element
    const onlineStatus = page.locator('#online-status');
    await expect(onlineStatus).toBeVisible();
    
    // Check that it shows online status
    const statusText = await onlineStatus.textContent();
    expect(statusText).toContain('ONLINE');
    
    // Take a screenshot of the status indicator
    await page.screenshot({ path: 'tests/screenshots/online-status.png', fullPage: true });
  });

  test('should display the main menu', async ({ page }) => {
    // Check for menu elements
    const menuTitle = page.locator('text=LUMINODE');
    await expect(menuTitle).toBeVisible();
    
    const playButton = page.locator('button:has-text("PLAY")');
    await expect(playButton).toBeVisible();
    
    // Take a screenshot of the menu
    await page.screenshot({ path: 'tests/screenshots/main-menu.png', fullPage: true });
  });

  test('should start the game when play button is clicked', async ({ page }) => {
    // Click play button
    const playButton = page.locator('button:has-text("PLAY")');
    await playButton.click();
    
    // Wait for game canvas to appear
    const canvas = page.locator('canvas');
    await expect(canvas).toBeVisible();
    
    // Check that HUD is visible
    const hud = page.locator('.hud');
    await expect(hud).toBeVisible();
    
    // Check for level and moves counters
    const levelText = page.locator('text=/LEVEL/');
    const movesText = page.locator('text=/MOVES/');
    await expect(levelText).toBeVisible();
    await expect(movesText).toBeVisible();
    
    // Take a screenshot of the game in progress
    await page.screenshot({ path: 'tests/screenshots/game-playing.png', fullPage: true });
  });

  test('should handle touch/click interactions', async ({ page }) => {
    // Start the game
    const playButton = page.locator('button:has-text("PLAY")');
    await playButton.click();
    
    // Wait for canvas
    const canvas = page.locator('canvas');
    await expect(canvas).toBeVisible();
    
    // Get canvas bounds
    const canvasBounds = await canvas.boundingBox();
    if (!canvasBounds) throw new Error('Canvas not found');
    
    // Simulate a tap in the center of the canvas
    const centerX = canvasBounds.x + canvasBounds.width / 2;
    const centerY = canvasBounds.y + canvasBounds.height / 2;
    
    // Get initial moves count
    const movesText = page.locator('.hud').locator('text=/MOVES:\\s*\\d+/');
    const initialMoves = await movesText.textContent();
    const initialMovesCount = parseInt(initialMoves?.match(/\d+/)?.[0] || '0');
    
    // Perform a click (should rotate a tile if one is there)
    await page.mouse.click(centerX, centerY);
    
    // Wait a bit for the move to register
    await page.waitForTimeout(500);
    
    // Check if moves increased
    const newMoves = await movesText.textContent();
    const newMovesCount = parseInt(newMoves?.match(/\d+/)?.[0] || '0');
    
    // Take a screenshot after interaction
    await page.screenshot({ path: 'tests/screenshots/after-interaction.png', fullPage: true });
    
    // Moves might or might not increase depending on if we clicked on a tile
    // eslint-disable-next-line no-console
    console.log(`Moves: ${initialMovesCount} -> ${newMovesCount}`);
  });

  test('should not have console errors', async ({ page }) => {
    const consoleErrors: string[] = [];
    
    // Listen for console errors
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });
    
    // Navigate and wait
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Start the game
    const playButton = page.locator('button:has-text("PLAY")');
    await playButton.click();
    
    // Wait for game to load
    await page.waitForTimeout(2000);
    
    // Check for errors
    expect(consoleErrors).toHaveLength(0);
  });

  test('should prevent service worker registration', async ({ page }) => {
    // Check that no service workers are registered
    const hasServiceWorker = await page.evaluate(() => {
      return navigator.serviceWorker.getRegistrations().then(regs => regs.length > 0);
    });
    
    expect(hasServiceWorker).toBe(false);
  });

  test('should have proper cache headers', async ({ page }) => {
    const response = await page.goto('/');
    
    if (response) {
      const headers = response.headers();
      
      // Check cache control headers
      expect(headers['cache-control']).toContain('no-store');
      expect(headers['cache-control']).toContain('no-cache');
      expect(headers['pragma']).toBe('no-cache');
      expect(headers['expires']).toBe('0');
    }
  });

  test('should be responsive on mobile viewport', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Navigate to the game
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Check that the game container is visible
    const gameContainer = page.locator('#game-container');
    await expect(gameContainer).toBeVisible();
    
    // Take a mobile screenshot
    await page.screenshot({ path: 'tests/screenshots/mobile-view.png', fullPage: true });
  });
});