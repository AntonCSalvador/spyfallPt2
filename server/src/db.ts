import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import { join } from 'path';
import { mkdir } from 'fs/promises';
import { DatabaseSchema, Lobby, GameSettings } from './types';

// Use Railway volume path for persistence
const DB_PATH = join(process.env.DATA_DIR ?? "./data", "db.json");
const DB_DIR = join(process.env.DATA_DIR ?? "./data");

// Ensure directory exists
async function ensureDirectoryExists() {
  try {
    await mkdir(DB_DIR, { recursive: true });
  } catch (error) {
    // Directory might already exist, ignore error
  }
}

const adapter = new JSONFile<DatabaseSchema>(DB_PATH);

// Initialize with default data
const defaultData: DatabaseSchema = {
  lobbies: {},
  settings: {
    maxRounds: 3,
    roundTime: 480, // 8 minutes
    votingTime: 60  // 1 minute
  }
};

export const db = new Low<DatabaseSchema>(adapter, defaultData);

// Ensure database is loaded
export async function initDatabase() {
  await ensureDirectoryExists();
  await db.read();
  if (!db.data) {
    db.data = defaultData;
    await db.write();
  }
  console.log(`Database initialized at: ${DB_PATH}`);
}

// Helper functions for lobby management
export async function getLobby(lobbyId: string): Promise<Lobby | null> {
  await db.read();
  return db.data?.lobbies[lobbyId] || null;
}

export async function saveLobby(lobby: Lobby): Promise<void> {
  await db.read();
  if (!db.data) {
    db.data = defaultData;
  }
  db.data.lobbies[lobby.id] = lobby;
  await db.write();
}

export async function deleteLobby(lobbyId: string): Promise<void> {
  await db.read();
  if (db.data?.lobbies[lobbyId]) {
    delete db.data.lobbies[lobbyId];
    await db.write();
  }
}

export async function getAllLobbies(): Promise<Lobby[]> {
  await db.read();
  return Object.values(db.data?.lobbies || {});
}

export async function getSettings(): Promise<GameSettings> {
  await db.read();
  return db.data?.settings || defaultData.settings;
} 