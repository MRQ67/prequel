import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    Text,
    TextInput,
    View
} from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";

import SearchResultItem from '../../component/SearchResultItem';
import { mapSearchResult } from '../../lib/api/mappers';
import { tmdbApi } from '../../lib/api/tmdb';


export default function SearchScreen() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (query.trim().length < 2) {
            setResults([]);
            return;
        }

        const timeout = setTimeout(async () => {
            try {
                setLoading(true);
                const data = await tmdbApi.searchMulti(query);
                const mappedResults = data.results
                    .map(mapSearchResult)
                    .filter(Boolean);
                setResults(mappedResults);
            }
            catch (error) {
                console.error('Search error:', error);
            }
            finally {
                setLoading(false);
            }
        }, 400);

        return () => clearTimeout(timeout);
    }, [query]);

    return (
        <SafeAreaView className="bg-white flex-1">
            <View className="flex-1 p-4 pt-10">
                <Text className="text-2xl font-bold mb-4">Search</Text>
                <TextInput
                    placeholder="Search for movies or TV shows..."
                    value={query}
                    onChangeText={setQuery}
                    autoCorrect={false}
                    autoCapitalize="none"
                    className="h-10 border border-gray-300 rounded-lg px-2 mb-4"
                    clearButtonMode="while-editing"
                />

                {loading && <ActivityIndicator className="mb-4"/>}

                <FlatList
                    data={results}
                    keyExtractor={(item) => item.tmdb_id.toString()}
                    renderItem={({ item }) => (
                        <SearchResultItem item={item} />
                    )}
                    ListEmptyComponent={
                        !loading && query.trim().length >=2 ? (
                            <Text className="text-center mt-5 text-gray-500">
                                No results found.
                            </Text>
                        ) : null
                    }
                />
            </View>
        </SafeAreaView>
    );
}