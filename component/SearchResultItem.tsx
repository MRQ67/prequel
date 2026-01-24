import { useTheme } from "@/lib/contexts/ThemeContext";
import { isinLibrary } from '@/lib/services/libraryService';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { addToLibrary } from '../lib/services/libraryService';

const POSTER_URL = 'https://image.tmdb.org/t/p/w92';

export default function SearchResultItem({ item}: { item: any }) {
    const [inLibrary, setInLibrary] = useState(false);
    const { colors } = useTheme();

    const title = item.title || item.name;

    const handlePress = () => {
        // Navigate to the media detail page
        router.push(`/media/${item.type}/${item.tmdb_id}` as '/media/[media_type]/[tmdb_id]');
    };

    useEffect(() => {
        isinLibrary(item.type, item.tmdb_id).then(setInLibrary);
    }, [item.type, item.tmdb_id]);

    async function handleAdd(item: any) {
        try {
            await addToLibrary(item);
            alert(`${item.title} added to library!`);
            setInLibrary(true); // Update the state to reflect that the item is now in the library
        } catch (error) {
            console.error('Error adding item:', error);
        }
    }

    return (
        <TouchableOpacity
            className="mb-3 rounded-lg"
            style={{ borderColor: colors.border, borderWidth: 1 }}
            onPress={handlePress}
        >
            <View className="flex-row mb-4 items-center p-2.5 gap-2.5 rounded-lg" style={{ backgroundColor: colors.card }}>
                <Image
                    source={ item.poster_path ? { uri: `${POSTER_URL}${item.poster_path}` } : require('../assets/placeholder.png') }
                    className="w-15 h-22.5 rounded-md"
                    resizeMode="cover"
                />
                <View className="flex-1">
                    <Text className="text-base font-bold" style={{ color: colors.foreground }}>{title}</Text>
                    {item.overview ? (
                        <Text className="text-sm mt-1" style={{ color: colors.mutedForeground }} numberOfLines={3}>
                            {item.overview}
                        </Text>
                    ) : null}
                </View>
                <TouchableOpacity
                    disabled={inLibrary}
                    onPress={() => handleAdd(item)}
                    className="px-3 py-1.5 rounded"
                    style={{ backgroundColor: inLibrary ? colors.muted : colors.primary }}
                >
                    <Text className="text-sm" style={{ color: colors.primaryForeground }}>{inLibrary ? 'In Library' : '+ Add'}</Text>
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );
}