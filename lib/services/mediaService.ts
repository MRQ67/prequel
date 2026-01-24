import { mapMovieRowToMovie, mapTVSeriesRowToTVSeries } from "../api/mappers";
import { tmdbApi } from "../api/tmdb";
import { getDB } from "../db";
import { getEpisodesByTVSeriesId } from "../repositories/episodesRepo";


export async function getMediaWithFallback(
    media_type: 'movie' | 'tv',
    tmdb_id: number
) {
    const db = await getDB();

    if (media_type === 'movie') {
        const movieThere = await db.getFirstAsync(
            `SELECT * FROM movies WHERE tmdb_id = ?`,
            [tmdb_id]
        );
        if (movieThere) {
            return { ...mapMovieRowToMovie(movieThere), type: 'movie' };
        }

        const movieData = await tmdbApi.moviesDetails(tmdb_id);

        return { ...movieData, type: 'movie' };
    }
    else if (media_type === 'tv') {
        const tvThere = await db.getFirstAsync(
            `SELECT * FROM tv_series WHERE tmdb_id = ?`,
            [tmdb_id]
        );

        if (tvThere) {
            // Get episodes from DB if TV show exists in DB
            // Cast to any first to access the id property, then to get the proper type
            const tvId = (tvThere as any).id as number;
            const episodesBySeason = await getEpisodesByTVSeriesId(tvId);

            return {
                ...mapTVSeriesRowToTVSeries(tvThere),
                type: 'tv',
                episodesBySeason
            };
        }

        // Fetch from API and get episodes from API as well
        const tvData = await tmdbApi.tvDetails(tmdb_id);

        // Get episodes from API
        const allEpisodes: Record<number, any[]> = {};
        for (const season of tvData.seasons) {
            if (season.season_number === 0) continue; // Skip specials

            const seasonData = await tmdbApi.seasonDetails(tmdb_id, season.season_number);
            allEpisodes[season.season_number] = seasonData.episodes;
        }

        return {
            ...tvData,
            type: 'tv',
            episodesBySeason: allEpisodes
        };
    }
    throw new Error('Invalid media type');
}

