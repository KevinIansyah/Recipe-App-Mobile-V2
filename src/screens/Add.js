import React, { useContext, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
  ImageBackground,
} from 'react-native';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import { AppContext } from '../context/AppContext';

const INITIAL_FORM = {
  name: '',
  description: '',
  servings: '',
  duration: '',
  media: '',
};

const FormInput = ({ error, focused, ...props }) => (
  <TextInput
    style={[
      styles.input,
      error && styles.inputError,
      focused && styles.inputFocused,
      props.multiline && styles.textArea,
    ]}
    placeholderTextColor="#9CA3AF"
    {...props}
  />
);

const ListItem = ({
  item,
  index,
  onUpdate,
  onDelete,
  type,
  error,
  focused,
  onFocus,
  onBlur,
}) => (
  <View>
    <View style={styles.listItemContainer}>
      <MaterialCommunityIcon name="drag" size={24} color="#000000" />
      <TextInput
        multiline={type === 'steps'}
        style={[
          type === 'steps' ? styles.stepsInput : styles.ingredientsInput,
          error && styles[`${type}InputError`],
          focused && {},
        ]}
        value={item.text}
        onChangeText={(text) => onUpdate(text, item.id)}
        placeholder={
          type === 'steps'
            ? 'Potong ayam menjadi beberapa bagian, sisihkan.'
            : '1/2 ekor ayam'
        }
        placeholderTextColor="#9CA3AF"
        onFocus={onFocus}
        onBlur={onBlur}
      />
      <TouchableOpacity onPress={() => onDelete(item.id)}>
        <MaterialCommunityIcon
          name="trash-can-outline"
          size={22}
          color="#000000"
        />
      </TouchableOpacity>
    </View>
    {error && (
      <Text style={[styles.errorText, { marginTop: -10 }]}>{error}</Text>
    )}
  </View>
);

