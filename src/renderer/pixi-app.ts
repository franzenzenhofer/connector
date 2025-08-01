import { Application, Container } from 'pixi.js';

export class PixiApp {
  private app: Application;
  private gameContainer: Container;
  private uiContainer: Container;
  private particlesContainer: Container;
  private resizeHandler: () => void;
  
  constructor() {
    this.app = new Application();
    this.gameContainer = new Container();
    this.uiContainer = new Container();
    this.particlesContainer = new Container();
    this.resizeHandler = this.handleResize.bind(this);
  }
  
  async init(canvas: HTMLCanvasElement): Promise<void> {
    await this.app.init({
      canvas,
      width: window.innerWidth,
      height: window.innerHeight,
      backgroundColor: 0x0a0a0a,
      antialias: true,
      resolution: window.devicePixelRatio || 1,
      autoDensity: true,
      powerPreference: 'high-performance',
      eventMode: 'static',
      eventFeatures: {
        move: true,
        click: true,
        wheel: false
      }
    });
    
    // Set up container hierarchy
    this.app.stage.addChild(this.gameContainer);
    this.app.stage.addChild(this.particlesContainer);
    this.app.stage.addChild(this.uiContainer);
    
    // Set up resize handler
    window.addEventListener('resize', this.resizeHandler);
    this.handleResize();
    
    // Enable interaction
    this.app.stage.eventMode = 'static';
    this.app.stage.hitArea = this.app.screen;
  }
  
  private handleResize(): void {
    const width = window.innerWidth;
    const height = window.innerHeight;
    
    this.app.renderer.resize(width, height);
    
    // Center game container
    const size = Math.min(width, height) * 0.9;
    this.gameContainer.x = (width - size) / 2;
    this.gameContainer.y = (height - size) / 2;
    
    // Update UI positions
    this.uiContainer.x = 0;
    this.uiContainer.y = 0;
  }
  
  getApp(): Application {
    return this.app;
  }
  
  getGameContainer(): Container {
    return this.gameContainer;
  }
  
  getUIContainer(): Container {
    return this.uiContainer;
  }
  
  getParticlesContainer(): Container {
    return this.particlesContainer;
  }
  
  destroy(): void {
    window.removeEventListener('resize', this.resizeHandler);
    this.app.destroy(true, { children: true, texture: true });
  }
  
  get screen() {
    return this.app.screen;
  }
  
  get ticker() {
    return this.app.ticker;
  }
  
  get renderer() {
    return this.app.renderer;
  }
}