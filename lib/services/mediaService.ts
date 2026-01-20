import { mapMovieRowToMovie, mapTVSeriesRowToTVSeries } from "../api/mappers";
import { tmdbApi } from "../api/tmdb";
import { getDB } from "../db";

export async function getMediaWithFallback(
    media_type: 'movie' | 'tv', 
    tmdb_id: number
) {
    const db = await getDB();

    if (media_type === 'movie') {
        const movieThere = await db.getFirstAsync(
            `SELECT * FROM movies WHERE id = ?`,
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
            return { ...mapTVSeriesRowToTVSeries(tvThere), type: 'tv' };
        }

        const tvData = await tmdbApi.tvDetails(tmdb_id);

        return { ...tvData, type: 'tv' };
    }
    throw new Error('Invalid media type');
}

