import React, { useCallback, useContext, useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { useFocusEffect } from '@react-navigation/native';
import { removeToken } from '../helpers/token';
import defaultProfile from '../images/default-profile.png';

const Profile = ({ navigation }) => {
  const [totalResep, setTotalResep] = useState(0);
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState(null);

  const { token, setToken, user, setUser } = useContext(AppContext);

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
      setProfileData(response.data);
      setUser(response.data);
    } catch (error) {
      console.error('Failed to fetch profile:', error);
    }
  };

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
      setTotalResep(response.data.length);
    } catch (error) {
      console.error('Failed to fetch recipes:', error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      const loadData = async () => {
        setLoading(true);
        await fetchProfile();
        await fetchRecipe();
        setLoading(false);
      };
      loadData();
    }, [])
  );

  const handleLogout = async () => {
    try {
      if (!user?.id || !token) {
        alert('Authentication required');
        return;
      }

      const response = await axios.post(
        'https://recipe.keviniansyah.com/api/logout',
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.status === 200) {
        await removeToken();
        setUser({});
        setToken(null);
        navigation.replace('SignIn');
      } else {
        console.error('Logout failed');
      }
    } catch (error) {
      console.error('Logout error', error);
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
      {/* Profile Header */}
      <View style={styles.profileContainer}>
        <Image
          source={
            profileData?.image
              ? {
                  uri: `https://recipe.keviniansyah.com/storage/${profileData.image}`,
                }
              : defaultProfile
          }
          style={styles.avatar}
          onError={(e) => {
            console.log('Image loading error:', e);
          }}
        />
        <Text style={styles.name}>{profileData?.name || 'User'}</Text>
        <Text style={styles.email}>{profileData?.email || ''}</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate('EditProfile')}
          style={styles.editProfileButton}
        >
          <Text style={styles.editProfileText}>Edit profil</Text>
        </TouchableOpacity>
      </View>

      {/* Inventories Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Inventaris</Text>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('MainTabs', { screen: 'Resep Anda' })
          }
          style={styles.row}
        >
          <Text style={styles.rowText}>Resep Saya</Text>
          <Text style={styles.badge}>{totalResep}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.row}>
          <Text style={styles.rowText}>Bantuan</Text>
        </TouchableOpacity>
      </View>

      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
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
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  profileContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  email: {
    fontSize: 14,
    color: '#888',
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
  section: {
    marginVertical: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  rowText: {
    fontSize: 16,
    color: '#333',
  },
  badge: {
    backgroundColor: '#FF6B00',
    color: '#fff',
    borderRadius: 10,
    paddingVertical: 2,
    paddingHorizontal: 8,
    fontSize: 12,
    fontWeight: 'bold',
  },
  logoutButton: {
    marginTop: 20,
    marginBottom: 60,
    backgroundColor: '#ff4d4d',
    paddingVertical: 15,
    alignItems: 'center',
    borderRadius: 20,
  },
  logoutText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default Profile;
