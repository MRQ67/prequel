import { getLibrary } from "@/lib/services/libraryService";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { FlatList, Image, Text, View } from "react-native";


function LibraryEmptyState() {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ fontSize: 18, color: '#555' }}>Your library is empty.</Text>
            <Text style={{ fontSize: 16, color: '#555' }}>Add movies or TV shows to get started</Text>
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
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ fontSize: 18, color: '#555' }}>Your library is empty.</Text>
            </View>
        );
    }

    return (
        <View style={{ flex: 1, padding: 12, marginTop: 40, marginLeft: 7, marginRight: 5}}>
        <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 16 }}>My Library</Text>
        <FlatList
            data={libraryItems}
            keyExtractor={(item) => `${item.type}-${item.id}`}
            numColumns={3}
            ListEmptyComponent={<LibraryEmptyState />}
            renderItem={({ item }) => (
                <View style={{ flexDirection: 'column', borderBottomWidth: 1, borderBottomColor: '#eee', alignItems: 'center'  }}> 
                    <Image
                        source={ item.poster_path ? { uri: `https://image.tmdb.org/t/p/w500${item.poster_path}` } : require('../../assets/placeholder.png') }
                        style={{ width: 100, height: 150, borderRadius: 4, marginRight: 16 }}
                        resizeMode="cover"
                    />
                    <Text style={{  fontSize: 16, fontWeight: 'bold', maxWidth: 120, textAlign: 'center', marginTop: 8 }}>
                        {item.title || item.name} ({item.type.toUpperCase()})
                    </Text>
                </View>

            )}
        />
    </View>
    );
}