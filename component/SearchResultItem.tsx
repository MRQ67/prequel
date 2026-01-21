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
        <TouchableOpacity style={{ marginBottom: 12,  borderColor: '#ddd' }}
            onPress={handlePress}
        >
        <View style={{ flexDirection: 'row', marginBottom: 16, alignItems: 'center', padding: 10, gap: 10, backgroundColor: '#f0f0f0', borderRadius: 8 }}>
            <Image
                source={ item.poster_path ? { uri: `${POSTER_URL}${item.poster_path}` } : require('../assets/placeholder.png') }
                style={{ width: 60, height: 90, borderRadius: 4 }}
                resizeMode="cover"
            />
            <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{title}</Text>
                {item.overview ? (
                    <Text style={{ fontSize: 14, color: '#555', marginTop: 4 }} numberOfLines={3}>
                        {item.overview}
                    </Text>
                ) : null}
            </View>
            <TouchableOpacity
                disabled={inLibrary}
                onPress={() => handleAdd(item)}
                style={{
                    paddingHorizontal: 12,
                    paddingVertical: 6,
                    backgroundColor: inLibrary ? '#888' : '#007bff',
                    borderRadius: 4,
                }}
            >
                <Text style={{ color: '#fff', fontSize: 14 }}>{inLibrary ? 'In Library' : '+ Add'}</Text>
            </TouchableOpacity>
        </View>
        </TouchableOpacity>
    );
}