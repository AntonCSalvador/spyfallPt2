import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { useSocket } from './hooks/useSocket'
import Lobby from './components/Lobby'
import Game from './components/Game'
import Home from './components/Home'

function App() {
  const { isConnected, error } = useSocket()

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Connection Error</h1>
          <p className="text-red-400">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/lobby/:lobbyId" element={<Lobby />} />
        <Route path="/game/:lobbyId" element={<Game />} />
      </Routes>
    </div>
  )
}

export default App 