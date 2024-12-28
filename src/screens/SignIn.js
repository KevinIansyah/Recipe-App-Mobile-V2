import React, { useContext, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import axios from 'axios';
import { saveToken } from '../helpers/token';
import { AppContext } from '../context/AppContext';

const FormInput = ({ error, ...props }) => (
  <TextInput
    style={[styles.input, error && styles.inputError]}
    placeholderTextColor="#9CA3AF"
    {...props}
  />
);

const SocialButton = ({ icon }) => (
  <TouchableOpacity style={styles.socialIcon}>
    <Image source={icon} style={styles.iconImage} />
  </TouchableOpacity>
);

const SignIn = ({ navigation }) => {
  const { setToken } = useContext(AppContext);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({
    email: '',
    password: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    setErrors({ message: '' });
    setLoading(true);

    try {
      const response = await axios.post(
        'https://recipe.keviniansyah.com/api/login',
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
      setErrors({
        message:
          error.response?.data?.message || 'Kredensial yang diberikan salah.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Masuk</Text>
      <Text style={styles.subtitle}>
        Hai! Selamat datang kembali, kami merindukanmu
      </Text>

      <FormInput
        placeholder="Email"
        value={formData.email}
        onChangeText={(email) => setFormData((prev) => ({ ...prev, email }))}
        error={errors.message}
      />
      {errors.email && <Text style={styles.errorText}>{errors.email[0]}</Text>}

      <FormInput
        placeholder="Password"
        secureTextEntry
        value={formData.password}
        onChangeText={(password) =>
          setFormData((prev) => ({ ...prev, password }))
        }
        error={errors.message}
      />
      {errors.password && (
        <Text style={styles.errorText}>{errors.password[0]}</Text>
      )}
      {errors.message && <Text style={styles.errorText}>{errors.message}</Text>}

      <TouchableOpacity
        style={styles.button}
        onPress={handleSignIn}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator
            style={styles.buttonLoader}
            size={30}
            color="#ffffff"
          />
        ) : (
          <Text style={styles.buttonText}>Masuk</Text>
        )}
      </TouchableOpacity>

      <Text style={styles.orText}>atau masuk dengan</Text>

      <View style={styles.socialContainer}>
        {[
          require('../images/apple.png'),
          require('../images/facebook.png'),
          require('../images/gmail.png'),
        ].map((icon, index) => (
          <SocialButton key={index} icon={icon} />
        ))}
      </View>

      <Text style={styles.signUpText}>
        Belum punya akun?{' '}
        <Text
          style={styles.signUpLink}
          onPress={() => navigation.replace('CreateAccount')}
        >
          Daftar
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
    fontSize: 30,
    fontWeight: 'bold',
    marginTop: 40,
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 17,
    color: '#888888',
    marginBottom: 30,
    textAlign: 'center',
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
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: -10,
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
    marginVertical: 15,
    marginBottom: 20,
    color: '#888888',
  },
  socialContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    gap: 20,
  },
  socialIcon: {
    backgroundColor: '#F6F6F6',
    padding: 12,
    borderRadius: 50,
    alignItems: 'center',
    width: 50,
    height: 50,
    justifyContent: 'center',
  },
  iconImage: {
    width: 25,
    height: 25,
    resizeMode: 'contain',
  },
  signUpText: {
    textAlign: 'center',
    color: '#888888',
  },
  signUpLink: {
    color: '#FF6B00',
    fontWeight: 'bold',
  },
});

export default SignIn;
