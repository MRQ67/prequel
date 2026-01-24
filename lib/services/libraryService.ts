import {
    mapMovieRowToMovie,
    mapTVSeriesRowToTVSeries,
} from "../api/mappers";
import { tmdbApi } from "../api/tmdb";
import { getDB } from "../db";

import { addEpisodes } from "../repositories/episodesRepo";
import { addMovies } from "../repositories/moviesRepo";
import { addTVSeries } from "../repositories/tvRepo";

import { mapTVDetailsToLibraryItem } from "../api/newMapper";
import { getAllMovies } from "../repositories/moviesRepo";
import { getAllTVSeries } from "../repositories/tvRepo";


export async function isinLibrary(media_type: 'movie' | 'tv', tmdb_id: number) : Promise<boolean> {
    const db = await getDB();

    const table = media_type === 'movie' ? 'movies' : 'tv_series';

    const row = await db.getFirstAsync(
        `SELECT 1 FROM ${table} WHERE tmdb_id = ? LIMIT 1`,
        [tmdb_id]
    );

    return !!row;
}

export async function getLibrary() {
    const [movies, tvSeries] = await Promise.all([
        getAllMovies(),
        getAllTVSeries(),
    ]);

    return [
        ...movies.map(m => ({ ...mapMovieRowToMovie(m), type: 'movie' })),
        ...tvSeries.map(tv => ({ ...mapTVSeriesRowToTVSeries(tv), type: 'tv' })),
    ];
}



export async function addToLibrary(item: any) {
    if (item.type === "movie") {
        const movieData = await tmdbApi.moviesDetails(item.tmdb_id);
        const mappedfilm = mapMovieRowToMovie(movieData);
        await addMovies(mappedfilm);
        return;
    }

    if (item.type === "tv") {
        const tvData = await tmdbApi.tvDetails(item.tmdb_id);
        const mappedSeries = mapTVDetailsToLibraryItem(tvData);
        const seriesResult = await addTVSeries(mappedSeries);

        const tvId = seriesResult.lastInsertRowId;

        for (const season of tvData.seasons) {
            if (season.season_number === 0) continue; // Skip specials

            const seasonData = await tmdbApi.seasonDetails(item.tmdb_id, season.season_number);

            await addEpisodes({id: tvId, tv_series_id: tvId, episodes: seasonData.episodes});
        }
    }
}

export async function removeFromLibrary(media_type: 'movie' | 'tv', tmdb_id: number) {
    const db = await getDB();

    if (media_type === 'movie') {
        // Delete the movie from the movies table
        await db.runAsync(
            `DELETE FROM movies WHERE tmdb_id = ?`,
            [tmdb_id]
        );
    } else if (media_type === 'tv') {
        // Get the TV series ID first
        const tvSeries = await db.getFirstAsync<{ id: number }>(
            `SELECT id FROM tv_series WHERE tmdb_id = ?`,
            [tmdb_id]
        );

        if (tvSeries) {
            // Delete associated episodes first
            await db.runAsync(
                `DELETE FROM episodes WHERE tv_series_id = ?`,
                [tvSeries.id]
            );

            // Then delete the TV series
            await db.runAsync(
                `DELETE FROM tv_series WHERE tmdb_id = ?`,
                [tmdb_id]
            );
        }
    }
}

