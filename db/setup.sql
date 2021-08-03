DROP DATABASE IF EXISTS win_tracker;
CREATE DATABASE win_tracker;
\c win_tracker;

CREATE TABLE decks(id INT, name VARCHAR(36), color VARCHAR(56), last_update TIMESTAMP, wl_logg TEXT, wl_catigories TEXT, selected_cat TEXT, dropdown BOOL);