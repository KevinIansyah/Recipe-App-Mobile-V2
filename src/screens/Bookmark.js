import React, { useCallback, useContext, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import { AppContext } from '../context/AppContext';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useFocusEffect } from '@react-navigation/native';
import axios from 'axios';

const BookmarkCard = ({ item, onPress, isLast }) => (
  <TouchableOpacity
    style={[styles.card, isLast && { marginBottom: 60 }]}
    onPress={onPress}
  >
    <View style={styles.imageBox}>
      <Image
        source={{
          uri: `https://recipe.keviniansyah.com/storage/${item.recipe.image}`,
        }}
        style={styles.image}
        resizeMode="cover"
      />
    </View>
    <View style={styles.content}>
      <Text style={styles.title} numberOfLines={1}>
        {item.recipe.name}
      </Text>
      <Text style={styles.subTitle}>By {item.recipe.user.name}</Text>

      <View style={styles.iconContainer}>
        <View style={styles.iconBox}>
          <MaterialCommunityIcon name="timer" color="#16803d" size={15} />
          <Text style={styles.iconText}>{item.recipe.duration} menit</Text>
        </View>
        <View style={styles.iconBox}>
          <MaterialCommunityIcon name="account" color="#16803d" size={17} />
          <Text style={styles.iconText}>{item.recipe.servings} porsi</Text>
        </View>
      </View>

      <Text style={styles.description} numberOfLines={2}>
        {item.recipe.description}
      </Text>
    </View>
  </TouchableOpacity>
);

const Bookmark = ({ navigation }) => {
  const { token, user } = useContext(AppContext);
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBookmarks = async () => {
    if (!user?.id || !token) {
      alert('Data not found');
      return;
    }

    try {
      const response = await axios.get(
        `https://recipe.keviniansyah.com/api/bookmark?user_id=${user.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
        }
      );
      setBookmarks(response.data);
    } catch (error) {
      console.error('Failed to fetch bookmarks:', error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchBookmarks();
    }, [])
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF6B00" />
      </View>
    );
  }

  if (bookmarks.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.emptyMessage}>
          Anda belum menambahkan resep ke bookmark!
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.recipeContainer}
        showsVerticalScrollIndicator={false}
      >
        {bookmarks.map((item, index) => (
          <BookmarkCard
            key={item.id}
            item={item}
            isLast={index === bookmarks.length - 1}
            onPress={() =>
              navigation.navigate('Recipe', { recipeId: item.recipe.id })
            }
          />
        ))}
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
  emptyMessage: {
    color: '#9ca3af',
    textAlign: 'center',
  },
});

export default Bookmark;
