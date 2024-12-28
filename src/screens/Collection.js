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
import Modal from 'react-native-modal';
import axios from 'axios';
import { useFocusEffect } from '@react-navigation/native';

const RecipeCard = ({ item, onPress, onMorePress, isLast }) => (
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
      <TouchableOpacity style={styles.moreOptions} onPress={onMorePress}>
        <MaterialCommunityIcon name="dots-vertical" size={20} color="white" />
      </TouchableOpacity>
    </View>
    <View style={styles.content}>
      <Text style={styles.title} numberOfLines={1}>
        {item.name}
      </Text>
      <Text style={styles.subTitle} numberOfLines={2}>
        {item.description}
      </Text>
      <View style={styles.iconContainer}>
        {[
          { icon: 'heart', count: item.like },
          { icon: 'comment', count: item.comment },
          { icon: 'bookmark', count: item.bookmark },
        ].map((stat, index) => (
          <View key={stat.icon} style={styles.iconBox}>
            <MaterialCommunityIcon name={stat.icon} color="#9ca3af" size={15} />
            <Text style={styles.iconText}>{stat.count}</Text>
          </View>
        ))}
      </View>
    </View>
  </TouchableOpacity>
);

const ActionModal = ({
  isVisible,
  onClose,
  onEdit,
  onDelete,
  title = 'Pilih Aksi',
}) => (
  <Modal isVisible={isVisible} onBackdropPress={onClose} style={styles.modal}>
    <View style={styles.modalContent}>
      <Text style={styles.modalTitle}>{title}</Text>
      <View style={styles.buttonModalBox}>
        <TouchableOpacity
          style={[styles.button, { marginRight: 5 }]}
          onPress={onEdit}
        >
          <Text style={styles.buttonText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, { marginLeft: 5 }]}
          onPress={onDelete}
        >
          <Text style={styles.buttonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  </Modal>
);

const Collection = ({ navigation }) => {
  const { token, user } = useContext(AppContext);
  const [recipe, setRecipe] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  const fetchRecipe = async () => {
    if (!user?.id || !token) {
      alert('Data not found');
      return;
    }

    try {
      const response = await axios.get(
        `https://recipe.keviniansyah.com/api/user-recipe?user_id=${user.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
        }
      );
      setRecipe(response.data);
    } catch (error) {
      console.error('Failed to fetch recipes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!user?.id || !token) {
      alert('Data not found');
      return;
    }

    try {
      await axios.delete(`https://recipe.keviniansyah.com/api/recipe/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      });
      await fetchRecipe();
    } catch (error) {
      console.error('Failed to delete recipe:', error);
    } finally {
      setModalVisible(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchRecipe();
    }, [])
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF6B00" />
      </View>
    );
  }

  if (recipe.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.emptyMessage}>Anda belum mempunyai resep!</Text>
        <TouchableOpacity
          style={styles.editProfileButton}
          onPress={() => navigation.navigate('Add')}
        >
          <Text style={styles.editProfileText}>Tambah</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.recipeContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.buttonContainer}>
          <Text style={styles.header}>({recipe.length}) Resep</Text>
          <TouchableOpacity
            style={styles.editProfileButton}
            onPress={() => navigation.navigate('Add')}
          >
            <Text style={styles.editProfileText}>Tambah</Text>
          </TouchableOpacity>
        </View>

        {recipe.map((item, index) => (
          <RecipeCard
            key={item.id}
            item={item}
            isLast={index === recipe.length - 1}
            onPress={() => navigation.navigate('Recipe', { recipeId: item.id })}
            onMorePress={() => {
              setSelectedRecipe(item);
              setModalVisible(true);
            }}
          />
        ))}
      </ScrollView>

      <ActionModal
        isVisible={modalVisible}
        onClose={() => setModalVisible(false)}
        onEdit={() => {
          setModalVisible(false);
          navigation.navigate('Edit', { recipeId: selectedRecipe.id });
        }}
        onDelete={() => handleDelete(selectedRecipe.id)}
      />
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
    height: 100,
    position: 'relative',
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 6,
  },
  moreOptions: {
    position: 'absolute',
    top: 5,
    left: 5,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 50,
    padding: 5,
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
    marginBottom: 5,
  },
  subTitle: {
    fontSize: 12,
    marginBottom: 10,
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
  },
  iconText: {
    marginLeft: 5,
    fontSize: 12,
  },
  emptyMessage: {
    color: '#9ca3af',
    textAlign: 'center',
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  buttonModalBox: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  button: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    paddingVertical: 8,
    paddingHorizontal: 20,
    backgroundColor: '#000',
    borderRadius: 20,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  editProfileButton: {
    marginTop: 10,
    paddingVertical: 8,
    paddingHorizontal: 20,
    backgroundColor: '#000',
    borderRadius: 20,
  },
  editProfileText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default Collection;
