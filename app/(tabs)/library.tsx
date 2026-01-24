import { getLibrary } from "@/lib/services/libraryService";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { FlatList, Image, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";


function LibraryEmptyState() {
    return (
        <View className="flex-1 justify-center items-center">
            <Text className="text-lg text-gray-500">Your library is empty.</Text>
            <Text className="text-base text-gray-500">Add movies or TV shows to get started</Text>
        </View>
    );
}

export default function LibraryScreen() {
    const [libraryItems, setLibraryItems] = useState<any[]>([]);

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
            <View className="flex-1 justify-center items-center">
                <Text className="text-lg text-gray-500">Your library is empty.</Text>
            </View>
        );
    }

    const handleItemPress = (item: any) => {
        // Use tmdb_id for navigation (both movies and TV shows have this property in the library)
        const id = item.tmdb_id || item.id;
        router.push(`/media/${item.type}/${id}` as '/media/[media_type]/[tmdb_id]');
    }

    return (
        <SafeAreaView className="bg-white flex-1">
            <View className="flex-1 p-3 pt-10">
                <Text className="text-2xl font-bold mb-4">My Library</Text>
                <FlatList
                    data={libraryItems}
                    keyExtractor={(item) => `${item.type}-${item.tmdb_id}`}
                    numColumns={3}
                    ListEmptyComponent={<LibraryEmptyState />}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            onPress={() => handleItemPress(item)}
                            className="flex-col border-b border-gray-100 items-center mb-2"
                        >
                            <Image
                                source={ item.poster_path ? { uri: `https://image.tmdb.org/t/p/w500${item.poster_path}` } : require('../../assets/placeholder.png') }
                                className="w-24 h-36 rounded-md"
                                resizeMode="cover"
                            />
                            <Text className="text-base font-bold max-w-32 text-center mt-2">
                                {item.title || item.name} ({item.type.toUpperCase()})
                            </Text>
                        </TouchableOpacity>
                    )}
                />
            </View>
        </SafeAreaView>
    );
}