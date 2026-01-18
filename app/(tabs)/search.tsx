import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    Pressable,
    Text,
    TextInput,
    View,
} from 'react-native';

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
        <View style={{flex: 1, padding: 16}}>
            <TextInput
                placeholder="Search for movies or TV shows..."
                value={query}   
                onChangeText={setQuery}
                autoCorrect={false}
                autoCapitalize="none"
                style={{
                    height: 40,
                    borderColor: 'gray',
                    borderWidth: 1,
                    borderRadius: 8,
                    paddingHorizontal: 8,
                    marginBottom: 16,
                }}
            />

            {loading && <ActivityIndicator />}

            <FlatList
                data={results}
                keyExtractor={(item) => `${item.type}-${item.id}`}
                renderItem={({item}) => (
                    <Pressable
                        style={{paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#eee'}}
                        onPress={() => {
                            // Handle item press, e.g., navigate to details screen
                        }}
                    >
                        <Text style={{fontSize: 16, fontWeight: 'bold'}}>
                            {item.title} {" "}
                            <Text style={{fontSize: 14, fontWeight: 'normal', color: 'gray'}}>
                                ({item.type === 'movie' ? "Movie" : "TV Show"})
                            </Text>
                        </Text>

                        {item.overview ? (
                            <Text style={{fontSize: 14, color: '#555', marginTop: 4}}>
                                {item.overview}
                            </Text>
                        ) : null}
                    </Pressable>
                )}
            />
        </View>
    );
}