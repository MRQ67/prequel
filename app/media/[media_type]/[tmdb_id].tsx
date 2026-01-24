import { getMediaWithFallback } from "@/lib/services/mediaService";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

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
            <View className="flex-1 justify-center items-center p-5">
                <ActivityIndicator size="large" className="mb-2" />
                <Text className="text-gray-500 text-base">Loading media details...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View className="flex-1 justify-center items-center p-5">
                <Text className="text-red-500 text-base text-center mb-5">{error}</Text>
                <TouchableOpacity className="bg-blue-500 px-5 py-2.5 rounded-lg mt-5" onPress={handleGoBack}>
                    <Text className="text-white text-base font-medium">Go Back</Text>
                </TouchableOpacity>
            </View>
        );
    }

    if (!media) {
        return (
            <View className="flex-1 justify-center items-center p-5">
                <Text className="mb-5">No media data available</Text>
                <TouchableOpacity className="bg-blue-500 px-5 py-2.5 rounded-lg" onPress={handleGoBack}>
                    <Text className="text-white text-base font-medium">Go Back</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const imageUrl = media.poster_path
        ? `https://image.tmdb.org/t/p/w500${media.poster_path}`
        : require('../../../assets/placeholder.png');

    return (
        <SafeAreaView className="bg-white flex-1">
            <ScrollView className="flex-1">
                {/* Header with back button */}
                <View className="flex-row items-center p-4 pt-12">
                    <TouchableOpacity className="p-2" onPress={handleGoBack}>
                        <Text className="text-blue-500 text-base font-medium">← Back</Text>
                    </TouchableOpacity>
                </View>

                {/* Poster image */}
                <Image
                    source={typeof imageUrl === 'string' ? { uri: imageUrl } : imageUrl}
                    className="w-full h-96"
                    resizeMode="cover"
                />

                {/* Media details */}
                <View className="p-4">
                    <Text className="text-2xl font-bold mb-2 text-gray-800">
                        {media.title || media.name || 'Unknown Title'}
                    </Text>

                    {/* Release/Air date */}
                    {(media.release_date || media.first_air_date) && (
                        <Text className="text-base text-gray-500 mb-1">
                            {media.release_date
                                ? `Release Date: ${new Date(media.release_date).toLocaleDateString()}`
                                : `First Air Date: ${new Date(media.first_air_date).toLocaleDateString()}`}
                        </Text>
                    )}

                    {/* Rating */}
                    {(media.vote_average || media.rating) && (
                        <Text className="text-base text-gray-500 mb-1">
                            Rating: {(media.vote_average || media.rating)?.toFixed(1)}/10
                        </Text>
                    )}

                    {/* Runtime (for movies) */}
                    {media.runtime && (
                        <Text className="text-base text-gray-500 mb-1">
                            Runtime: {media.runtime} minutes
                        </Text>
                    )}

                    {/* Seasons and episodes (for TV shows) */}
                    {media.number_of_seasons && (
                        <Text className="text-base text-gray-500 mb-1">
                            Seasons: {media.number_of_seasons}
                        </Text>
                    )}

                    {media.number_of_episodes && (
                        <Text className="text-base text-gray-500 mb-3">
                            Episodes: {media.number_of_episodes}
                        </Text>
                    )}

                    {/* Overview */}
                    <View className="mt-3">
                        <Text className="text-lg font-semibold mb-2 text-gray-800">Overview</Text>
                        <Text className="text-base text-gray-600 leading-6">
                            {media.overview || 'No description available.'}
                        </Text>
                    </View>

                    {/* Episodes for TV Shows */}
                    {media_type === 'tv' && media.episodesBySeason && (
                        <View className="mt-5">
                            <Text className="text-xl font-bold mb-3 text-gray-800">Episodes</Text>

                            {Object.keys(media.episodesBySeason)
                                .sort((a, b) => parseInt(a) - parseInt(b)) // Sort seasons numerically
                                .map((seasonNumber) => (
                                    <View key={seasonNumber} className="mb-5">
                                        <Text className="text-lg font-semibold mb-2 text-blue-500">
                                            Season {seasonNumber}
                                        </Text>

                                        {media.episodesBySeason[parseInt(seasonNumber)]?.map((episode: any) => (
                                            <View key={episode.episode_number || episode.id} className="bg-gray-50 p-3 rounded-lg mb-2">
                                                <View className="flex-row justify-between items-center mb-1">
                                                    <Text className="text-base font-semibold text-gray-800 flex-1">
                                                        E{episode.episode_number}: {episode.name || episode.title}
                                                    </Text>
                                                    {episode.air_date && (
                                                        <Text className="text-sm text-gray-500">
                                                            {new Date(episode.air_date).toLocaleDateString()}
                                                        </Text>
                                                    )}
                                                </View>
                                                {episode.overview && (
                                                    <Text className="text-sm text-gray-600 leading-5">
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
        </SafeAreaView>
    );
}