const Add = () => {
  const { token, user } = useContext(AppContext);
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [items, setItems] = useState({
    ingredients: [{ id: Date.now().toString(), text: '' }],
    steps: [{ id: Date.now().toString(), text: '' }],
  });
  const [image, setImage] = useState(null);
  const [errors, setErrors] = useState({});
  const [focusedField, setFocusedField] = useState(null);

  const handleItemUpdate = (type) => (text, id) => {
    setItems((prev) => ({
      ...prev,
      [type]: prev[type].map((item) =>
        item.id === id ? { ...item, text } : item
      ),
    }));
  };

  const handleItemAdd = (type) => () => {
    setItems((prev) => ({
      ...prev,
      [type]: [...prev[type], { id: Date.now().toString(), text: '' }],
    }));
  };

  const handleItemDelete = (type) => (id) => {
    setItems((prev) => ({
      ...prev,
      [type]: prev[type].filter((item) => item.id !== id),
    }));
  };

  const handleImagePick = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Permission to access gallery is required!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.5,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const getLabel = (field) => {
    switch (field) {
      case 'media':
        return 'YouTube Link (opsional)';
      case 'name':
        return 'Sate Ayam';
      case 'duration':
        return '60 (dalam menit)';
      case 'servings':
        return '3 (porsi)';
      case 'description':
        return 'Cerita di balik masakan ini. Apa atau siapa yang menginspirasimu? Apa yang membuatnya istimewa? Bagaimana caramu menikmatinya?';
      default:
        return '';
    }
  };

  const handleSubmit = async () => {
    if (!user?.id || !token) {
      alert('Authentication required');
      return;
    }

    const formDataToSend = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      formDataToSend.append(key, value);
    });
    formDataToSend.append('user_id', user.id);

    if (image) {
      const filename = image.split('/').pop();
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : `image`;
      formDataToSend.append('image', { uri: image, name: filename, type });
    }

    items.ingredients.forEach((item) =>
      formDataToSend.append('ingredients[]', item.text)
    );
    items.steps.forEach((item) => formDataToSend.append('steps[]', item.text));

    try {
      await axios.post(
        'https://recipe.keviniansyah.com/api/recipe',
        formDataToSend,
        {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setFormData(INITIAL_FORM);
      setItems({
        ingredients: [{ id: Date.now().toString(), text: '' }],
        steps: [{ id: Date.now().toString(), text: '' }],
      });
      setImage(null);
      setErrors({});
      alert('Recipe added successfully!');
    } catch (error) {
      setErrors(error.response?.data?.errors || {});
    }
  };

  return (
    <KeyboardAwareScrollView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <TouchableOpacity
          onPress={handleImagePick}
          style={[styles.addImage, errors.image && styles.addImageError]}
        >
          {image ? (
            <ImageBackground
              source={{ uri: image }}
              style={styles.imageBackground}
              imageStyle={styles.imageStyle}
            >
              <View
                style={[
                  styles.cameraIconOverlay,
                  { backgroundColor: 'rgba(0, 0, 0, 0.5)' },
                ]}
              >
                <MaterialCommunityIcon
                  name="camera"
                  size={24}
                  color="#ffffff"
                />
              </View>
            </ImageBackground>
          ) : (
            <View style={styles.cameraIconOverlay}>
              <MaterialCommunityIcon name="camera" size={24} color="#ffffff" />
            </View>
          )}
        </TouchableOpacity>
        {errors.image && (
          <Text style={styles.errorText}>{errors.image[0]}</Text>
        )}

        {['name', 'description', 'servings', 'duration', 'media'].map(
          (field) => (
            <View key={field}>
              <FormInput
                multiline={field === 'description'}
                keyboardType={
                  ['servings', 'duration'].includes(field)
                    ? 'numeric'
                    : 'default'
                }
                placeholder={`${
                  field.charAt(0).toUpperCase() + field.slice(1)
                }: ${getLabel(field)}`}
                value={formData[field]}
                onChangeText={(text) =>
                  setFormData((prev) => ({ ...prev, [field]: text }))
                }
                error={errors[field]}
                focused={focusedField === field}
                onFocus={() => setFocusedField(field)}
                onBlur={() => setFocusedField(null)}
              />
              {errors[field] && (
                <Text style={styles.errorText}>{errors[field][0]}</Text>
              )}
            </View>
          )
        )}

        {['ingredients', 'steps'].map((type) => (
          <View key={type}>
            <Text style={styles.sectionTitle}>
              {type === 'ingredients' ? 'Bahan-bahan' : 'Langkah-langkah'}
            </Text>
            {items[type].map((item, index) => (
              <ListItem
                key={item.id}
                item={item}
                index={index}
                type={type}
                onUpdate={handleItemUpdate(type)}
                onDelete={handleItemDelete(type)}
                error={errors[`${type}.${index}`]?.[0]}
                focused={focusedField === `${type}.${index}`}
                onFocus={() => setFocusedField(`${type}.${index}`)}
                onBlur={() => setFocusedField(null)}
              />
            ))}
            <TouchableOpacity
              onPress={handleItemAdd(type)}
              style={styles.addButton}
            >
              <MaterialCommunityIcon name="plus" size={24} color="#000000" />
              <Text style={styles.addButtonText}>
                Tambah {type === 'ingredients' ? 'bahan' : 'langkah'}
              </Text>
            </TouchableOpacity>
          </View>
        ))}

        <TouchableOpacity onPress={handleSubmit} style={styles.submitButton}>
          <Text style={styles.submitButtonText}>Simpan Resep</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  scrollContainer: {
    padding: 16,
  },
  input: {
    backgroundColor: '#F3F4F6',
    borderRadius: 10,
    padding: 12,
    height: 55,
    fontSize: 15,
    color: '#333333',
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  textArea: {
    height: 100,
  },
  inputError: {
    borderColor: 'red',
    marginBottom: 5,
  },
  inputFocused: {
    // borderColor: '#FF6B00',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginBottom: 15,
  },
  ingredientsInputError: {
    borderColor: 'red',
  },
  stepsInputError: {
    borderColor: 'red',
  },
  addImage: {
    width: '100%',
    height: 350,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  addImageError: {
    borderColor: 'red',
    marginBottom: 5,
  },
  imageBackground: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageStyle: {
    borderRadius: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  listItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  ingredientsInput: {
    flex: 1,
    marginHorizontal: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 10,
    padding: 12,
    height: 55,
    fontSize: 15,
    color: '#333333',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  stepsInput: {
    flex: 1,
    marginHorizontal: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 10,
    padding: 12,
    height: 100,
    fontSize: 15,
    color: '#333333',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingVertical: 10,
    marginBottom: 15,
  },
  addButtonText: {
    color: '#000000',
    fontSize: 14,
  },
  submitButton: {
    // backgroundColor: '#FF6B00',
    backgroundColor: '#000',
    borderRadius: 20,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    padding: 15,
  },
  cameraIconOverlay: {
    // position: 'absolute',
    // right: 0,
    // bottom: 0,
    backgroundColor: '#000000',
    borderRadius: 20,
    padding: 8,
  },
});

export default Add;
