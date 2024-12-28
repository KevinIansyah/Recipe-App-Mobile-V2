import React, { useCallback, useContext, useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import defaultProfile from '../images/default-profile.png';

const EditProfile = ({ navigation }) => {
  const { token, user, setUser } = useContext(AppContext);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [image, setImage] = useState(null);
  const [errors, setErrors] = useState({});
  const [focusedField, setFocusedField] = useState(null);

  const fetchProfile = async () => {
    if (!user?.id || !token) {
      alert('Authentication required');
      return;
    }

    try {
      const response = await axios.get(
        `https://recipe.keviniansyah.com/api/user`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
        }
      );

      setName(response.data.name || '');
      if (response.data.image) {
        setImage(
          `https://recipe.keviniansyah.com/storage/${response.data.image}`
        );
      } else {
        setImage(null);
      }
      setUser(response.data);
    } catch (error) {
      console.error('Failed to fetch profile:', error);
      alert('Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [token, user.id]);

  const handleImagePick = async () => {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
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
    } catch (error) {
      alert('Error selecting image');
    }
  };

  const handleSubmit = async () => {
    if (!user?.id || !token) {
      alert('Authentication required');
      return;
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('_method', 'PUT');

    if (image && !image.startsWith('http')) {
      const filename = image.split('/').pop();
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : `image`;
      formData.append('image', {
        uri: image,
        name: filename,
        type,
      });
    }

    try {
      const response = await axios.post(
        `https://recipe.keviniansyah.com/api/user/${user.id}`,
        formData,
        {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setUser(response.data);
      await fetchProfile();
      alert('Profile updated successfully!');
      navigation.goBack();
    } catch (error) {
      console.log('Error response:', error.response?.data);
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      } else {
        alert(error.response?.data?.message || 'Update failed');
      }
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF6B00" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity
        onPress={handleImagePick}
        style={[styles.imageContainer, errors.image && styles.imageError]}
      >
        {image ? (
          <Image
            source={{ uri: image }}
            style={styles.profileImage}
            onError={(error) => {
              console.log('Image loading error:', error);
              setImage(null);
            }}
          />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Image source={defaultProfile} style={styles.profileImage} />
          </View>
        )}
        <View style={styles.cameraIconOverlay}>
          <MaterialCommunityIcon name="camera" size={24} color="#ffffff" />
        </View>
      </TouchableOpacity>
      {errors.image && <Text style={styles.errorText}>{errors.image[0]}</Text>}

      <View style={styles.inputContainer}>
        <TextInput
          style={[
            styles.input,
            errors.name && styles.inputError,
            focusedField === 'name' && styles.inputFocused,
          ]}
          value={name}
          onChangeText={setName}
          placeholder="Enter your name"
          onFocus={() => setFocusedField('name')}
          onBlur={() => setFocusedField(null)}
        />
        {errors.name && <Text style={styles.errorText}>{errors.name[0]}</Text>}
      </View>

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Update Profile</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 16,
  },
  imageContainer: {
    width: 120,
    height: 120,
    alignSelf: 'center',
    marginVertical: 20,
    borderRadius: 60,
    position: 'relative',
  },
  profileImage: {
    width: '100%',
    height: '100%',
    borderRadius: 60,
  },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#F3F4F6',
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  imageError: {
    borderColor: 'red',
    borderWidth: 1,
  },
  cameraIconOverlay: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    backgroundColor: '#000000',
    borderRadius: 20,
    padding: 8,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
    color: '#374151',
  },
  input: {
    backgroundColor: '#F3F4F6',
    borderRadius: 10,
    padding: 12,
    height: 55,
    fontSize: 15,
    color: '#333333',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  inputError: {
    borderColor: 'red',
  },
  inputFocused: {
    // borderColor: '#FF6B00',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 4,
  },
  submitButton: {
    backgroundColor: '#000000',
    borderRadius: 20,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    padding: 15,
  },
});

export default EditProfile;
