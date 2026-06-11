# CODE MAFIA

A real-time multiplayer browser game that mixes collaborative Python coding with social deduction — *Among Us in a code editor*. One player is secretly the **Imposter**; everyone else has to catch them before time runs out.

**Live demo:** [code-mafia-xi.vercel.app](https://code-mafia-xi.vercel.app)

---

## Features

- **Shared live code editor** — everyone edits the same Python file in a Monaco Editor, with every player's cursor line highlighted in their own color
- **Social deduction gameplay** — secret roles, sabotage, discussion in the lobby chat, and a final vote
- **Server-authoritative game logic** — roles, the round timer, and votes all live on the server; broadcast player lists never contain roles, so the Imposter can't be unmasked through browser devtools
- **Robust multiplayer** — one vote per player, no self-votes, ties let the Imposter escape; if the Imposter disconnects the Civilians win, and a vote still resolves if a player drops mid-round
- **Pixel art day cycle** — pure-CSS banded skies with dithered transitions (Press Start 2P): sunset in the lobby → tense dusk while voting → night for the results
- **10 code challenge templates** — each round picks a random set of buggy / unfinished Python tasks

---

## How to Play

1. One player creates a lobby and shares the **4-letter room code**
2. 3–5 players join the room
3. Roles are assigned secretly: **1 Imposter**, the rest are **Civilians**
4. Everyone edits the shared Python file for **3 minutes** — Civilians fix the bugs, the Imposter quietly breaks things
5. Discuss in the chat: who wrote that suspicious line?
6. Hit **CALL VOTE** at any time (it pulls the whole lobby into the vote) or let the timer expire
7. Everyone votes once. Majority is eliminated — catch the Imposter and the Civilians win; vote wrong (or tie) and the Imposter escapes

---

## Getting Started

**Requirements:** Node.js 18+

**1. Install dependencies**
```bash
cd server && npm install
cd ../client && npm install
```

**2. Start the server**
```bash
cd server && node index.js
```

**3. Start the client** (separate terminal)
```bash
cd client && npm run dev
```

**4. Open** `http://localhost:5173` — in three tabs if you want to test a round by yourself.

### Environment variables

| Variable | Side | Default | Purpose |
|----------|------|---------|---------|
| `PORT` | server | `3001` | Port the game server listens on |
| `CLIENT_URL` | server | – | Additional allowed CORS origin (the deployed client) |
| `VITE_SOCKET_URL` | client | `http://localhost:3001` | Socket server the client connects to |

---

## Tech Stack

| Layer    | Technology                          |
|----------|-------------------------------------|
| Frontend | React (Vite), Monaco Editor         |
| Backend  | Node.js, Express, Socket.io         |
| Styling  | Pure CSS pixel art, Press Start 2P  |
| State    | In-memory on the server (no database) |

---

## Project Structure

```
client/
  src/components/   screens: Lobby, WaitingRoom, Game, Voting, Result + CodeEditor, ChatBox
  src/hooks/        useSocket — singleton socket + handler lifecycle
  src/styles/       pixel.css — design system (banded skies, clouds, sparkles, 3D titles)
server/
  index.js          socket event wiring, validation, identity (socket.id)
  lobbyManager.js   lobbies, players, colors, host transfer
  gameManager.js    roles, round timer, voting, win conditions
  codeTemplates.js  the Python challenge templates
```

### Socket events

| Client → Server | Server → Client |
|-----------------|-----------------|
| `create_lobby`, `join_lobby`, `leave_lobby` | `lobby_created`, `lobby_update`, `error` |
| `start_game` *(host only)* | `role_assigned` *(private)*, `game_started` |
| `code_change`, `cursor_move`, `chat_message` | `code_update`, `cursor_update`, `chat_update` |
| `call_vote`, `cast_vote` | `voting_started`, `game_over` |

---

## Player Colors

Each player gets a unique color for their edits, cursor, and chat messages:

| Player | Color |
|--------|-------|
| 1 | Red `#FF4444` |
| 2 | Blue `#4488FF` |
| 3 | Green `#44CC44` |
| 4 | Yellow `#FFCC00` |
| 5 | Purple `#CC44FF` |
