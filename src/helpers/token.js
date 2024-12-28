import * as SecureStore from 'expo-secure-store';

export const saveToken = async (token) => {
  try {
    await SecureStore.setItemAsync('userToken', token);
    console.log('Token saved securely');
  } catch (error) {
    console.error('Failed to save token', error);
  }
};

export const getToken = async () => {
  try {
    const token = await SecureStore.getItemAsync('userToken');
    if (token) {
      console.log('Token:', token);
      return token;
    }
    return null;
  } catch (error) {
    console.error('Failed to fetch token', error);
  }
};

export const removeToken = async () => {
  try {
    await SecureStore.deleteItemAsync('userToken');
    console.log('Token removed securely');
  } catch (error) {
    console.error('Failed to remove token', error);
  }
};
