export enum GamePhase {
  SETUP = 'SETUP',
  REVEAL = 'REVEAL',
  DISCUSS = 'DISCUSS',
  VOTE = 'VOTE',
  RESULT = 'RESULT'
}

export interface WordCategory {
  id: string;
  name: string;
  words: string[];
  isCustom: boolean;
}

export interface Player {
  id: string;
  name: string;
  isImpostor: boolean;
  isHost: boolean; // New property
  voteCount: number;
}

export interface GameConfig {
  impostorCount: number;
  timeLimitSeconds: number; // 0 for no limit
}

export interface GameState {
  phase: GamePhase;
  players: Player[];
  currentCategory: WordCategory | null;
  secretWord: string;
  currentPlayerIndex: number; // For the reveal phase
  config: GameConfig;
  winner: 'impostor' | 'citizens' | null;
}