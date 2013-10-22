CREATE TABLE worlds (
  id INTEGER PRIMARY KEY, 
  name TEXT,
  description TEXT,
  world_json TEXT
); 

ALTER TABLE worlds 
ADD COLUMN user_id INTEGER;
  
CREATE TABLE users (
  id INTEGER PRIMARY KEY,
  username TEXT,
  password TEXT
);