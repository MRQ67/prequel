import { useTheme } from "@/lib/contexts/ThemeContext";
import { getLibrary } from "@/lib/services/libraryService";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { FlatList, Image, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";


function LibraryEmptyState() {
    const { colors } = useTheme();

    return (
        <View className="flex-1 justify-center items-center" style={{ backgroundColor: colors.background }}>
            <Text className="text-lg" style={{ color: colors.mutedForeground }}>Your library is empty.</Text>
            <Text className="text-base" style={{ color: colors.mutedForeground }}>Add movies or TV shows to get started</Text>
        </View>
    );
}

export default function LibraryScreen() {
    const [libraryItems, setLibraryItems] = useState<any[]>([]);
    const { colors } = useTheme();

    const loadLibrary = async () => {
        const items = await getLibrary();
        setLibraryItems(items);
    };

    useFocusEffect(
        useCallback(() => {
            loadLibrary();
        }, [])
    );

    if (!libraryItems.length) {
        return (
            <View className="flex-1 justify-center items-center" style={{ backgroundColor: colors.background }}>
                <Text className="text-lg" style={{ color: colors.mutedForeground }}>Your library is empty.</Text>
            </View>
        );
    }

    const handleItemPress = (item: any) => {
        // Use tmdb_id for navigation (both movies and TV shows have this property in the library)
        const id = item.tmdb_id || item.id;
        router.push(`/media/${item.type}/${id}` as '/media/[media_type]/[tmdb_id]');
    }

    return (
        <SafeAreaView className="flex-1" style={{ backgroundColor: colors.background }}>
            <View className="flex-1 px-3" style={{ backgroundColor: colors.background }}>
                <Text className="text-2xl font-bold mb-4" style={{ color: colors.foreground }}>
                    My Library
                </Text>
                <FlatList
                    data={libraryItems}
                    keyExtractor={(item) => `${item.type}-${item.tmdb_id}`}
                    numColumns={3}
                    ListEmptyComponent={<LibraryEmptyState />}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            onPress={() => handleItemPress(item)}
                            className="flex-col items-center mb-2"
                            style={{ borderBottomColor: colors.border }}
                        >
                            <Image
                                source={ item.poster_path ? { uri: `https://image.tmdb.org/t/p/w500${item.poster_path}` } : require('../../assets/placeholder.png') }
                                className="w-24 h-36 rounded-md"
                                resizeMode="cover"
                            />
                            <Text className="text-base font-bold max-w-32 text-center mt-2" style={{ color: colors.foreground }}>
                                {item.title || item.name} ({item.type.toUpperCase()})
                            </Text>
                        </TouchableOpacity>
                    )}
                />
            </View>
        </SafeAreaView>
    );
}