CREATE TABLE IF NOT EXISTS user_tools (
  user_id uuid REFERENCES auth.users(id),
  tool_id text,
  favorited boolean DEFAULT false,
  last_used timestamp DEFAULT current_timestamp,
  PRIMARY KEY (user_id, tool_id)
);