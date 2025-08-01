# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This repository contains the "Luminode" puzzle game - a mathematically precise, hardware-accelerated connection puzzle built with modern TypeScript, Vite, and cutting-edge gaming libraries.

## ⚠️ CRITICAL: NO OFFLINE PLAY OR CACHING

**ABSOLUTELY NO SERVICE WORKERS, NO OFFLINE CACHING, NO PWA FEATURES!**
- Service workers are FORBIDDEN and actively prevented
- All caches are cleared on startup
- Cache-Control headers prevent any caching
- This is an online-only game that requires fresh assets every time

## CRITICAL TECHNOLOGY REQUIREMENTS

**THIS GAME MUST BE IMPLEMENTED USING:**
- **TypeScript** - Full type safety with strict mode enabled
- **Vite** - Lightning-fast HMR and optimized builds
- **Hammer.js** - Advanced touch gestures and multi-touch support
- **Pixi.js v8** - WebGL-accelerated 2D rendering engine
- **Matter.js** - Physics engine for smooth interactions
- **GSAP** - Professional-grade animation library
- **Tone.js** - Web Audio API for spatial sound
- **Zustand** - Modern state management
- **Vitest** - Ultra-fast unit testing
- **pnpm** - Efficient package management

## 20 BEST PRACTICE DEVELOPER PARADIGMS

1. **Composition over Inheritance** - Use functional composition and mixins instead of deep class hierarchies
2. **Immutability First** - All state updates must be immutable, use Immer for complex state
3. **Pure Functions** - Side-effect free functions for all game logic calculations
4. **Dependency Injection** - All dependencies passed explicitly, no global state
5. **Single Responsibility** - Each module/class handles exactly one concern
6. **Interface Segregation** - Small, focused interfaces over large monolithic ones
7. **Reactive Programming** - RxJS for complex event streams and game loops
8. **Entity Component System (ECS)** - Decouple game objects from behavior
9. **Command Pattern** - All user actions as reversible command objects
10. **Observer Pattern** - Loose coupling between game systems via events
11. **Factory Pattern** - Centralized object creation with dependency resolution
12. **Strategy Pattern** - Swappable algorithms for AI, rendering, physics
13. **Null Object Pattern** - Eliminate null checks with default implementations
14. **Fluent Interfaces** - Chainable APIs for configuration and setup
15. **Fail Fast** - Validate inputs early and throw descriptive errors
16. **Convention over Configuration** - Sensible defaults with override capability
17. **Declarative over Imperative** - Describe what, not how
18. **Separation of Concerns** - UI, logic, data, and rendering completely isolated
19. **Test-Driven Development** - Write tests first, 100% coverage mandate
20. **Domain-Driven Design** - Game concepts modeled as first-class domain objects

## Architecture

The project follows a modular architecture with clear separation of concerns:

- **Pure mathematical functions** in `src/math/` - vector operations, rotation matrices, easing functions
- **Game logic** in `src/game/` - ECS-based game entities with no rendering dependencies  
- **Rendering pipeline** in `src/renderer/` - Pixi.js WebGL rendering with shader effects
- **Level generation** in `src/procedural/` - Wilson's algorithm with GPU acceleration
- **Physics** in `src/physics/` - Matter.js integration for realistic interactions
- **Audio** in `src/audio/` - Spatial audio with Tone.js
- **State management** in `src/state/` - Zustand stores with time-travel debugging

## Key Implementation Details

### Mathematical Precision
- All rotations use 2×2 orthonormal matrices: `R(k) = [[0,-1],[1,0]]^k`
- Light propagation uses incremental dual-graph union-find (O(α(n)) amortized per move)
- Quintic easing function: `f(u)=u³(6u²−15u+10)` with continuous 1st & 2nd derivatives
- WebGL shaders for particle effects and bloom

### Modern Tech Stack
- WebGL 2.0 with fallback to WebGL 1.0
- Web Workers for physics calculations
- WebAssembly modules for performance-critical paths
- Service Workers for offline play
- WebRTC for multiplayer support
- IndexedDB for save states

