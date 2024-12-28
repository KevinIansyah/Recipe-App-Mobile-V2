import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useFocusEffect } from '@react-navigation/native';
import axios from 'axios';

const RecipeCard = ({ item, onPress, isLast }) => (
  <TouchableOpacity
    style={[styles.card, isLast && { marginBottom: 60 }]}
    onPress={onPress}
  >
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
        {[
          { icon: 'timer', count: item.duration, color: '#16803d', size: 15 },
          { icon: 'account', count: item.servings, color: '#16803d', size: 17 },
          { icon: 'heart', count: item.like, color: '#9ca3af', size: 15 },
          { icon: 'comment', count: item.comment, color: '#9ca3af', size: 15 },
          {
            icon: 'bookmark',
            count: item.bookmark,
            color: '#9ca3af',
            size: 15,
          },
        ].map((stat, index) => (
          <View key={stat.icon} style={styles.iconBox}>
            <MaterialCommunityIcon
              name={stat.icon}
              color={stat.color}
              size={stat.size}
            />
            <Text style={styles.iconText}>{stat.count}</Text>
          </View>
        ))}
      </View>

      <Text style={styles.description} numberOfLines={2}>
        {item.description}
      </Text>
    </View>
  </TouchableOpacity>
);

const LoadMoreButton = ({ onPress, loading }) => (
  <TouchableOpacity
    style={styles.loadMoreButton}
    onPress={onPress}
    disabled={loading}
  >
    {loading ? (
      <ActivityIndicator size="small" color="#FFFFFF" />
    ) : (
      <Text style={styles.loadMoreText}>Load More</Text>
    )}
  </TouchableOpacity>
);

const Explore = ({ navigation }) => {
  const [state, setState] = useState({
    recipes: [],
    page: 1,
    totalPages: 0,
    loading: true,
    loadingMore: false,
  });

  const fetchRecipes = async (pageNum = 1) => {
    try {
      const response = await axios.get(
        `https://recipe.keviniansyah.com/api/recipe?page=${pageNum}`,
        { headers: { Accept: 'application/json' } }
      );

      setState((prev) => ({
        ...prev,
        recipes:
          pageNum === 1
            ? response.data.data
            : [...prev.recipes, ...response.data.data],
        totalPages: response.data.last_page,
        loading: false,
        loadingMore: false,
      }));
    } catch (error) {
      console.error('Failed to fetch recipes:', error);
      setState((prev) => ({ ...prev, loading: false, loadingMore: false }));
    }
  };

  const handleLoadMore = async () => {
    const { page, totalPages, loadingMore } = state;
    if (page < totalPages && !loadingMore) {
      const nextPage = page + 1;
      setState((prev) => ({ ...prev, page: nextPage, loadingMore: true }));
      await fetchRecipes(nextPage);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchRecipes();
    }, [])
  );

  if (state.loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF6B00" />
      </View>
    );
  }

  if (state.recipes.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.emptyMessage}>Belum ada data recipe!</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.recipeContainer}
        showsVerticalScrollIndicator={false}
      >
        {state.recipes.map((item, index) => (
          <RecipeCard
            key={item.id}
            item={item}
            isLast={
              index === state.recipes.length - 1 &&
              state.page === state.totalPages
            }
            onPress={() => navigation.navigate('Recipe', { recipeId: item.id })}
          />
        ))}

        {state.page < state.totalPages && (
          <LoadMoreButton
            onPress={handleLoadMore}
            loading={state.loadingMore}
          />
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
    padding: 20,
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
    marginBottom: 60,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
  },
  loadMoreText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptyMessage: {
    color: '#9ca3af',
    textAlign: 'center',
  },
});

export default Explore;
