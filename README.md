# Luminode 🔮

A mathematically precise, hardware-accelerated connection puzzle game built with modern web technologies.

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)
![WebGL](https://img.shields.io/badge/WebGL-990000?style=for-the-badge&logo=webgl&logoColor=white)

## 🎮 Game Overview

Luminode is a puzzle game where players connect tiles to create paths of light. Built with cutting-edge web technologies, it features:

- **Hardware-accelerated rendering** with Pixi.js v8 and WebGL
- **Realistic physics** powered by Matter.js
- **Smooth animations** using GSAP
- **Spatial audio** with Tone.js
- **Procedural level generation** using Wilson's algorithm
- **Offline play support** with Service Workers

## 🚀 Quick Start

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Run tests
pnpm test
```

## 🛠️ Tech Stack

- **TypeScript** - Type-safe development with strict mode
- **Vite** - Lightning-fast HMR and optimized builds
- **Pixi.js v8** - WebGL 2D rendering engine
- **Matter.js** - 2D physics engine
- **GSAP** - Professional animation library
- **Tone.js** - Web Audio API wrapper
- **Zustand** - State management
- **Vitest** - Unit testing framework
- **Playwright** - E2E testing

## 📁 Project Structure

```
luminode/
├── src/
│   ├── game/           # Core game logic (ECS)
│   ├── math/           # Mathematical utilities
│   ├── renderer/       # Pixi.js rendering
│   ├── physics/        # Matter.js integration
│   ├── procedural/     # Level generation
│   ├── state/          # Zustand stores
│   ├── ui/             # React UI components
│   └── utils/          # Utilities
├── tests/              # Test suites
├── public/             # Static assets
└── index.html          # Entry point
```

## 🎯 Development Principles

### DRY (Don't Repeat Yourself)
- Reusable components and utilities
- Shared constants and configurations
- Generic systems for common patterns

### KISS (Keep It Simple, Stupid)
- Clear, readable code over clever tricks
- Minimal dependencies
- Straightforward architecture

### Performance First
- 144 FPS target on high-end devices
- 60 FPS on mobile
- < 3MB initial bundle
- < 100ms interaction latency

## 🧮 Mathematical Foundation

The game uses precise mathematical models:

- **Rotations**: 2×2 orthonormal matrices `R(k) = [[0,-1],[1,0]]^k`
- **Light propagation**: Incremental dual-graph union-find O(α(n))
- **Easing**: Quintic function `f(u)=u³(6u²−15u+10)`

## 🎨 Features

### Core Gameplay
- Drag and rotate tiles to connect paths
- Dynamic light propagation system
- Progressive difficulty with procedural levels
- Win detection and level transitions

### Technical Features
- WebGL 2.0 with WebGL 1.0 fallback
- Multi-touch support with Hammer.js
- Offline play with Service Workers
- Responsive design for all devices
- Hardware-accelerated particle effects

## 📝 Scripts

```bash
pnpm dev          # Start dev server
pnpm build        # Production build
pnpm preview      # Preview production build
pnpm test         # Run tests
pnpm test:ui      # Run tests with UI
pnpm lint         # ESLint + Prettier
pnpm type-check   # TypeScript validation
pnpm check-all    # Run all checks
```

## 🔧 Configuration

### Development
- Hot Module Replacement (HMR) enabled
- Source maps for debugging
- Error reporting to console
- Auto-open browser

### Production
- Minified and optimized bundles
- Tree-shaking enabled
- Code splitting
- Asset optimization

## 🧪 Testing

The project maintains high test coverage:
- Unit tests for all game logic
- Integration tests for game flows
- Performance benchmarks
- Visual regression tests

Run tests with:
```bash
pnpm test         # Headless
pnpm test:ui      # With UI
pnpm test:e2e     # E2E tests
```

## 📦 Dependencies

All packages are kept up-to-date with latest stable versions. Key dependencies:

- `pixi.js@8.x` - WebGL rendering
- `matter-js@0.x` - Physics engine
- `gsap@3.x` - Animations
- `tone@15.x` - Audio engine
- `zustand@5.x` - State management
- `hammerjs@2.x` - Touch gestures

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing`)
3. Ensure all tests pass (`pnpm check-all`)
4. Commit your changes (`git commit -m 'Add amazing feature'`)
5. Push to the branch (`git push origin feature/amazing`)
6. Open a Pull Request

## 📄 License

MIT License - see LICENSE file for details

## 🙏 Acknowledgments

Built with modern web technologies and best practices for performance and maintainability.

---

**Play now at**: [Coming Soon]