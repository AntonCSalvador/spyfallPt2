import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useSocket } from '../hooks/useSocket'
import { Eye, EyeOff, Users, Clock } from 'lucide-react'

export default function Game() {
  const { lobbyId } = useParams<{ lobbyId: string }>()
  const navigate = useNavigate()
  const { socket, currentLobby, endRound } = useSocket()
  const [showRole, setShowRole] = useState(false)

  if (!currentLobby || !lobbyId || currentLobby.gameState !== 'playing') {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Game not started</h1>
          <button
            onClick={() => navigate(`/lobby/${lobbyId}`)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded"
          >
            Back to Lobby
          </button>
        </div>
      </div>
    )
  }

  const currentPlayer = currentLobby.players.find(p => p.id === socket?.id)
  const isSpy = currentPlayer?.isSpy
  const location = currentPlayer?.location
  const role = currentPlayer?.role

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Spyfall</h1>
          <div className="flex items-center justify-center space-x-6 text-gray-400">
            <div className="flex items-center space-x-2">
              <Users size={20} />
              <span>{currentLobby.players.length} players</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock size={20} />
              <span>{currentLobby.timeRemaining ? formatTime(currentLobby.timeRemaining) : '--:--'}</span>
            </div>
          </div>
        </div>

        {/* Game Info */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Location/Role Card */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Your Information</h2>
            
            {isSpy ? (
              <div className="text-center">
                <div className="text-red-400 text-6xl mb-4">🕵️</div>
                <h3 className="text-2xl font-bold text-red-400 mb-2">You are the SPY!</h3>
                <p className="text-gray-400">
                  Try to figure out the location by asking questions without revealing yourself.
                </p>
              </div>
            ) : (
              <div className="text-center">
                <div className="text-blue-400 text-6xl mb-4">🏢</div>
                <h3 className="text-xl font-bold mb-2">{location}</h3>
                <p className="text-gray-400 mb-4">You are at:</p>
                
                <button
                  onClick={() => setShowRole(!showRole)}
                  className="flex items-center space-x-2 mx-auto px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded"
                >
                  {showRole ? <EyeOff size={16} /> : <Eye size={16} />}
                  <span>{showRole ? 'Hide' : 'Show'} Role</span>
                </button>
                
                {showRole && (
                  <div className="mt-4 p-4 bg-gray-700 rounded">
                    <p className="text-lg font-semibold">{role}</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Players List */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Players</h2>
            <div className="space-y-3">
              {currentLobby.players.map((player) => (
                <div
                  key={player.id}
                  className="flex items-center justify-between p-3 bg-gray-700 rounded-lg"
                >
                  <span className="font-medium">{player.name}</span>
                  {player.isHost && (
                    <span className="text-yellow-400 text-sm">Host</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Host Controls */}
        {currentPlayer?.isHost && (
          <div className="mt-8 text-center">
            <div className="space-x-4">
              <button
                onClick={() => endRound(lobbyId, true)}
                className="px-6 py-3 bg-red-600 hover:bg-red-700 rounded-lg font-medium"
              >
                Spy Wins
              </button>
              <button
                onClick={() => endRound(lobbyId, false)}
                className="px-6 py-3 bg-green-600 hover:bg-green-700 rounded-lg font-medium"
              >
                Resistance Wins
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 