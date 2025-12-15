CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE games (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  category VARCHAR(50) NOT NULL,
  is_active BOOLEAN DEFAULT TRUE
);

INSERT INTO games (id, name, category) VALUES
  ('memory', 'Memory Game', 'MEMORY'),
  ('math', 'Math Game', 'MATH'),
  ('train', 'Train Game', 'ATTENTION'),
  ('word', 'Word Game', 'VOCABULARY');

CREATE TABLE sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  game_id VARCHAR(50) REFERENCES games(id),
  started_at TIMESTAMPTZ DEFAULT NOW(),
  ended_at TIMESTAMPTZ,
  device_id VARCHAR(100)
);

CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  game_id VARCHAR(50) REFERENCES games(id),
  session_id UUID REFERENCES sessions(id),
  timestamp TIMESTAMPTZ NOT NULL,
  type VARCHAR(50) NOT NULL,
  payload JSONB,
  client_seq BIGINT,
  synced_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_events_user_game ON events(user_id, game_id, timestamp DESC);

CREATE TABLE game_scores (
  user_id UUID REFERENCES users(id),
  game_id VARCHAR(50) REFERENCES games(id),
  score BIGINT NOT NULL,
  period VARCHAR(20) NOT NULL,
  period_start DATE NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, game_id, period, period_start)
);

CREATE TABLE global_scores (
  user_id UUID REFERENCES users(id),
  score BIGINT NOT NULL,
  period VARCHAR(20) NOT NULL,
  period_start DATE NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, period, period_start)
);

CREATE INDEX idx_game_scores_leaderboard ON game_scores(game_id, period, period_start, score DESC);
CREATE INDEX idx_global_scores_leaderboard ON global_scores(period, period_start, score DESC);

-- Insert a demo user for testing
INSERT INTO users (username, email) VALUES ('demo_user', 'demo@mindlab.play');
