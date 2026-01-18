import * as SQLite from "expo-sqlite";

const DB_NAME = "sql_db";
let db: SQLite.SQLiteDatabase | null = null;

export async function getDB() {
  if (!db) {
    db = await SQLite.openDatabaseAsync(DB_NAME);
  }
  return db;
}