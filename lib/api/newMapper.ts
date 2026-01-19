

export function mapTVDetailsToLibraryItem(tvDetails: any) {
    return {
        tmdb_id: tvDetails.id,
        title: tvDetails.name,
        overview: tvDetails.overview,
        poster_path: tvDetails.poster_path,
        first_air_date: tvDetails.first_air_date,
    };
}
