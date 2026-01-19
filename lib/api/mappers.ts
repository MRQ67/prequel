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
    tmdb_id: row.tmdb_id,
    title: row.title,
    overview: row.overview,
    poster_path: row.poster_path,
    firstAirDate: row.first_air_date,
  };
}

export function mapSearchResult(item: any) {
  if (item.media_type === 'movie') {
    return {
      id: item.id,
      tmdb_id: item.tmdb_id,
      title: item.title,
      overview: item.overview,
      poster_path: item.poster_path,
      release_date: item.release_date,
      type: 'movie',
    };
  }

  if (item.media_type === 'tv') {
    return {
      id: item.id,
      tmdb_id: item.tmdb_id,
      title: item.name,
      overview: item.overview,
      poster_path: item.poster_path,
      first_air_date: item.first_air_date,
      type: 'tv',
    };
  }
  return null;
}