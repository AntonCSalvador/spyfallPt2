# Spyfall-Web

A real-time web implementation of the Spyfall party game, built with Node.js + Socket.io backend and React + Vite frontend.

## 🏗️ Local Development

### Backend Setup
```bash
cd server && npm i && npm run dev
```

### Frontend Setup
```bash
cd frontend && npm i && npm run dev
```
Browser opens at http://localhost:5173

## 🚀 Deployment

### Backend → Railway
1. `railway up`
2. Add a volume ➜ mount path `/data`
3. Set ENV `DATA_DIR=/data`, `CLIENT_ORIGIN=https://your-app.vercel.app`

### Frontend → Vercel
1. `vercel --prod`
2. ENV `VITE_SOCKET_URL=https://<railway-subdomain>.railway.app`

## Architecture

| Component | Host | Technology | Notes |
|-----------|------|------------|-------|
| **Backend** | Railway | Node.js + Socket.io | JSON persistence via Volume |
| **Frontend** | Vercel | Vite + React | Static build with WebSocket connection |

## Features

- Real-time multiplayer gameplay
- Persistent game state across server restarts
- Modern, responsive UI
- Cross-platform compatibility 