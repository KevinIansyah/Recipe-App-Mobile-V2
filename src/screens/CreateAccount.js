import React, { useContext, useState } from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import axios from 'axios';
import { saveToken } from '../helpers/token';
import { AppContext } from '../context/AppContext';

const FormInput = ({ error, ...props }) => (
  <>
    <TextInput
      style={[styles.input, error && styles.inputError]}
      placeholderTextColor="#9CA3AF"
      {...props}
    />
    {error && <Text style={styles.errorText}>{error[0]}</Text>}
  </>
);

const SocialButton = ({ icon }) => (
  <TouchableOpacity style={styles.socialIcon}>
    <Image source={icon} style={styles.iconImage} />
  </TouchableOpacity>
);

const CreateAccount = ({ navigation }) => {
  const { setToken } = useContext(AppContext);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
  });
  const [errors, setErrors] = useState({});

  const handleCreateAccount = async () => {
    setErrors({});
    setLoading(true);

    try {
      const response = await axios.post(
        'https://recipe.keviniansyah.com/api/register',
        formData,
        {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        }
      );

      await saveToken(response.data.token);
      setToken(response.data.token);
      navigation.navigate('MainTabs', { screen: 'Home' });
    } catch (error) {
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      } else {
        alert('Network error! Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  const updateFormField = (field) => (text) => {
    setFormData((prev) => ({ ...prev, [field]: text }));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Buat Akun</Text>
      <Text style={styles.subtitle}>
        Isi informasi Anda di bawah ini atau daftar menggunakan akun sosial
      </Text>

      {['name', 'email', 'password', 'password_confirmation'].map((field) => (
        <FormInput
          key={field}
          placeholder={
            field === 'password_confirmation'
              ? 'Konfirmasi Password'
              : field.charAt(0).toUpperCase() + field.slice(1)
          }
          value={formData[field]}
          onChangeText={updateFormField(field)}
          secureTextEntry={field.includes('password')}
          error={errors[field]}
        />
      ))}

      <TouchableOpacity
        style={styles.button}
        onPress={handleCreateAccount}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator
            style={styles.buttonLoader}
            size={30}
            color="#ffffff"
          />
        ) : (
          <Text style={styles.buttonText}>Daftar</Text>
        )}
      </TouchableOpacity>

      <Text style={styles.orText}>atau daftar dengan</Text>

      <View style={styles.socialContainer}>
        {[
          require('../images/apple.png'),
          require('../images/facebook.png'),
          require('../images/gmail.png'),
        ].map((icon, index) => (
          <SocialButton key={index} icon={icon} />
        ))}
      </View>

      <Text style={styles.signInText}>
        Sudah punya akun?{' '}
        <Text
          style={styles.signInLink}
          onPress={() => navigation.replace('SignIn')}
        >
          Masuk
        </Text>
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#ffffff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 40,
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#888888',
    textAlign: 'center',
    marginBottom: 25,
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
  inputError: {
    borderColor: 'red',
    marginBottom: 5,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#FF6B00',
    borderRadius: 20,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    padding: 15,
  },
  buttonLoader: {
    padding: 11,
  },
  orText: {
    textAlign: 'center',
    marginVertical: 20,
    color: '#888888',
  },
  socialContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    marginBottom: 20,
  },
  socialIcon: {
    backgroundColor: '#f6f6f6',
    padding: 12,
    borderRadius: 50,
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconImage: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  signInText: {
    textAlign: 'center',
    color: '#888888',
    fontSize: 14,
  },
  signInLink: {
    color: '#FF6B00',
    fontWeight: 'bold',
  },
});

export default CreateAccount;
