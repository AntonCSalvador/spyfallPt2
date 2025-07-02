import { Lobby, Player } from './types';
import { getRandomLocation } from './locationPacks';

export function createLobby(lobbyId: string, hostPlayer: Player): Lobby {
  return {
    id: lobbyId,
    players: [hostPlayer],
    gameState: 'waiting',
    currentRound: 0,
    maxRounds: 3,
    spyWins: 0,
    resistanceWins: 0,
    createdAt: new Date(),
    updatedAt: new Date()
  };
}

export function addPlayerToLobby(lobby: Lobby, player: Player): Lobby {
  return {
    ...lobby,
    players: [...lobby.players, player],
    updatedAt: new Date()
  };
}

export function removePlayerFromLobby(lobby: Lobby, playerId: string): Lobby {
  const updatedPlayers = lobby.players.filter(p => p.id !== playerId);
  
  // If no players left, return lobby as is (will be cleaned up later)
  if (updatedPlayers.length === 0) {
    return {
      ...lobby,
      players: updatedPlayers,
      updatedAt: new Date()
    };
  }

  // If host left, make the first remaining player the new host
  const newPlayers = updatedPlayers.map((player, index) => ({
    ...player,
    isHost: index === 0
  }));

  return {
    ...lobby,
    players: newPlayers,
    updatedAt: new Date()
  };
}

export function startGame(lobby: Lobby): Lobby {
  const { location, roles } = getRandomLocation();
  const shuffledRoles = [...roles].sort(() => Math.random() - 0.5);
  const spyIndex = Math.floor(Math.random() * lobby.players.length);
  
  const updatedPlayers = lobby.players.map((player, index) => ({
    ...player,
    isSpy: index === spyIndex,
    location: index === spyIndex ? undefined : location,
    role: index === spyIndex ? undefined : shuffledRoles[index],
    isReady: false
  }));

  return {
    ...lobby,
    players: updatedPlayers,
    gameState: 'playing',
    currentRound: 1,
    currentLocation: location,
    timeRemaining: 480, // 8 minutes
    updatedAt: new Date()
  };
}

export function endRound(lobby: Lobby, spyWon: boolean): Lobby {
  const newSpyWins = spyWon ? lobby.spyWins + 1 : lobby.spyWins;
  const newResistanceWins = spyWon ? lobby.resistanceWins : lobby.resistanceWins + 1;
  const isGameOver = newSpyWins > lobby.maxRounds / 2 || newResistanceWins > lobby.maxRounds / 2;

  return {
    ...lobby,
    spyWins: newSpyWins,
    resistanceWins: newResistanceWins,
    gameState: isGameOver ? 'ended' : 'waiting',
    currentRound: isGameOver ? lobby.currentRound : lobby.currentRound + 1,
    currentLocation: undefined,
    timeRemaining: undefined,
    players: lobby.players.map(player => ({
      ...player,
      isSpy: false,
      location: undefined,
      role: undefined,
      isReady: false
    })),
    updatedAt: new Date()
  };
}

export function togglePlayerReady(lobby: Lobby, playerId: string): Lobby {
  return {
    ...lobby,
    players: lobby.players.map(player => 
      player.id === playerId 
        ? { ...player, isReady: !player.isReady }
        : player
    ),
    updatedAt: new Date()
  };
}

export function canStartGame(lobby: Lobby): boolean {
  return lobby.players.length >= 3 && lobby.players.length <= 8 && 
         lobby.players.every(player => player.isReady);
}

export function getSpyPlayer(lobby: Lobby): Player | undefined {
  return lobby.players.find(player => player.isSpy);
}

export function getResistancePlayers(lobby: Lobby): Player[] {
  return lobby.players.filter(player => !player.isSpy);
} 