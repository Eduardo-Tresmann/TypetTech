/**
 * Tipos principais do sistema de digitação
 */

export type Difficulty = 'easy' | 'medium' | 'hard';

export type Theme = 'dark' | 'light' | 'monokai' | 'ocean' | 'forest';

export interface GameConfig {
  difficulty: Difficulty;
  duration: number;
  theme: Theme;
  soundEnabled: boolean; // Mantido para compatibilidade
  typingSoundEnabled: boolean;
  interfaceSoundEnabled: boolean;
  typingVolume: number; // 0.0 a 1.0
  interfaceVolume: number; // 0.0 a 1.0
}

export interface TypingStats {
  wpm: number;
  accuracy: number;
  correctLetters: number;
  incorrectLetters: number;
  totalTime: number;
}

export interface TextGeneratorConfig {
  wordCount: number;
  difficulty: Difficulty;
}