### File Structure
```
luminode/
├── index.html          # Minimal HTML entry
├── src/
│   ├── main.ts        # Application entry point
│   ├── math/          # Mathematical utilities
│   ├── game/          # Core game logic (ECS)
│   ├── renderer/      # Pixi.js rendering
│   ├── physics/       # Matter.js physics
│   ├── audio/         # Tone.js sound engine
│   ├── state/         # Zustand stores
│   ├── procedural/    # Level generation
│   ├── ui/            # React UI components
│   └── shaders/       # GLSL shader files
├── tests/             # Vitest test suites
├── public/            # Static assets
├── vite.config.ts     # Vite configuration
├── tsconfig.json      # TypeScript config
└── package.json       # Dependencies
```

## Development Commands

```bash
pnpm install          # Install dependencies
pnpm dev             # Start dev server with HMR
pnpm build           # Production build
pnpm test            # Run test suite
pnpm test:ui         # Run tests with UI
pnpm lint            # ESLint + Prettier
pnpm type-check      # TypeScript validation
```

## Performance Targets

- 144 FPS on high-end devices
- 60 FPS on mid-range mobile
- < 3MB initial bundle size
- < 100ms interaction latency
- WebGL instanced rendering for 10,000+ objects

## Code Quality Requirements

### Linting and Type Checking
- **EVERY FILE MUST PASS LINTING** - Zero errors, zero warnings allowed
- **EVERY FILE MUST PASS TYPE CHECKING** - Full TypeScript strict mode compliance
- **AUTOMATIC ENFORCEMENT** - `pnpm dev` and `pnpm build` automatically run linting and type checking first
- **NO DEVELOPMENT WITHOUT CLEAN CODE** - The dev server will NOT start if there are ANY errors or warnings
- Run `pnpm lint` before ANY commit - must pass with 0 warnings
- Run `pnpm type-check` before ANY commit - must pass with no errors
- Run `pnpm check-all` to run both lint and type-check
- ESLint and Prettier configs are non-negotiable standards

### Test Coverage Requirements
- **MINIMUM 90% TEST COVERAGE** for all logic files
- **100% TEST COVERAGE MANDATORY** for:
  - Math utilities (src/math/*)
  - Game logic and systems (src/game/*)
  - Level generation algorithms (src/procedural/*)
  - State management (src/state/*)
  - ECS core functionality
- **EVERY GAME FLOW MUST BE TESTED**:
  - Win conditions
  - Level transitions
  - User interactions
  - State changes
  - Error handling
- Integration tests for full game scenarios
- Performance benchmarks for critical paths
- Visual regression tests for rendering

### Testing Best Practices
- Write tests BEFORE implementation (TDD)
- Each test should have clear arrange/act/assert structure
- Use descriptive test names that explain the scenario
- Mock external dependencies properly
- Test edge cases and error conditions
- Maintain test fixtures in tests/fixtures/
- Run `pnpm test` continuously during development
- Use `pnpm test:ui` for interactive debugging

## Package Management Requirements

### ALWAYS USE LATEST PACKAGES
- **ALL PACKAGES MUST BE ON LATEST STABLE VERSION**
- Run `pnpm update --latest` regularly
- Never use deprecated packages
- Update all dependencies before starting any new feature
- Check for updates with `pnpm outdated`
- Security vulnerabilities must be fixed immediately with `pnpm audit --fix`
- Breaking changes must be addressed when updating
- Keep package.json versions unpinned (use ^ for minor updates)

## Error Logging Requirements

### UNIFIED ERROR LOGGING
- **ALL ERRORS MUST BE LOGGED TO TERMINAL** when running `pnpm dev`
- Frontend (browser) errors are automatically sent to backend and logged
- Backend errors are logged directly to console
- WebSocket errors are captured and logged
- Unhandled promise rejections are caught and logged
- Runtime errors include full stack traces
- Console errors are intercepted and logged

### Error Reporting Features
- Custom Vite plugin captures all client-side errors
- Global error handlers for uncaught exceptions
- Error reporter utility (`src/utils/error-reporter.ts`) for consistent logging
- All errors include timestamp, context, and stack trace
- Errors are formatted with emojis for easy visibility
- Development server runs with `clearScreen: false` to preserve error history

### Running with Error Logging
```bash
pnpm dev          # Standard dev server with error logging
pnpm dev:verbose  # Debug mode with verbose logging
```