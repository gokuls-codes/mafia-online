-- Initial Schema for Mafia Online
-- Run this in your Supabase SQL Editor

-- 1. Create the rooms table
CREATE TABLE IF NOT EXISTS rooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  host_id TEXT NOT NULL,
  join_code TEXT UNIQUE,
  status TEXT DEFAULT 'Lobby' CHECK (status IN ('Lobby', 'Night', 'Day', 'Voting', 'Verdict', 'Finished')),
  winner_faction TEXT,
  settings JSONB DEFAULT '{"roleCounts": {"villager": 3, "mafia": 1, "doctor": 1}, "timerNight": 40, "timerDay": 90, "timerVoting": 45}'::JSONB,
  last_night_summary JSONB DEFAULT '{}'::JSONB,
  last_vote_summary JSONB DEFAULT '{}'::JSONB,
  mafia_target UUID REFERENCES players(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create the players table
CREATE TABLE IF NOT EXISTS players (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID REFERENCES rooms(id) ON DELETE CASCADE,
  user_id TEXT, -- This is the internal mafia_user_id we store in localStorage (stored as TEXT for simplicity)
  name TEXT NOT NULL,
  role_id TEXT,
  faction TEXT,
  is_alive BOOLEAN DEFAULT TRUE,
  is_host BOOLEAN DEFAULT FALSE,
  vote_target UUID REFERENCES players(id),
  action_target UUID REFERENCES players(id),
  last_action_target UUID REFERENCES players(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Enable Realtime for these tables
-- Run this to add them to the realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE rooms;
ALTER PUBLICATION supabase_realtime ADD TABLE players;

-- 4. Set RLS (For MVP, we'll allow all. In production, add proper policies)
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE players ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow All for Rooms" ON rooms FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow All for Players" ON players FOR ALL USING (true) WITH CHECK (true);
