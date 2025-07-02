export interface Player {
  id: string;
  name: string;
  isSpy: boolean;
  location?: string;
  role?: string;
  isHost: boolean;
  isReady: boolean;
}

export interface Lobby {
  id: string;
  players: Player[];
  gameState: 'waiting' | 'playing' | 'voting' | 'ended';
  currentRound: number;
  maxRounds: number;
  spyWins: number;
  resistanceWins: number;
  currentLocation?: string;
  timeRemaining?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface GameSettings {
  maxRounds: number;
  roundTime: number;
  votingTime: number;
} 