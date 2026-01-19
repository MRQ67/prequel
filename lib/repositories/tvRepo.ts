import { getDB } from "../db";

export async function addTVSeries(row: {
    tmdb_id: number;
    title: string;
    overview?: string;
    first_air_date?: string;
    poster_path?: string;
}) {
    const db = await getDB();
    
    const result = await db.runAsync(
        `INSERT OR REPLACE INTO tv_series 
     (tmdb_id, title, overview, poster_path, first_air_date)
     VALUES (?, ?, ?, ?, ?)`,
        [
            row.tmdb_id,
            row.title,
            row.overview || null,
            row.poster_path || null,
            row.first_air_date || null,
        ]
    );
    
    return result;
}

export async function getAllTVSeries() {
    const db = await getDB();
    return db.getAllAsync(
        `SELECT * FROM tv_series ORDER BY added_at DESC`
    );
}