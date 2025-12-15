export interface GameMeta {
  id: string;
  name: string;
  category: string;
  offlineCapable: boolean;
}

export interface DifficultyConfig {
  level: number;
  speed: number;
  complexity: number;
  [key: string]: any;
}

export interface GameEvent {
  id: string;
  userId: string;
  gameId: string;
  sessionId: string;
  timestamp: number;
  type: 'ROUND_START' | 'ROUND_END' | 'INPUT' | 'ERROR';
  payload: Record<string, any>;
  synced: boolean;
}

export interface RoundResult {
  success: boolean;
  score: number;
  reactionTimeMs: number;
  mistakes: number;
}

export interface GameEngine {
  init(seed: number): void;
  startRound(config: DifficultyConfig): void;
  handleInput(input: any): void;
  endRound(): RoundResult;
  getState(): any;
}
