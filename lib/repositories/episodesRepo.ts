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
         (tv_series_id, season_number, episode_number, title, overview, air_date)
            VALUES (?, ?, ?, ?, ?, ?)`,
            [
                row.tv_series_id,
                episode.season_number,
                episode.episode_number,
                episode.title || null,
                episode.overview || null,
                episode.air_date || null,
            ]
        );
    }
    return { success: true };
}

export async function getEpisodesByTVSeriesId(tv_series_id: number) {
    const db = await getDB();
    
    const episodes = await db.getAllAsync(
        `SELECT * FROM episodes WHERE tv_series_id = ? ORDER BY season_number, episode_number`,
        [tv_series_id]
    );
    
    // Group episodes by season
    const episodesBySeason: Record<number, any[]> = {};
    episodes.forEach((episode: any) => {
        if (!episodesBySeason[episode.season_number]) {
            episodesBySeason[episode.season_number] = [];
        }
        episodesBySeason[episode.season_number].push(episode);

    });
    
    return episodesBySeason;
}   