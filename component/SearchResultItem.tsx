import { router } from 'expo-router';
import { Image, Text, TouchableOpacity, View } from 'react-native';

const POSTER_URL = 'https://image.tmdb.org/t/p/w92';

export default function SearchResultItem({ item, onAdd }: { item: any; onAdd: (item: any) => void }) {
    const title = item.title || item.name;

    const handlePress = () => {
        // Navigate to the media detail page
        router.push(`/media/${item.type}/${item.id}` as '/media/[media_type]/[tmdb_id]');
    };

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
                onPress={() => onAdd(item)}
                style={{
                    paddingHorizontal: 12,
                    paddingVertical: 6,
                    backgroundColor: '#007bff',
                    borderRadius: 4,
                }}
            >
                <Text style={{ color: '#fff', fontSize: 14 }}>+ Add</Text>
            </TouchableOpacity>
        </View>
        </TouchableOpacity>
    );
}