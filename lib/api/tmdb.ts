const baseurl = 'https://api.themoviedb.org/3';

const apiKey: string = process.env.EXPO_PUBLIC_TMDB_API_KEY!;

if (!apiKey) {
  throw new Error('TMDB API key is not set in environment variables.');
}

async function fetchFromTMDB(path: string, params: Record<string, string | number> = {}) {
    const url = new URL(baseurl + path);
    url.searchParams.set('api_key', apiKey);
    for (const [key, value] of Object.entries(params)) {
        url.searchParams.set(key, value.toString());
    }
    const response = await fetch(url.toString());
    if (!response.ok) {
        throw new Error(`TMDB API request failed: ${response.status} ${response.statusText}`);
    }   
    return response.json();
}

export const tmdbApi = {
    searchMovies: (q: string) =>
        fetchFromTMDB('/search/movie', { query: q }),

    searchTV: (q: string) =>
        fetchFromTMDB('/search/tv', { query: q }),

    searchMulti: (q: string) =>
        fetchFromTMDB('/search/multi', { query: q }),

    moviesDetails: (tmdbId: number) =>
        fetchFromTMDB(`/movie/${tmdbId}`),

    tvDetails: (tmdbId: number) =>
        fetchFromTMDB(`/tv/${tmdbId}`),

    };