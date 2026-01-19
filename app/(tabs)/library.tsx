import { getLibrary } from "@/lib/services/libraryService";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { FlatList, Text, View } from "react-native";


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
        <FlatList
            data={libraryItems}
            keyExtractor={(item) => `${item.type}-${item.id}`}
            renderItem={({ item }) => (
                <View style={{ padding: 16, borderBottomWidth: 1, borderBottomColor: '#eee' }}> 
                    <Text style={{ fontSize: 16, fontWeight: 'bold' }}>
                        {item.title || item.name} ({item.type.toUpperCase()})
                    </Text>
                    <Text style={{ fontSize: 14, color: '#555', marginTop: 4 }}>
                        {item.overview}         
                    </Text>
                </View>
            )}
        />
    );
}