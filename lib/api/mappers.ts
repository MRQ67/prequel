export function mapMovieRowToMovie(row: any) {
  return {
    id: row.id,
    title: row.title,
    overview: row.overview,
    releaseDate: row.release_date,
    rating: row.rating,
    poster_path: row.poster_path,
  };
}

export function mapTVSeriesRowToTVSeries(row: any) {
  return {
    id: row.id,
    tmdbId: row.tmdb_id,
    title: row.title,
    overview: row.overview,
    posterPath: row.poster_path,
    firstAirDate: row.first_air_date,
  };
}