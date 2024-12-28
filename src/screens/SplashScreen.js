import React, { useEffect } from 'react';
import { View, StyleSheet, Animated, Easing, Image } from 'react-native';
import { getToken } from '../helpers/token';

const SplashScreen = ({ navigation }) => {
  const opacity = new Animated.Value(0);

  useEffect(() => {
    const navigate = async () => {
      const token = await getToken();
      navigation.replace(token ? 'MainTabs' : 'OnboardingScreen', 
        token ? { screen: 'Home' } : undefined
      );
    };

    Animated.sequence([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 2000,
        easing: Easing.ease,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 2000,
        easing: Easing.ease,
        useNativeDriver: true,
      }),
    ]).start(navigate);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Animated.Image
        source={require('../images/splashscreen.png')}
        style={[styles.logo, { opacity }]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF6B00',
  },
  logo: {
    width: 200,
    height: 200,
  },
});

export default SplashScreen;