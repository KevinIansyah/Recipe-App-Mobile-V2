import { useFocusEffect } from '@react-navigation/native';
import axios from 'axios';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useCallback, useContext, useRef, useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { AppContext } from '../context/AppContext';
import defaultProfile from '../images/default-profile.png';

const Recipe = ({ route }) => {
  const { token, user } = useContext(AppContext);
  const { recipeId } = route.params;
  const bottomSheetRef = useRef();

  const [recipe, setRecipe] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [like, setLike] = useState({});
  const [bookmark, setBookmark] = useState({});
  const [comment, setComment] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState('ingredients');

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getTruncatedText = (text, wordLimit) => {
    const words = text.split(' ');
    return words.length > wordLimit
      ? words.slice(0, wordLimit).join(' ') + '...'
      : text;
  };

  const handleLikeToggle = async () => {
    if (!user?.id || !token) {
      alert('Authentication required');
      return;
    }

    const formData = new FormData();
    formData.append('user_id', user.id);
    formData.append('recipe_id', recipeId);

    try {
      if (isLiked) {
        await axios.delete(
          `https://recipe.keviniansyah.com/api/like/${like.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: 'application/json',
            },
          }
        );
        setRecipe((prev) => ({ ...prev, like: prev.like - 1 }));
      } else {
        const response = await axios.post(
          'https://recipe.keviniansyah.com/api/like',
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
          }
        );
        setLike(response.data);
        setRecipe((prev) => ({ ...prev, like: prev.like + 1 }));
      }
      setIsLiked(!isLiked);
    } catch (error) {
      console.error('Like operation failed:', error);
    }
  };

  const handleBookmarkToggle = async () => {
    if (!user?.id || !token) {
      alert('Authentication required');
      return;
    }

    const formData = new FormData();
    formData.append('user_id', user.id);
    formData.append('recipe_id', recipeId);

    try {
      if (isBookmarked) {
        await axios.delete(
          `https://recipe.keviniansyah.com/api/bookmark/${bookmark.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: 'application/json',
            },
          }
        );
        setRecipe((prev) => ({ ...prev, bookmark: prev.bookmark - 1 }));
      } else {
        const response = await axios.post(
          'https://recipe.keviniansyah.com/api/bookmark',
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
          }
        );
        setBookmark(response.data);
        setRecipe((prev) => ({ ...prev, bookmark: prev.bookmark + 1 }));
      }
      setIsBookmarked(!isBookmarked);
    } catch (error) {
      console.error('Bookmark operation failed:', error);
    }
  };

  const fetchRecipeData = async () => {
    try {
      const [recipeResponse, likeStatus, bookmarkStatus] = await Promise.all([
        axios.get(`https://recipe.keviniansyah.com/api/recipe/${recipeId}`),
        user?.id &&
          axios.get(
            `https://recipe.keviniansyah.com/api/like?user_id=${user.id}&recipe_id=${recipeId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                Accept: 'application/json',
              },
            }
          ),
        user?.id &&
          axios.get(
            `https://recipe.keviniansyah.com/api/bookmark?user_id=${user.id}&recipe_id=${recipeId}&check_bookmark=y`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                Accept: 'application/json',
              },
            }
          ),
      ]);

      setRecipe(recipeResponse.data);
      if (likeStatus?.data && Object.keys(likeStatus.data).length > 0) {
        setIsLiked(true);
        setLike(likeStatus.data);
      }
      if (bookmarkStatus?.data && Object.keys(bookmarkStatus.data).length > 0) {
        setIsBookmarked(true);
        setBookmark(bookmarkStatus.data);
      }
    } catch (error) {
      console.error('Failed to fetch recipe data:', error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchRecipeData();
    }, [])
  );

  const renderInteractionButtons = () => (
    <View style={styles.interactionContainer}>
      <View style={styles.leftActions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={handleLikeToggle}
        >
          <MaterialCommunityIcon
            name={isLiked ? 'heart' : 'heart-outline'}
            color={isLiked ? 'red' : 'black'}
            size={25}
          />
          <Text style={styles.actionText}>{recipe.like}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          // onPress={() => bottomSheetRef.current.open()}
        >
          <MaterialCommunityIcon name="comment-outline" size={23} />
          <Text style={styles.actionText}>{recipe.comment}</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity onPress={handleBookmarkToggle}>
        <MaterialCommunityIcon
          name={isBookmarked ? 'bookmark' : 'bookmark-outline'}
          size={25}
        />
      </TouchableOpacity>
    </View>
  );

  const renderRecipeInfo = () => (
    <>
      <Text style={styles.title}>{recipe.name}</Text>
      <View style={styles.stats}>
        <View style={styles.stat}>
          <MaterialCommunityIcon name="timer" color="#16803d" size={15} />
          <Text style={styles.statText}>{recipe.duration} menit</Text>
        </View>
        <View style={styles.stat}>
          <MaterialCommunityIcon name="account" color="#16803d" size={17} />
          <Text style={styles.statText}>{recipe.servings} porsi</Text>
        </View>
      </View>
    </>
  );

  const renderProfile = () => (
    <View style={styles.profileBox}>
      <Image
        source={
          recipe.user?.image
            ? {
                uri: `https://recipe.keviniansyah.com/storage/${recipe.user.image}`,
              }
            : defaultProfile
        }
        style={styles.profileImage}
      />
      <View>
        <Text style={styles.profileName}>{recipe.user.name}</Text>
        <Text style={styles.profileCreated}>
          {formatDate(recipe.created_at)}
        </Text>
      </View>
    </View>
  );

  const renderDescription = () => (
    <>
      <Text style={styles.sectionTitle}>Deskripsi</Text>
      <Text style={styles.description}>
        {isExpanded
          ? recipe.description
          : getTruncatedText(recipe.description, 20)}
        {recipe.description.split(' ').length > 20 && (
          <TouchableOpacity onPress={() => setIsExpanded(!isExpanded)}>
            <Text style={styles.readMore}>
              {isExpanded ? 'Show Less' : 'Read More'}
            </Text>
          </TouchableOpacity>
        )}
      </Text>
    </>
  );

  const renderTabs = () => (
    <View style={styles.tabs}>
      {['ingredients', 'steps'].map((tab) => (
        <TouchableOpacity
          key={tab}
          style={[styles.tab, activeTab === tab && styles.activeTab]}
          onPress={() => setActiveTab(tab)}
        >
          <Text
            style={[styles.tabText, activeTab === tab && styles.activeTabText]}
          >
            {tab === 'ingredients' ? 'Bahan' : 'Langkah'}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderContent = () => (
    <View style={styles.contentContainer}>
      {activeTab === 'ingredients'
        ? recipe.ingredients?.map((item) => (
            <View key={item.id} style={styles.listItem}>
              <View style={styles.itemNumber}>
                <Text style={styles.numberText}>{item.order}</Text>
              </View>
              <Text style={styles.itemText}>{item.description}</Text>
            </View>
          ))
        : recipe.steps?.map((item) => (
            <View key={item.id} style={styles.listItem}>
              <View style={styles.itemNumber}>
                <Text style={styles.numberText}>{item.order}</Text>
              </View>
              <Text style={styles.itemText}>{item.description}</Text>
            </View>
          ))}
    </View>
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#FF6B00" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.imageWrapper}>
        <Image
          source={{
            uri: `https://recipe.keviniansyah.com/storage/${recipe.image}`,
          }}
          style={styles.image}
        />
        <LinearGradient
          colors={['transparent', '#fff']}
          style={styles.gradient}
        />
      </View>

      <View style={styles.content}>
        {renderInteractionButtons()}
        {renderRecipeInfo()}
        {renderProfile()}
        {renderDescription()}
        {renderTabs()}
        {renderContent()}
      </View>

      {/* <RBSheet
        ref={bottomSheetRef}
        height={height * 0.8}
        closeOnPressMask={false}
        customStyles={{
          container: {
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
          },
        }}
      >
        <View style={styles.commentSheet}>
          <Text style={styles.commentTitle}>Komentar</Text>
          <ScrollView style={styles.commentList}>
            <TextInput
              style={styles.commentInput}
              value={comment}
              onChangeText={setComment}
              placeholder="Tulis komentar..."
              multiline
            />
          </ScrollView>
          <TouchableOpacity
            style={styles.sendButton}
            onPress={() => {
              setComment('');
              bottomSheetRef.current.close();
            }}
          >
            <Text style={styles.sendButtonText}>Kirim</Text>
          </TouchableOpacity>
        </View>
      </RBSheet> */}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  imageWrapper: { position: 'relative' },
  image: { width: '100%', height: 400 },
  gradient: { position: 'absolute', bottom: 0, width: '100%', height: 100 },
  content: { padding: 20 },

  interactionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  leftActions: { flexDirection: 'row', gap: 15 },
  actionButton: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  actionText: { marginLeft: 5 },

  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FF6B00',
    marginBottom: 10,
  },
  stats: { flexDirection: 'row', gap: 15, marginBottom: 20 },
  stat: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  statText: { fontSize: 12 },

  profileBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  profileName: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  profileCreated: {
    fontSize: 12,
    color: '#666',
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 20,
  },
  readMore: {
    color: '#FF6B00',
    marginLeft: 5,
  },

  tabs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  tab: { flex: 1, paddingVertical: 10, alignItems: 'center' },
  activeTab: { borderBottomWidth: 2, borderBottomColor: '#FF6B00' },
  tabText: { fontSize: 16, fontWeight: 'bold' },
  activeTabText: { color: '#FF6B00' },

  contentContainer: {
    backgroundColor: '#F9F9F9',
    padding: 20,
    borderRadius: 10,
  },
  listItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  itemNumber: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FF6B00',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  numberText: { color: '#fff', fontSize: 12 },
  itemText: { flex: 1, fontSize: 14 },

  commentSheet: { flex: 1 },
  commentTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    backgroundColor: '#FF6B00',
    padding: 15,
  },
  commentList: { flex: 1, padding: 20 },
  commentInput: {
    height: 200,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 10,
  },
  commentInput: {
    height: 200,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    textAlignVertical: 'top',
    backgroundColor: '#fff',
    marginBottom: 10,
  },
  sendButton: {
    backgroundColor: '#FF6B00',
    padding: 15,
    alignItems: 'center',
  },
  sendButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default Recipe;
