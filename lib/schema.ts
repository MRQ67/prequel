import { SQLiteDatabase } from "expo-sqlite";
import { getDB } from "./db";

async function createMoviesTable(db : SQLiteDatabase) {
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS movies (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  tmdb_id INTEGER UNIQUE NOT NULL,
  title TEXT NOT NULL,
  overview TEXT,
  poster_path TEXT,
  release_date TEXT,
  status TEXT CHECK(status IN ('wishlist', 'watched')) NOT NULL DEFAULT 'wishlist',
  added_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT
    );
  `);
}

async function createTVSeriesTable(db : SQLiteDatabase) {
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS tv_series (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  tmdb_id INTEGER UNIQUE NOT NULL,
  title TEXT NOT NULL,
  overview TEXT,
  poster_path TEXT,
  first_air_date TEXT,
  added_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT
    );
  `);
}

async function createEpisodesTable(db : SQLiteDatabase) {
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS episodes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  tv_series_id INTEGER NOT NULL,
  season_number INTEGER NOT NULL,
  episode_number INTEGER NOT NULL,
  title TEXT,
  air_date TEXT,
  watched INTEGER NOT NULL DEFAULT 0,
  watched_at TEXT,

  FOREIGN KEY (tv_series_id) REFERENCES tv_series(id) ON DELETE CASCADE,
  UNIQUE(tv_series_id, season_number, episode_number)
    );
  `);
}

async function createIndexes(db : SQLiteDatabase) {
  await db.execAsync(`
    CREATE INDEX IF NOT EXISTS idx_movies_status_release
    ON movies(status, release_date);

    CREATE INDEX IF NOT EXISTS idx_episodes_tv_watched
    ON episodes(tv_series_id, watched);

    CREATE INDEX IF NOT EXISTS idx_episodes_air_date
    ON episodes(air_date);
  `);
}

export async function initSchema() {
    const db = await getDB();

    await createMoviesTable(db);
    await createTVSeriesTable(db);
    await createEpisodesTable(db);
    await createIndexes(db);
}