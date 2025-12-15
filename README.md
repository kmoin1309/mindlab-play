# 🧠 MindLab Play

A modern brain training game platform built with Next.js and FastAPI. Challenge your memory, math skills, attention, and vocabulary with fun, interactive games.

![MindLab Play](https://img.shields.io/badge/Next.js-16.0.10-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8)
![FastAPI](https://img.shields.io/badge/FastAPI-latest-009688)

## ✨ Features

### 🎮 Memory Fiesta
- **5×5 Grid Pattern Game** - Watch and recreate increasingly complex patterns
- **3 Lives System** - Strategic gameplay with visual heart indicators
- **30-Second Timer** - Race against time for each pattern
- **Progressive Difficulty** - Earn 30/60/90 points per level
- **Visual Feedback** - ✓ and ✗ marks show correct/wrong clicks
- **Game Controls** - Pause, sound toggle, and exit options
- **How to Play Modal** - In-game instructions
- **High Score Tracking** - Persistent localStorage scores
- **Beautiful Purple Gradient UI** - Modern, polished design

### 🎯 Planned Games
- **Math Fiesta** - Quick arithmetic challenges
- **Train Fiesta** - Attention and focus training
- **Word Fiesta** - Vocabulary building exercises

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 16.0.10 (App Router + Turbopack)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 3.4.17
- **Icons**: Lucide React
- **Local Storage**: IndexedDB for offline event tracking

### Backend
- **API**: FastAPI (Python)
- **Database**: PostgreSQL
- **Cache**: Redis
- **ORM**: psycopg2

### DevOps
- **Monorepo**: pnpm workspaces + Turborepo
- **Package Manager**: pnpm 10.25.0
- **Build Tool**: Turbo 2.6.3

## 📁 Project Structure

```
mindlab-play/
├── apps/
│   ├── web/                    # Next.js frontend
│   │   ├── src/
│   │   │   ├── app/
│   │   │   │   ├── games/
│   │   │   │   │   └── memory/
│   │   │   │   │       └── page.tsx
│   │   │   │   ├── layout.tsx
│   │   │   │   ├── page.tsx
│   │   │   │   └── globals.css
│   │   │   ├── components/
│   │   │   │   └── SyncProvider.tsx
│   │   │   ├── hooks/
│   │   │   │   └── useSync.ts
│   │   │   └── lib/
│   │   │       └── db.ts
│   │   ├── public/
│   │   ├── tailwind.config.js
│   │   ├── postcss.config.js
│   │   └── package.json
│   │
│   └── api/                    # FastAPI backend
│       ├── main.py
│       ├── requirements.txt
│       └── venv/
│
├── packages/
│   └── game-sdk/              # Shared game utilities
│
├── pnpm-workspace.yaml
├── turbo.json
└── package.json
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and pnpm
- Python 3.11+
- PostgreSQL
- Redis

### Installation

1. **Clone the repository**
```
git clone https://github.com/yourusername/mindlab-play.git
cd mindlab-play
```

2. **Install dependencies**
```
pnpm install
```

3. **Set up the backend**
```
cd apps/api
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

4. **Configure environment variables**
```
# Create .env in apps/api/
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/mindlab
REDIS_URL=redis://localhost:6379
```

5. **Run PostgreSQL migrations** (if applicable)
```
# Add your migration commands here
```

### Running the Application

**Terminal 1 - Backend:**
```
cd apps/api
source venv/bin/activate
python main.py
# Server runs on http://localhost:8000
```

**Terminal 2 - Frontend:**
```
cd apps/web
pnpm dev
# App runs on http://localhost:3000
```

Or run both with Turbo:
```
pnpm dev
```

## 🎯 How to Play Memory Fiesta

1. Click on **Memory Fiesta** from the dashboard
2. Read the **How to Play** instructions
3. Watch the pattern of highlighted cells (pink flash)
4. Click cells in the same order within 30 seconds
5. Correct pattern = points + next level
6. Wrong pattern = lose 1 life
7. Lose all 3 lives = Game Over!

**Scoring:**
- Level 1: +30 points
- Level 2: +60 points
- Level 3+: +90 points

## 🗄️ Database Schema

```
-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY,
  username VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Events table (game actions)
CREATE TABLE events (
  id UUID PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  game_id VARCHAR(50) NOT NULL,
  session_id UUID NOT NULL,
  timestamp TIMESTAMP NOT NULL,
  type VARCHAR(50) NOT NULL,
  payload JSONB,
  client_seq BIGINT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Game scores
CREATE TABLE game_scores (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  game_id VARCHAR(50) NOT NULL,
  score INTEGER NOT NULL,
  period VARCHAR(20) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

## 🔄 Sync Mechanism

MindLab Play uses **IndexedDB** for offline-first gameplay:
- Events stored locally during gameplay
- Auto-sync every 30 seconds to backend
- Sync on tab visibility change
- Visual sync indicator in bottom-right

## 🎨 UI/UX Highlights

- **Purple gradient theme** - Consistent, modern aesthetic
- **Responsive design** - Works on mobile and desktop
- **Smooth animations** - Scale transforms, fade effects
- **Visual feedback** - Check marks, X marks, color changes
- **Accessible controls** - Large touch targets, clear labels

## 🛣️ Roadmap

- [ ] Add sound effects
- [ ] Implement Math Fiesta game
- [ ] Implement Train Fiesta game  
- [ ] Implement Word Fiesta game
- [ ] Global leaderboards
- [ ] User authentication
- [ ] Daily challenges
- [ ] Achievement system
- [ ] PWA support with offline mode
- [ ] Multiplayer competitions

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 👨‍💻 Author

**Your Name**
- GitHub: [@yourusername](https://github.com/yourusername)
- LinkedIn: [Your LinkedIn](https://linkedin.com/in/yourprofile)

## 🙏 Acknowledgments

- Inspired by brain training apps like Lumosity and Peak
- Built with modern web technologies
- UI design influenced by contemporary gaming interfaces

---

**Happy Brain Training! 🧠✨**
