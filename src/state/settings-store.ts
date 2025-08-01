import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface SettingsStore {
  // Audio settings
  masterVolume: number;
  sfxVolume: number;
  musicVolume: number;
  audioEnabled: boolean;
  
  // Visual settings
  particlesEnabled: boolean;
  bloomEnabled: boolean;
  showFPS: boolean;
  theme: 'dark' | 'light' | 'system';
  
  // Gameplay settings
  difficulty: 'easy' | 'normal' | 'hard';
  showHints: boolean;
  vibrationEnabled: boolean;
  
  // Actions
  setMasterVolume: (volume: number) => void;
  setSfxVolume: (volume: number) => void;
  setMusicVolume: (volume: number) => void;
  toggleAudio: () => void;
  toggleParticles: () => void;
  toggleBloom: () => void;
  toggleFPS: () => void;
  setTheme: (theme: 'dark' | 'light' | 'system') => void;
  setDifficulty: (difficulty: 'easy' | 'normal' | 'hard') => void;
  toggleHints: () => void;
  toggleVibration: () => void;
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      // Initial state
      masterVolume: 0.7,
      sfxVolume: 0.8,
      musicVolume: 0.5,
      audioEnabled: true,
      particlesEnabled: true,
      bloomEnabled: true,
      showFPS: false,
      theme: 'dark',
      difficulty: 'normal',
      showHints: true,
      vibrationEnabled: true,
      
      // Actions
      setMasterVolume: (volume) => set({ masterVolume: Math.max(0, Math.min(1, volume)) }),
      setSfxVolume: (volume) => set({ sfxVolume: Math.max(0, Math.min(1, volume)) }),
      setMusicVolume: (volume) => set({ musicVolume: Math.max(0, Math.min(1, volume)) }),
      toggleAudio: () => set((state) => ({ audioEnabled: !state.audioEnabled })),
      toggleParticles: () => set((state) => ({ particlesEnabled: !state.particlesEnabled })),
      toggleBloom: () => set((state) => ({ bloomEnabled: !state.bloomEnabled })),
      toggleFPS: () => set((state) => ({ showFPS: !state.showFPS })),
      setTheme: (theme) => set({ theme }),
      setDifficulty: (difficulty) => set({ difficulty }),
      toggleHints: () => set((state) => ({ showHints: !state.showHints })),
      toggleVibration: () => set((state) => ({ vibrationEnabled: !state.vibrationEnabled }))
    }),
    {
      name: 'luminode-settings'
    }
  )
);