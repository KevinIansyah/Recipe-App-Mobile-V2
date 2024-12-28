import { useFocusEffect } from '@react-navigation/native';
import axios from 'axios';
import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.7;
const CARD_SPACING = width * 0.02;

const Home = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [recipes, setRecipes] = useState([]);

  const fetchBestRecipes = async () => {
    try {
      const response = await axios.get(
        'https://recipe.keviniansyah.com/api/best-recipe',
        {
          headers: { Accept: 'application/json' },
        }
      );
      setRecipes(response.data);
    } catch (error) {
      console.error('Failed to fetch best recipes:', error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchBestRecipes();
    }, [])
  );

  const renderRecipeCard = ({ item, index }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate('Recipe', { recipeId: item.id })}
      style={[
        styles.card,
        {
          marginLeft: index === 0 ? 20 : CARD_SPACING,
          marginRight: index === recipes.length - 1 ? 20 : CARD_SPACING,
        },
      ]}
    >
      <Image
        source={{
          uri: `https://recipe.keviniansyah.com/storage/${item.image}`,
        }}
        style={styles.cardImage}
      />
      <View style={styles.durationBadge}>
        <MaterialCommunityIcon name="timer" color="#ffffff" size={15} />
        <Text style={styles.durationText}>{item.duration} menit</Text>
      </View>
      <View style={styles.cardContent}>
        <View style={styles.statsContainer}>
          <StatItem icon="heart" count={item.like} />
          <StatItem icon="comment" count={item.comment} />
          <StatItem icon="bookmark" count={item.bookmark} />
        </View>
        <Text style={styles.cardTitle} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={styles.cardAuthor} numberOfLines={1}>
          By {item.user.name}
        </Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#FF6B00" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => navigation.navigate('Search')}
        style={styles.searchBar}
      >
        <MaterialIcon name="search" size={25} color="#9ca3af" />
        <Text style={styles.searchText}>Search Food and Recipes</Text>
      </TouchableOpacity>

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Best Recipes</Text>
        <TouchableOpacity>
          <Text style={styles.headerLink}>View All</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={recipes}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderRecipeCard}
      />
    </View>
  );
};

const StatItem = ({ icon, count }) => (
  <View style={styles.statItem}>
    <MaterialCommunityIcon name={icon} color="#9ca3af" size={15} />
    <Text style={styles.statText}>{count}</Text>
  </View>
);

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  searchBar: {
    height: 55,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F2F2',
    marginHorizontal: 20,
    marginTop: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
  },
  searchText: {
    flex: 1,
    marginLeft: 6,
    color: '#9ca3af',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginVertical: 15,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  headerLink: {
    fontSize: 14,
    color: '#16803d',
  },
  card: {
    width: CARD_WIDTH,
    height: 280,
    borderRadius: 10,
    backgroundColor: '#ffffff',
    borderWidth: 0.5,
    borderColor: '#e5e7eb',
  },
  cardImage: {
    width: '100%',
    height: '68%',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  durationBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF6B00',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  durationText: {
    color: '#ffffff',
    fontSize: 12,
    marginLeft: 5,
  },
  cardContent: {
    padding: 10,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  cardAuthor: {
    fontSize: 13,
    color: '#9ca3af',
    marginTop: 5,
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
  },
  statText: {
    fontSize: 12,
    marginLeft: 5,
  },
});

export default Home;
