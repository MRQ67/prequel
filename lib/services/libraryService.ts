import {
    mapMovieRowToMovie,
    mapTVSeriesRowToTVSeries,
} from "../api/mappers";
import { tmdbApi } from "../api/tmdb";

import { addEpisodes } from "../repositories/episodesRepo";
import { addMovies } from "../repositories/moviesRepo";
import { addTVSeries } from "../repositories/tvRepo";

import { mapTVDetailsToLibraryItem } from "../api/newMapper";
import { getAllMovies } from "../repositories/moviesRepo";
import { getAllTVSeries } from "../repositories/tvRepo";


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
        const movieData = await tmdbApi.moviesDetails(item.id);
        const mappedfilm = mapMovieRowToMovie(movieData);
        await addMovies(mappedfilm);
        return;
    }

    if (item.type === "tv") {
        const tvData = await tmdbApi.tvDetails(item.id);
        const mappedSeries = mapTVDetailsToLibraryItem(tvData);
        const seriesResult = await addTVSeries(mappedSeries);
        
        const tvId = seriesResult.lastInsertRowId;

        for (const season of tvData.seasons) {
            if (season.season_number === 0) continue; // Skip specials

            const seasonData = await tmdbApi.seasonDetails(item.id, season.season_number);

            await addEpisodes({id: tvId, tv_series_id: tvId, episodes: seasonData.episodes});
        } 
    }
}

    