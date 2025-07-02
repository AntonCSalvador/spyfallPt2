import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';
import { initDatabase, getLobby, saveLobby, deleteLobby, getAllLobbies } from './db';
import { createLobby, addPlayerToLobby, removePlayerFromLobby, startGame, endRound, togglePlayerReady, canStartGame } from './gameLogic';
import { Player, Lobby } from './types';

const app = express();
const httpServer = createServer(app);

// CORS configuration for Railway + Vercel setup
const ORIGIN = process.env.CLIENT_ORIGIN || "*";
app.use(cors({ origin: ORIGIN }));

// Socket.io setup with CORS
const io = new Server(httpServer, { 
  cors: { 
    origin: ORIGIN,
    methods: ["GET", "POST"]
  }
});

// Railway port configuration
const PORT = process.env.PORT || 3000;

// Health check endpoint for Railway
app.get('/', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    service: 'Spyfall Backend'
  });
});

// REST API endpoints
app.get('/api/lobbies', async (req, res) => {
  try {
    const lobbies = await getAllLobbies();
    res.json(lobbies.filter(lobby => lobby.players.length > 0));
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch lobbies' });
  }
});

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log(`Player connected: ${socket.id}`);

  // Join lobby
  socket.on('join-lobby', async (data: { lobbyId: string; playerName: string }) => {
    try {
      const { lobbyId, playerName } = data;
      let lobby = await getLobby(lobbyId);

      if (!lobby) {
        // Create new lobby
        const hostPlayer: Player = {
          id: socket.id,
          name: playerName,
          isSpy: false,
          isHost: true,
          isReady: false
        };
        lobby = createLobby(lobbyId, hostPlayer);
      } else {
        // Join existing lobby
        const newPlayer: Player = {
          id: socket.id,
          name: playerName,
          isSpy: false,
          isHost: false,
          isReady: false
        };
        lobby = addPlayerToLobby(lobby, newPlayer);
      }

      await saveLobby(lobby);
      socket.join(lobbyId);
      socket.emit('lobby-joined', lobby);
      socket.to(lobbyId).emit('player-joined', lobby);
    } catch (error) {
      socket.emit('error', { message: 'Failed to join lobby' });
    }
  });

  // Toggle ready status
  socket.on('toggle-ready', async (data: { lobbyId: string }) => {
    try {
      const { lobbyId } = data;
      let lobby = await getLobby(lobbyId);
      
      if (!lobby) {
        socket.emit('error', { message: 'Lobby not found' });
        return;
      }

      lobby = togglePlayerReady(lobby, socket.id);
      await saveLobby(lobby);
      
      socket.emit('lobby-updated', lobby);
      socket.to(lobbyId).emit('lobby-updated', lobby);
    } catch (error) {
      socket.emit('error', { message: 'Failed to update ready status' });
    }
  });

  // Start game
  socket.on('start-game', async (data: { lobbyId: string }) => {
    try {
      const { lobbyId } = data;
      let lobby = await getLobby(lobbyId);
      
      if (!lobby) {
        socket.emit('error', { message: 'Lobby not found' });
        return;
      }

      const player = lobby.players.find(p => p.id === socket.id);
      if (!player?.isHost) {
        socket.emit('error', { message: 'Only host can start game' });
        return;
      }

      if (!canStartGame(lobby)) {
        socket.emit('error', { message: 'Not enough players or not all ready' });
        return;
      }

      lobby = startGame(lobby);
      await saveLobby(lobby);
      
      // Send individual player info to each player
      lobby.players.forEach(player => {
        const playerSocket = io.sockets.sockets.get(player.id);
        if (playerSocket) {
          playerSocket.emit('game-started', {
            ...lobby,
            players: lobby.players.map(p => ({
              ...p,
              // Hide spy info from other players
              isSpy: p.id === player.id ? p.isSpy : undefined,
              location: p.id === player.id ? p.location : undefined,
              role: p.id === player.id ? p.role : undefined
            }))
          });
        }
      });
    } catch (error) {
      socket.emit('error', { message: 'Failed to start game' });
    }
  });

  // End round
  socket.on('end-round', async (data: { lobbyId: string; spyWon: boolean }) => {
    try {
      const { lobbyId, spyWon } = data;
      let lobby = await getLobby(lobbyId);
      
      if (!lobby) {
        socket.emit('error', { message: 'Lobby not found' });
        return;
      }

      const player = lobby.players.find(p => p.id === socket.id);
      if (!player?.isHost) {
        socket.emit('error', { message: 'Only host can end round' });
        return;
      }

      lobby = endRound(lobby, spyWon);
      await saveLobby(lobby);
      
      socket.emit('round-ended', lobby);
      socket.to(lobbyId).emit('round-ended', lobby);
    } catch (error) {
      socket.emit('error', { message: 'Failed to end round' });
    }
  });

  // Disconnect handling
  socket.on('disconnect', async () => {
    console.log(`Player disconnected: ${socket.id}`);
    
    // Find and update all lobbies this player was in
    const lobbies = await getAllLobbies();
    for (const lobby of lobbies) {
      if (lobby.players.some(p => p.id === socket.id)) {
        const updatedLobby = removePlayerFromLobby(lobby, socket.id);
        
        if (updatedLobby.players.length === 0) {
          // Delete empty lobby
          await deleteLobby(lobby.id);
        } else {
          // Save updated lobby
          await saveLobby(updatedLobby);
          socket.to(lobby.id).emit('player-left', updatedLobby);
        }
      }
    }
  });
});

// Initialize database and start server
async function startServer() {
  try {
    await initDatabase();
    
    httpServer.listen(PORT, () => {
      console.log(`🚀 Spyfall server running on port ${PORT}`);
      console.log(`📡 CORS origin: ${ORIGIN}`);
      console.log(`💾 Database path: ${process.env.DATA_DIR || './data'}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer(); 