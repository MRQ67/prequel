import { getMediaWithFallback } from "@/lib/services/mediaService";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function MediaDetailPage() {
    const { media_type, tmdb_id } = useLocalSearchParams();
    const [media, setMedia] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchMedia = async () => {
            try {
                setLoading(true);
                setError(null);

                if (media_type !== 'movie' && media_type !== 'tv') {
                    setError("Invalid media type");
                    setLoading(false);
                    return;
                }

                const data = await getMediaWithFallback(
                    media_type as 'movie' | 'tv',
                    parseInt(tmdb_id as string, 10)
                );

                if (data) {
                    setMedia(data);
                } else {
                    setError("Media not found");
                }
            } catch (err) {
                console.error("Error fetching media:", err);
                setError("Failed to fetch media details");
            } finally {
                setLoading(false);
            }
        };

        if (media_type && tmdb_id) {
            fetchMedia();
        }
    }, [media_type, tmdb_id]);

    const handleGoBack = () => {
        router.back();
    };

    if (loading) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color="#007AFF" />
                <Text style={styles.loadingText}>Loading media details...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.centerContainer}>
                <Text style={styles.errorText}>{error}</Text>
                <TouchableOpacity style={styles.button} onPress={handleGoBack}>
                    <Text style={styles.buttonText}>Go Back</Text>
                </TouchableOpacity>
            </View>
        );
    }

    if (!media) {
        return (
            <View style={styles.centerContainer}>
                <Text>No media data available</Text>
                <TouchableOpacity style={styles.button} onPress={handleGoBack}>
                    <Text style={styles.buttonText}>Go Back</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const imageUrl = media.poster_path
        ? `https://image.tmdb.org/t/p/w500${media.poster_path}`
        : require('../../../assets/placeholder.png');

    return (
        <ScrollView style={styles.container}>
            {/* Header with back button */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
                    <Text style={styles.backButtonText}>← Back</Text>
                </TouchableOpacity>
            </View>

            {/* Poster image */}
            <Image
                source={typeof imageUrl === 'string' ? { uri: imageUrl } : imageUrl}
                style={styles.poster}
                resizeMode="cover"
            />

            {/* Media details */}
            <View style={styles.detailsContainer}>
                <Text style={styles.title}>
                    {media.title || media.name || 'Unknown Title'}
                </Text>

                {/* Release/Air date */}
                {(media.release_date || media.first_air_date) && (
                    <Text style={styles.dateText}>
                        {media.release_date
                            ? `Release Date: ${new Date(media.release_date).toLocaleDateString()}`
                            : `First Air Date: ${new Date(media.first_air_date).toLocaleDateString()}`}
                    </Text>
                )}

                {/* Rating */}
                {(media.vote_average || media.rating) && (
                    <Text style={styles.ratingText}>
                        Rating: {(media.vote_average || media.rating)?.toFixed(1)}/10
                    </Text>
                )}

                {/* Runtime (for movies) */}
                {media.runtime && (
                    <Text style={styles.runtimeText}>
                        Runtime: {media.runtime} minutes
                    </Text>
                )}

                {/* Seasons and episodes (for TV shows) */}
                {media.number_of_seasons && (
                    <Text style={styles.seasonText}>
                        Seasons: {media.number_of_seasons}
                    </Text>
                )}

                {media.number_of_episodes && (
                    <Text style={styles.episodeText}>
                        Episodes: {media.number_of_episodes}
                    </Text>
                )}

                {/* Overview */}
                <View style={styles.overviewContainer}>
                    <Text style={styles.overviewTitle}>Overview</Text>
                    <Text style={styles.overviewText}>
                        {media.overview || 'No description available.'}
                    </Text>
                </View>

                {/* Episodes for TV Shows */}
                {media_type === 'tv' && media.episodesBySeason && (
                    <View style={styles.episodesSection}>
                        <Text style={styles.sectionTitle}>Episodes</Text>

                        {Object.keys(media.episodesBySeason)
                            .sort((a, b) => parseInt(a) - parseInt(b)) // Sort seasons numerically
                            .map((seasonNumber) => (
                                <View key={seasonNumber} style={styles.seasonContainer}>
                                    <Text style={styles.seasonTitle}>
                                        Season {seasonNumber}
                                    </Text>

                                    {media.episodesBySeason[parseInt(seasonNumber)]?.map((episode: any) => (
                                        <View key={episode.episode_number || episode.id} style={styles.episodeItem}>
                                            <View style={styles.episodeHeader}>
                                                <Text style={styles.episodeNumber}>
                                                    E{episode.episode_number}: {episode.name || episode.title}
                                                </Text>
                                                {episode.air_date && (
                                                    <Text style={styles.episodeAirDate}>
                                                        {new Date(episode.air_date).toLocaleDateString()}
                                                    </Text>
                                                )}
                                            </View>
                                            {episode.overview && (
                                                <Text style={styles.episodeOverview}>
                                                    {episode.overview}
                                                </Text>
                                            )}
                                        </View>
                                    ))}
                                </View>
                            ))}
                    </View>
                )}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: '#666',
    },
    errorText: {
        fontSize: 16,
        color: '#ff0000',
        textAlign: 'center',
        marginBottom: 20,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        paddingTop: 50, // Extra padding for status bar
    },
    backButton: {
        padding: 8,
    },
    backButtonText: {
        fontSize: 16,
        color: '#007AFF',
        fontWeight: '500',
    },
    poster: {
        width: '100%',
        height: 400,
    },
    detailsContainer: {
        padding: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 8,
        color: '#333',
    },
    dateText: {
        fontSize: 16,
        color: '#666',
        marginBottom: 4,
    },
    ratingText: {
        fontSize: 16,
        color: '#666',
        marginBottom: 4,
    },
    runtimeText: {
        fontSize: 16,
        color: '#666',
        marginBottom: 4,
    },
    seasonText: {
        fontSize: 16,
        color: '#666',
        marginBottom: 4,
    },
    episodeText: {
        fontSize: 16,
        color: '#666',
        marginBottom: 12,
    },
    overviewContainer: {
        marginTop: 12,
    },
    overviewTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 8,
        color: '#333',
    },
    overviewText: {
        fontSize: 16,
        lineHeight: 24,
        color: '#555',
    },
    button: {
        backgroundColor: '#007AFF',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 8,
        marginTop: 20,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '500',
    },
    episodesSection: {
        marginTop: 20,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 12,
        color: '#333',
    },
    seasonContainer: {
        marginBottom: 20,
    },
    seasonTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 8,
        color: '#007AFF',
    },
    episodeItem: {
        backgroundColor: '#f9f9f9',
        padding: 12,
        borderRadius: 8,
        marginBottom: 8,
    },
    episodeHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    episodeNumber: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        flex: 1,
    },
    episodeAirDate: {
        fontSize: 14,
        color: '#666',
    },
    episodeOverview: {
        fontSize: 14,
        color: '#555',
        lineHeight: 20,
    },
});