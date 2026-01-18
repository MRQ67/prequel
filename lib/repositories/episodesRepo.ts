import { getDB } from "../db";

export async function addEpisodes(row: {
    id: number;
    tv_series_id: number;
    episodes: any[];
}) {
    const db = await getDB();
    
    
    for (const episode of row.episodes) {
        await db.runAsync(
            `INSERT OR IGNORE INTO episodes 
         (tv_series_id, season_number, episode_number, title, air_date)
            VALUES (?, ?, ?, ?, ?)`,
            [
                row.tv_series_id,
                episode.season_number,
                episode.episode_number,
                episode.title || null,
                episode.air_date || null,
            ]
        );
    }
    return { success: true };
}