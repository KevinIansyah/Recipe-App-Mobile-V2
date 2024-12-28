import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import axios from 'axios';

const SearchBar = ({ value, onChange, onSubmit }) => (
  <View style={styles.searchContainer}>
    <MaterialIcon name="search" size={25} color="#9ca3af" />
    <TextInput
      placeholder="Search Food and Recipes"
      style={styles.searchInput}
      value={value}
      onChangeText={onChange}
      onSubmitEditing={onSubmit}
    />
  </View>
);

const RecipeCard = ({ item, onPress }) => (
  <TouchableOpacity style={styles.card} onPress={onPress}>
    <View style={styles.imageBox}>
      <Image
        source={{
          uri: `https://recipe.keviniansyah.com/storage/${item.image}`,
        }}
        style={styles.image}
        resizeMode="cover"
      />
    </View>
    <View style={styles.content}>
      <Text style={styles.title} numberOfLines={1}>
        {item.name}
      </Text>
      <Text style={styles.subTitle}>By {item.user.name}</Text>

      <View style={styles.iconContainer}>
        <View style={styles.iconBox}>
          <MaterialCommunityIcon name="timer" color="#16803d" size={15} />
          <Text style={styles.iconText}>{item.duration} menit</Text>
        </View>
        <View style={styles.iconBox}>
          <MaterialCommunityIcon name="account" color="#16803d" size={17} />
          <Text style={styles.iconText}>{item.servings} porsi</Text>
        </View>
      </View>

      <Text style={styles.description} numberOfLines={2}>
        {item.description}
      </Text>
    </View>
  </TouchableOpacity>
);

const LoadingState = () => (
  <View style={styles.loadingContainer}>
    <ActivityIndicator size="large" color="#FF6B00" />
  </View>
);

const EmptyState = ({ query, searchBar }) => (
  <View style={styles.container}>
    {searchBar}
    <View style={styles.loadingContainer}>
      <Text style={styles.emptyMessage}>
        {query.trim() ? 'Resep tidak ditemukan!' : ''}
      </Text>
    </View>
  </View>
);

const Search = ({ navigation }) => {
  const [state, setState] = useState({
    recipes: [],
    page: 1,
    totalPages: 0,
    loading: false,
    loadingMore: false,
    query: '',
    error: null,
  });

  const searchRecipes = async (pageNum = 1) => {
    if (!state.query.trim()) {
      setState((prev) => ({ ...prev, recipes: [] }));
      return;
    }

    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const response = await axios.get(
        `https://recipe.keviniansyah.com/api/search?query=${encodeURIComponent(
          state.query
        )}&page=${pageNum}`,
        { headers: { Accept: 'application/json' } }
      );

      setState((prev) => ({
        ...prev,
        recipes:
          pageNum === 1
            ? response.data.data
            : [...prev.recipes, ...response.data.data],
        totalPages: response.data.last_page,
        page: pageNum,
      }));
    } catch (error) {
      console.error('Search failed:', error);
      setState((prev) => ({
        ...prev,
        error: 'Gagal mengambil data resep. Silakan coba lagi.',
      }));
      Alert.alert('Error', 'Gagal mengambil data resep. Silakan coba lagi.');
    } finally {
      setState((prev) => ({ ...prev, loading: false, loadingMore: false }));
    }
  };

  const handleLoadMore = async () => {
    if (state.page < state.totalPages && !state.loadingMore) {
      setState((prev) => ({ ...prev, loadingMore: true }));
      await searchRecipes(state.page + 1);
    }
  };

  const searchBar = (
    <SearchBar
      value={state.query}
      onChange={(query) => setState((prev) => ({ ...prev, query }))}
      onSubmit={() => searchRecipes(1)}
    />
  );

  if (state.loading && !state.loadingMore) return <LoadingState />;
  if (state.error)
    return <EmptyState query={state.query} searchBar={searchBar} />;
  if (!state.loading && !state.recipes.length) {
    return <EmptyState query={state.query} searchBar={searchBar} />;
  }

  return (
    <View style={styles.container}>
      {searchBar}
      <ScrollView
        style={styles.recipeContainer}
        showsVerticalScrollIndicator={false}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
      >
        {state.recipes.map((item) => (
          <RecipeCard
            key={item.id}
            item={item}
            onPress={() => navigation.navigate('Recipe', { recipeId: item.id })}
          />
        ))}

        {state.loadingMore && (
          <View style={styles.loadingMore}>
            <ActivityIndicator size="small" color="#FF6B00" />
          </View>
        )}

        {state.page < state.totalPages && !state.loadingMore && (
          <TouchableOpacity
            style={styles.loadMoreButton}
            onPress={handleLoadMore}
          >
            <Text style={styles.loadMoreText}>Load More</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    backgroundColor: '#ffffff',
    padding: 20,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: '#ffffff',
    height: '100%',
  },
  recipeContainer: {
    margin: 20,
  },
  card: {
    width: '100%',
    padding: 10,
    marginBottom: 10,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 0.5,
    borderColor: '#e5e7eb',
  },
  imageBox: {
    width: 100,
    height: 110,
  },
  image: {
    width: 100,
    height: 110,
    borderRadius: 6,
  },
  content: {
    flex: 1,
    marginLeft: 10,
  },
  title: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 14,
    lineHeight: 24,
  },
  subTitle: {
    fontSize: 14,
    color: '#9ca3af',
    lineHeight: 24,
    marginBottom: 5,
  },
  description: {
    fontSize: 12,
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
    marginBottom: 5,
  },
  iconText: {
    marginLeft: 5,
    fontSize: 12,
  },
  loadMoreButton: {
    backgroundColor: '#000',
    borderRadius: 20,
    marginTop: 10,
    alignItems: 'center',
  },
  loadMoreText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    padding: 15,
  },
  loadingMore: {
    padding: 10,
    alignItems: 'center',
  },
  emptyMessage: {
    color: '#9ca3af',
    textAlign: 'center',
  },
  searchContainer: {
    height: 55,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F2F2',
    paddingHorizontal: 12,
    borderRadius: 10,
    marginHorizontal: 20,
    marginTop: 20,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    marginLeft: 6,
    color: 'black',
  },
  inputFocused: {
    borderColor: '#FF6B00',
  },
});

export default Search;
