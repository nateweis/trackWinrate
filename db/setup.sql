DROP DATABASE IF EXISTS win_tracker;
CREATE DATABASE win_tracker;
\c win_tracker;

CREATE TABLE decks(id SERIAL PRIMARY KEY, name VARCHAR(36), wins INT, losses INT, color VARCHAR(56));