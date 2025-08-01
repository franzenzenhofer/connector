import { ECSWorld, World } from './ecs';
import { generateLevel, shuffleTiles } from '@procedural/level-generator';
import { 
  createTile, 
  createTransform, 
  createDraggable
} from './components';
import { vec2 } from '@math/vector';
import { LightPropagationSystem, InputSystem, RenderSystem } from './systems';
import { PixiApp, BoardRenderer } from '../renderer';
import { useGameStore, GameState } from '@state/game-store';

export class Game {
  private world: World;
  private pixiApp: PixiApp;
  private boardRenderer: BoardRenderer;
  private inputSystem: InputSystem;
  private animationFrameId: number | null = null;
  private lastTime = 0;
  
  constructor() {
    this.world = new ECSWorld();
    this.pixiApp = new PixiApp();
    this.boardRenderer = new BoardRenderer(8, 600); // Default size
    
    // Make world and renderers globally accessible for systems
    window.__world = this.world;
    window.__boardRenderer = this.boardRenderer;
    window.__gameStore = useGameStore.getState();
    window.__tileSize = 75;
    window.__boardSize = 8;
    
    // Create input system (will be initialized after canvas is ready)
    this.inputSystem = new InputSystem(document.body);
  }
  
  async init(canvas: HTMLCanvasElement): Promise<void> {
    // Initialize Pixi
    await this.pixiApp.init(canvas);
    
    // Add board to game container
    this.pixiApp.getGameContainer().addChild(this.boardRenderer.getContainer());
    
    // Register systems
    this.world.registerSystem(new LightPropagationSystem());
    this.world.registerSystem(this.inputSystem);
    this.world.registerSystem(new RenderSystem(this.boardRenderer));
    
    // Set up game
    this.setupLevel(1);
    
    // Start game loop
    this.start();
    
    // Update game state
    useGameStore.getState().setGameState(GameState.Playing);
  }
  
  private setupLevel(_levelNumber: number): void {
    // Clear existing entities
    const entities = this.world.query({ required: [] });
    for (const entity of entities) {
      this.world.destroyEntity(entity);
    }
    
    // Generate level
    const level = generateLevel(8);
    const shuffled = shuffleTiles(level);
    
    // Update store with board info
    useGameStore.getState().setBoardInfo(level.size, level.source, level.target);
    
    // Create entities for tiles
    for (const levelTile of shuffled.tiles) {
      const entity = this.world.createEntity();
      
      // Add tile component
      const tile = createTile(
        levelTile.kind,
        levelTile.position[0],
        levelTile.position[1],
        levelTile.rotation
      );
      this.world.addComponent(entity, tile);
      
      // Add transform component
      const transform = createTransform(
        vec2(levelTile.position[0] * 75, levelTile.position[1] * 75),
        0,
        vec2(1, 1)
      );
      this.world.addComponent(entity, transform);
      
      // Add draggable component for moveable tiles
      if (levelTile.kind !== 'source' && levelTile.kind !== 'target') {
        const draggable = createDraggable(true, true);
        this.world.addComponent(entity, draggable);
      }
    }
    
    // Run initial light propagation
    this.world.update(0);
  }
  
  private start(): void {
    const gameLoop = (currentTime: number) => {
      const deltaTime = (currentTime - this.lastTime) / 1000;
      this.lastTime = currentTime;
      
      // Update game store time
      const store = useGameStore.getState();
      if (store.gameState === GameState.Playing) {
        store.updateTimeElapsed(deltaTime);
      }
      
      // Update world
      this.world.update(deltaTime);
      
      // Check win condition
      if (store.isConnected && store.gameState === GameState.Playing) {
        this.handleWin();
      }
      
      this.animationFrameId = requestAnimationFrame(gameLoop);
    };
    
    this.animationFrameId = requestAnimationFrame(gameLoop);
  }
  
  private handleWin(): void {
    const store = useGameStore.getState();
    store.setLevelComplete();
    
    // Show win animation
    setTimeout(() => {
      store.nextLevel();
      this.setupLevel(store.currentLevel);
    }, 2000);
  }
  
  reset(): void {
    const store = useGameStore.getState();
    store.resetLevel();
    this.setupLevel(store.currentLevel);
  }
  
  destroy(): void {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
    }
    
    this.inputSystem.destroy();
    this.boardRenderer.destroy();
    this.pixiApp.destroy();
  }
}