import { isinLibrary } from '@/lib/services/libraryService';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { addToLibrary } from '../lib/services/libraryService';

const POSTER_URL = 'https://image.tmdb.org/t/p/w92';

export default function SearchResultItem({ item}: { item: any }) {
    const [inLibrary, setInLibrary] = useState(false);

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
        <TouchableOpacity className="mb-3 border border-gray-300"
            onPress={handlePress}
        >
            <View className="flex-row mb-4 items-center p-2.5 gap-2.5 bg-gray-100 rounded-lg">
                <Image
                    source={ item.poster_path ? { uri: `${POSTER_URL}${item.poster_path}` } : require('../assets/placeholder.png') }
                    className="w-15 h-22.5 rounded-md"
                    resizeMode="cover"
                />
                <View className="flex-1">
                    <Text className="text-base font-bold">{title}</Text>
                    {item.overview ? (
                        <Text className="text-sm text-gray-600 mt-1" numberOfLines={3}>
                            {item.overview}
                        </Text>
                    ) : null}
                </View>
                <TouchableOpacity
                    disabled={inLibrary}
                    onPress={() => handleAdd(item)}
                    className={`px-3 py-1.5 rounded ${inLibrary ? 'bg-gray-500' : 'bg-blue-600'}`}
                >
                    <Text className="text-white text-sm">{inLibrary ? 'In Library' : '+ Add'}</Text>
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );
}