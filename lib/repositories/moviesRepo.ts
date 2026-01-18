import { getDB } from "../db";

export async function addMovies(row: {
    id: number;
    title: string;
    overview?: string;
    release_date?: string;
    rating?: number;
    poster_path?: string;
}) {
    const db = await getDB();
    const result = await db.runAsync(
        `INSERT OR IGNORE INTO movies 
     (tmdb_id, title, overview, poster_path, release_date)
     VALUES (?, ?, ?, ?, ?)`,
        [
            row.id,
            row.title,
            row.overview || null,
            row.poster_path || null,
            row.release_date || null,
            row.rating || null,
        ]
    );
    return result;
    
    
}