import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    Text,
    TextInput,
    View
} from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";

import { useTheme } from "@/lib/contexts/ThemeContext";
import SearchResultItem from '../../component/SearchResultItem';
import { mapSearchResult } from '../../lib/api/mappers';
import { tmdbApi } from '../../lib/api/tmdb';


export default function SearchScreen() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const { colors } = useTheme();

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
        <SafeAreaView className="flex-1" style={{ backgroundColor: colors.background }}>
            <View className="flex-1 px-3" style={{ backgroundColor: colors.background }}>
                <Text className="text-2xl font-bold mb-4" style={{ color: colors.foreground }}>
                    Search
                </Text>
                <TextInput
                    placeholder="Search for movies or TV shows..."
                    value={query}
                    onChangeText={setQuery}
                    autoCorrect={false}
                    autoCapitalize="none"
                    className="h-10 rounded-lg px-2 mb-4"
                    style={{
                        borderColor: colors.input,
                        borderWidth: 1,
                        color: colors.foreground,
                        backgroundColor: colors.input
                    }}
                    clearButtonMode="while-editing"
                />

                {loading && <ActivityIndicator className="mb-4" color={colors.primary}/>}

                <FlatList
                    data={results}
                    keyExtractor={(item) => item.tmdb_id.toString()}
                    renderItem={({ item }) => (
                        <SearchResultItem item={item} />
                    )}
                    ListEmptyComponent={
                        !loading && query.trim().length >=2 ? (
                            <Text className="text-center mt-5" style={{ color: colors.mutedForeground }}>
                                No results found.
                            </Text>
                        ) : null
                    }
                />
            </View>
        </SafeAreaView>
    );
}