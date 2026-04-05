# IT MAFIA

A multiplayer browser game combining collaborative Python coding with social deception. One player is secretly the **Imposter** – everyone else must catch them before it's too late.

---

## How to Play

1. One player creates a lobby and shares the 4-letter room code
2. 3–5 players join the room
3. Roles are secretly assigned: **1 Imposter**, rest are **Civilians**
4. All players edit a shared Python code editor in real time
5. **Civilians** fix the bugs – **Imposter** secretly sabotages the code
6. Players discuss in chat, then vote on who the Imposter is
7. The side that outsmarts the other wins

---

## Getting Started

**Requirements:** Node.js installed

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

**4. Open in browser:** `http://localhost:5173`

---

## Tech Stack

| Layer    | Technology                          |
|----------|-------------------------------------|
| Frontend | React (Vite), Monaco Editor         |
| Backend  | Node.js, Express, Socket.io         |
| Styling  | CSS, Press Start 2P (pixel art)     |
| State    | In-memory (no database)             |

---

## Player Colors

Each player gets a unique color for their edits and cursor:

| Player | Color                       |
|--------|-----------------------------|
| 1      | Red `#FF4444`               |
| 2      | Blue `#4488FF`              |
| 3      | Green `#44CC44`             |
| 4      | Yellow `#FFCC00`            |
| 5      | Purple `#CC44FF`            |

---

