import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useSocket } from '../hooks/useSocket'
import { Copy, Play, Crown } from 'lucide-react'

export default function Lobby() {
  const { lobbyId } = useParams<{ lobbyId: string }>()
  const navigate = useNavigate()
  const { socket, isConnected, currentLobby, toggleReady, startGame } = useSocket()

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Connecting to server...</h1>
          <p className="text-gray-400">Please wait</p>
        </div>
      </div>
    )
  }

  if (!currentLobby || !lobbyId) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Loading lobby...</h1>
        </div>
      </div>
    )
  }

  const currentPlayer = currentLobby.players.find(p => p.id === socket?.id)
  const isHost = currentPlayer?.isHost
  const allReady = currentLobby.players.every(p => p.isReady)
  const canStart = currentLobby.players.length >= 3 && allReady

  const copyLobbyCode = () => {
    navigator.clipboard.writeText(lobbyId)
  }

  const handleStartGame = () => {
    if (canStart && isHost) {
      startGame(lobbyId)
      navigate(`/game/${lobbyId}`)
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Game Lobby</h1>
          <div className="flex items-center justify-center space-x-2">
            <span className="text-gray-400">Code:</span>
            <span className="font-mono text-xl font-bold">{lobbyId}</span>
            <button
              onClick={copyLobbyCode}
              className="p-1 hover:bg-gray-800 rounded"
            >
              <Copy size={16} />
            </button>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Players ({currentLobby.players.length}/8)</h2>
          <div className="space-y-3">
            {currentLobby.players.map((player) => (
              <div
                key={player.id}
                className="flex items-center justify-between p-3 bg-gray-700 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  {player.isHost && <Crown size={16} className="text-yellow-400" />}
                  <span className="font-medium">{player.name}</span>
                </div>
                <div className="flex items-center space-x-2">
                  {player.isReady && (
                    <span className="text-green-400 text-sm">Ready</span>
                  )}
                  {player.id === currentPlayer?.id && (
                    <button
                      onClick={() => toggleReady(lobbyId)}
                      className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                        player.isReady
                          ? 'bg-red-600 hover:bg-red-700'
                          : 'bg-green-600 hover:bg-green-700'
                      }`}
                    >
                      {player.isReady ? 'Not Ready' : 'Ready'}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {isHost && (
          <div className="text-center">
            <button
              onClick={handleStartGame}
              disabled={!canStart}
              className="inline-flex items-center space-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 rounded-lg font-medium transition-colors"
            >
              <Play size={20} />
              <span>Start Game</span>
            </button>
            {!canStart && (
              <p className="text-gray-400 mt-2">
                Need at least 3 players and all must be ready
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  )
} 