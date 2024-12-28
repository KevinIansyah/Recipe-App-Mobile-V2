import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';

const OnboardingData = [
  {
    title: 'Belajar Memasak Jadi Lebih Mudah',
    description:
      'Pelajari cara memasak berbagai macam hidangan lezat dalam hitungan menit.',
    image: require('../images/1.png'),
  },
  {
    title: 'Cari Makanan dan Tonton Video',
    description:
      'Cari makanan yang ingin kamu masak, tonton video tutorial dalam berbagai bahasa pilihan.',
    image: require('../images/2.png'),
  },
  {
    title: 'Yummy! Selamat Memasak!',
    description: 'Selamat memasak dan nikmati hidanganmu.',
    image: require('../images/3.png'),
  },
];

const Dot = ({ active }) => (
  <View
    style={[styles.dot, { backgroundColor: active ? '#FF6B00' : '#CCCCCC' }]}
  />
);

const NavigationButton = ({ text, onPress, isNext }) => (
  <TouchableOpacity onPress={onPress}>
    {isNext ? (
      <View style={styles.nextButton}>
        <Text style={styles.nextButtonText}>{text}</Text>
      </View>
    ) : (
      <Text style={styles.skipButton}>{text}</Text>
    )}
  </TouchableOpacity>
);

const OnboardingScreen = ({ navigation }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const isLastPage = currentPage === OnboardingData.length - 1;

  const handleNavigation = () => {
    if (isLastPage) {
      navigation.replace('SignIn');
    } else {
      setCurrentPage((prev) => prev + 1);
    }
  };

  return (
    <View style={styles.container}>
      <Image source={OnboardingData[currentPage].image} style={styles.image} />
      <Text style={styles.title}>{OnboardingData[currentPage].title}</Text>
      <Text style={styles.description}>
        {OnboardingData[currentPage].description}
      </Text>

      <View style={styles.pagination}>
        {OnboardingData.map((_, index) => (
          <Dot key={index} active={index === currentPage} />
        ))}
      </View>

      <View style={styles.buttonContainer}>
        <NavigationButton
          text={currentPage === 0 ? 'Lewati' : 'Kembali'}
          onPress={
            currentPage === 0
              ? () => navigation.replace('SignIn')
              : () => setCurrentPage((prev) => prev - 1)
          }
        />
        <NavigationButton
          text={isLastPage ? 'Mulai' : 'Lanjut'}
          onPress={handleNavigation}
          isNext
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  image: {
    width: 500,
    height: 500,
    resizeMode: 'cover',
    marginBottom: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333333',
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    color: '#555555',
    marginTop: 10,
    paddingHorizontal: 10,
  },
  pagination: {
    flexDirection: 'row',
    marginTop: 25,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    position: 'absolute',
    bottom: 40,
  },
  skipButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    color: '#FF6B00',
    fontSize: 16,
    fontWeight: 'bold',
  },
  nextButton: {
    backgroundColor: '#FF6B00',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  nextButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default OnboardingScreen;
