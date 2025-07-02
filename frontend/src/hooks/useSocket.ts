import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { Lobby } from '../types';

export function useSocket() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [currentLobby, setCurrentLobby] = useState<Lobby | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const socketUrl = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3000';
    const newSocket = io(socketUrl, {
      transports: ['websocket'],
      path: '/socket.io'
    });

    newSocket.on('connect', () => {
      setIsConnected(true);
      setError(null);
      console.log('Connected to server');
    });

    newSocket.on('disconnect', () => {
      setIsConnected(false);
      console.log('Disconnected from server');
    });

    newSocket.on('error', (error) => {
      setError(error.message);
      console.error('Socket error:', error);
    });

    newSocket.on('lobby-joined', (lobby: Lobby) => {
      setCurrentLobby(lobby);
      setError(null);
    });

    newSocket.on('lobby-updated', (lobby: Lobby) => {
      setCurrentLobby(lobby);
    });

    newSocket.on('player-joined', (lobby: Lobby) => {
      setCurrentLobby(lobby);
    });

    newSocket.on('player-left', (lobby: Lobby) => {
      setCurrentLobby(lobby);
    });

    newSocket.on('game-started', (lobby: Lobby) => {
      setCurrentLobby(lobby);
    });

    newSocket.on('round-ended', (lobby: Lobby) => {
      setCurrentLobby(lobby);
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  const joinLobby = (lobbyId: string, playerName: string) => {
    if (socket && socket.connected) {
      socket.emit('join-lobby', { lobbyId, playerName });
    } else {
      console.error('Socket not connected');
      setError('Not connected to server');
    }
  };

  const toggleReady = (lobbyId: string) => {
    if (socket && socket.connected) {
      socket.emit('toggle-ready', { lobbyId });
    }
  };

  const startGame = (lobbyId: string) => {
    if (socket && socket.connected) {
      socket.emit('start-game', { lobbyId });
    }
  };

  const endRound = (lobbyId: string, spyWon: boolean) => {
    if (socket && socket.connected) {
      socket.emit('end-round', { lobbyId, spyWon });
    }
  };

  return {
    socket,
    isConnected,
    currentLobby,
    error,
    joinLobby,
    toggleReady,
    startGame,
    endRound
  };
} 