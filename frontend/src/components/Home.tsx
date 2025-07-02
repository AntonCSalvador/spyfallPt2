import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSocket } from '../hooks/useSocket'

export default function Home() {
  const [playerName, setPlayerName] = useState('')
  const [lobbyId, setLobbyId] = useState('')
  const navigate = useNavigate()
  const { joinLobby } = useSocket()

  const createLobby = () => {
    if (!playerName.trim()) return
    const newLobbyId = Math.random().toString(36).substring(2, 8).toUpperCase()
    joinLobby(newLobbyId, playerName)
    navigate(`/lobby/${newLobbyId}`)
  }

  const joinExistingLobby = () => {
    if (!playerName.trim() || !lobbyId.trim()) return
    joinLobby(lobbyId.toUpperCase(), playerName)
    navigate(`/lobby/${lobbyId.toUpperCase()}`)
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
      <div className="max-w-md w-full space-y-8 p-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-2">Spyfall</h1>
          <p className="text-gray-400">Find the spy among you</p>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Your Name</label>
            <input
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your name"
            />
          </div>

          <div className="space-y-4">
            <button
              onClick={createLobby}
              disabled={!playerName.trim()}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 rounded-md font-medium transition-colors"
            >
              Create New Game
            </button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-700" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gray-900 text-gray-400">or join existing</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Game Code</label>
              <input
                type="text"
                value={lobbyId}
                onChange={(e) => setLobbyId(e.target.value)}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter game code"
              />
            </div>

            <button
              onClick={joinExistingLobby}
              disabled={!playerName.trim() || !lobbyId.trim()}
              className="w-full py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 rounded-md font-medium transition-colors"
            >
              Join Game
            </button>
          </div>
        </div>
      </div>
    </div>
  )
} 