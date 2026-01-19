import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    Text,
    TextInput,
    View
} from 'react-native';

import SearchResultItem from '../../component/SearchResultItem';
import { mapSearchResult } from '../../lib/api/mappers';
import { tmdbApi } from '../../lib/api/tmdb';
import { addToLibrary } from '../../lib/services/libraryService';



async function handleAdd(item: any) {
    try {
        await addToLibrary(item);
        alert(`${item.title} added to library!`);
    } catch (error) {
        console.error('Error adding item:', error);
    }   
}

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
        <View style={{flex: 1, padding: 16, position: 'relative', marginTop: 40}}>
            <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 16 }}>Search</Text>
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
                clearButtonMode="while-editing"
            />

            {loading && <ActivityIndicator />}

            <FlatList
                data={results}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <SearchResultItem item={item} onAdd={handleAdd} />
                )}
                ListEmptyComponent={
                    !loading && query.trim().length >=2 ? (
                        <Text style={{ textAlign: 'center', marginTop: 20, color: '#555' }}>
                            No results found.       
                        </Text>
                    ) : null
                }
            />

        </View>
    );
}