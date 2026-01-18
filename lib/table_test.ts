import { getDB } from "./db";

export async function debugTables() {
  const db = await getDB();
  const result = await db.getAllAsync(`
    SELECT name FROM sqlite_master WHERE type='table';
  `);

  console.log("📦 Tables:", result);
}
