import { getMediaWithFallback } from "@/lib/services/mediaService";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../../lib/contexts/ThemeContext";
import { removeFromLibrary } from "../../../lib/services/libraryService";
import { isinLibrary } from "../../../lib/services/libraryService";
import { addToLibrary } from "../../../lib/services/libraryService";

export default function MediaDetailPage() {
    const { media_type, tmdb_id } = useLocalSearchParams();
    const [media, setMedia] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [inLibrary, setInLibrary] = useState<boolean>(false);
    const { colors } = useTheme();

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

                    // Check if media is in library
                    const isInLibrary = await isinLibrary(
                        media_type as 'movie' | 'tv',
                        parseInt(tmdb_id as string, 10)
                    );
                    setInLibrary(isInLibrary);
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

    const handleDeleteFromLibrary = () => {
        Alert.alert(
            "Remove from Library",
            `Are you sure you want to remove "${media.title || media.name}" from your library?`,
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                {
                    text: "Remove",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await removeFromLibrary(media_type as 'movie' | 'tv', parseInt(tmdb_id as string, 10));
                            setInLibrary(false); // Update state after removal
                        } catch (err) {
                            console.error("Error removing from library:", err);
                            Alert.alert("Error", "Failed to remove item from library");
                        }
                    }
                }
            ]
        );
    };

    const handleAddToLibrary = async () => {
        try {
            // Create a temporary item object to pass to addToLibrary
            const item = {
                type: media_type,
                tmdb_id: parseInt(tmdb_id as string, 10),
                title: media.title || media.name,
            };

            await addToLibrary(item);
            setInLibrary(true); // Update state after addition
            Alert.alert("Success", `${media.title || media.name} added to library!`);
        } catch (err) {
            console.error("Error adding to library:", err);
            Alert.alert("Error", "Failed to add item to library");
        }
    };

    if (loading) {
        return (
            <View className="flex-1 justify-center items-center p-5" style={{ backgroundColor: colors.background }}>
                <ActivityIndicator size="large" className="mb-2" color={colors.primary} />
                <Text className="text-base" style={{ color: colors.mutedForeground }}>Loading media details...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View className="flex-1 justify-center items-center p-5" style={{ backgroundColor: colors.background }}>
                <Text className="text-base text-center mb-5" style={{ color: colors.destructive }}>{error}</Text>
                <TouchableOpacity
                    className="px-5 py-2.5 rounded-lg mt-5"
                    style={{ backgroundColor: colors.primary }}
                    onPress={handleGoBack}
                >
                    <Text className="text-base font-medium" style={{ color: colors.primaryForeground }}>Go Back</Text>
                </TouchableOpacity>
            </View>
        );
    }

    if (!media) {
        return (
            <View className="flex-1 justify-center items-center p-5" style={{ backgroundColor: colors.background }}>
                <Text className="mb-5" style={{ color: colors.foreground }}>No media data available</Text>
                <TouchableOpacity
                    className="px-5 py-2.5 rounded-lg"
                    style={{ backgroundColor: colors.primary }}
                    onPress={handleGoBack}
                >
                    <Text className="text-base font-medium" style={{ color: colors.primaryForeground }}>Go Back</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const imageUrl = media.poster_path
        ? `https://image.tmdb.org/t/p/w500${media.poster_path}`
        : require('../../../assets/placeholder.png');

    return (
        <SafeAreaView className="flex-1" style={{ backgroundColor: colors.background }}>
            <ScrollView className="flex-1" style={{ backgroundColor: colors.background }}>
                {/* Header with back button and conditional add/delete button */}
                <View className="flex-row items-center justify-between p-4 pt-12">
                    <TouchableOpacity className="p-2" onPress={handleGoBack}>
                        <Text className="text-base font-medium" style={{ color: colors.primary }}>← Back</Text>
                    </TouchableOpacity>

                    {/* Conditional button - "Delete" if in library, "Add" if not */}
                    <TouchableOpacity
                        className="p-2"
                        onPress={inLibrary ? handleDeleteFromLibrary : handleAddToLibrary}
                    >
                        <Text
                            className="text-base font-medium"
                            style={{
                                color: inLibrary ? colors.destructive : colors.primary
                            }}
                        >
                            {inLibrary ? "Delete" : "Add"}
                        </Text>
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
                    <Text className="text-2xl font-bold mb-2" style={{ color: colors.foreground }}>
                        {media.title || media.name || 'Unknown Title'}
                    </Text>

                    {/* Release/Air date */}
                    {(media.release_date || media.first_air_date) && (
                        <Text className="text-base mb-1" style={{ color: colors.mutedForeground }}>
                            {media.release_date
                                ? `Release Date: ${new Date(media.release_date).toLocaleDateString()}`
                                : `First Air Date: ${new Date(media.first_air_date).toLocaleDateString()}`}
                        </Text>
                    )}

                    {/* Rating */}
                    {(media.vote_average || media.rating) && (
                        <Text className="text-base mb-1" style={{ color: colors.mutedForeground }}>
                            Rating: {(media.vote_average || media.rating)?.toFixed(1)}/10
                        </Text>
                    )}

                    {/* Runtime (for movies) */}
                    {media.runtime && (
                        <Text className="text-base mb-1" style={{ color: colors.mutedForeground }}>
                            Runtime: {media.runtime} minutes
                        </Text>
                    )}

                    {/* Seasons and episodes (for TV shows) */}
                    {media.number_of_seasons && (
                        <Text className="text-base mb-1" style={{ color: colors.mutedForeground }}>
                            Seasons: {media.number_of_seasons}
                        </Text>
                    )}

                    {media.number_of_episodes && (
                        <Text className="text-base mb-3" style={{ color: colors.mutedForeground }}>
                            Episodes: {media.number_of_episodes}
                        </Text>
                    )}

                    {/* Overview */}
                    <View className="mt-3">
                        <Text className="text-lg font-semibold mb-2" style={{ color: colors.foreground }}>Overview</Text>
                        <Text className="text-base leading-6" style={{ color: colors.mutedForeground }}>
                            {media.overview || 'No description available.'}
                        </Text>
                    </View>

                    {/* Episodes for TV Shows */}
                    {media_type === 'tv' && media.episodesBySeason && (
                        <View className="mt-5">
                            <Text className="text-xl font-bold mb-3" style={{ color: colors.foreground }}>Episodes</Text>

                            {Object.keys(media.episodesBySeason)
                                .sort((a, b) => parseInt(a) - parseInt(b)) // Sort seasons numerically
                                .map((seasonNumber) => (
                                    <View key={seasonNumber} className="mb-5">
                                        <Text className="text-lg font-semibold mb-2" style={{ color: colors.primary }}>
                                            Season {seasonNumber}
                                        </Text>

                                        {media.episodesBySeason[parseInt(seasonNumber)]?.map((episode: any) => (
                                            <View
                                                key={episode.episode_number || episode.id}
                                                className="p-3 rounded-lg mb-2"
                                                style={{ backgroundColor: colors.card }}
                                            >
                                                <View className="flex-row justify-between items-center mb-1">
                                                    <Text className="text-base font-semibold flex-1" style={{ color: colors.foreground }}>
                                                        E{episode.episode_number}: {episode.name || episode.title}
                                                    </Text>
                                                    {episode.air_date && (
                                                        <Text className="text-sm" style={{ color: colors.mutedForeground }}>
                                                            {new Date(episode.air_date).toLocaleDateString()}
                                                        </Text>
                                                    )}
                                                </View>
                                                {episode.overview && (
                                                    <Text className="text-sm leading-5" style={{ color: colors.mutedForeground }}>
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